import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  isPostgrestMissingColumnOrSchemaCacheError,
  throwMappedPostgrestError,
} from '../common/map-postgrest-error';
import {
  CloudinaryService,
  isNonEmptyUploadedFile,
} from '../cloudinary/cloudinary.service';
import { SupabaseService } from '../supabase/supabase.service';
import type { Database } from '../types/database.types';
import { CreateTalentRegisterDto } from './dto/create-talent-register.dto';
import { UpdateTalentProfileDto } from './dto/update-talent-profile.dto';
import { UpdateTalentRoleSkillsDto } from './dto/update-talent-role-skills.dto';
import { SaveSkillRatingsDto } from './dto/save-skill-ratings.dto';

type TalentProfileRow = Database['public']['Tables']['Talent_profile']['Row'];
type TalentProfileUpdate =
  Database['public']['Tables']['Talent_profile']['Update'];
type TalentProfileInsert =
  Database['public']['Tables']['Talent_profile']['Insert'];
type UserRow = Database['public']['Tables']['User']['Row'];
export type TalentProfileListItem = TalentProfileRow & {
  User?: Pick<UserRow, 'id' | 'first_name' | 'last_name' | 'active'> | null;
};

/** Postgres unique_violation — suele ocurrir si un trigger ya insertó en `User` al hacer signUp. */
function isUniqueViolation(err: { code?: string; message?: string }): boolean {
  return (
    err.code === '23505' ||
    (err.message?.toLowerCase().includes('duplicate key') ?? false)
  );
}

@Injectable()
export class TalentService {
  private readonly gemini: GoogleGenerativeAI;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly config: ConfigService,
  ) {
    const apiKey = this.config.getOrThrow<string>('GEMINI_API_KEY');
    this.gemini = new GoogleGenerativeAI(apiKey);
  }

  /** Fuerza solo `user_id` + `location` en registro (sin intentar columnas extendidas). */
  private isForcedLegacySchema(): boolean {
    const legacy = this.config
      .get<string>('SUPABASE_TALENT_LEGACY_SCHEMA')
      ?.toLowerCase();
    return legacy === 'true' || legacy === '1' || legacy === 'yes';
  }

  /**
   * Controla PATCH y campos “extendidos” cuando no querés intentos oportunistas.
   * En **registro**, `availability` / `avatar_url` se intentan igual si existen columnas (sin depender de esta flag).
   */
  private isExtendedTalentProfileSchema(): boolean {
    if (this.isForcedLegacySchema()) {
      return false;
    }
    const v = this.config
      .get<string>('SUPABASE_TALENT_EXTENDED_SCHEMA', 'false')
      ?.toLowerCase();
    return v === 'true' || v === '1' || v === 'yes';
  }

  /**
   * Registro con archivo opcional (multipart campo `file`).
   * El usuario ya fue creado en auth — recibe userId del token.
   */
  async register(userId: string, file: unknown, dto: CreateTalentRegisterDto) {
    const client = this.supabaseService.getClient();

    // Actualizar first_name y last_name en auth metadata y en public.User
    await client.auth.admin.updateUserById(userId, {
      user_metadata: {
        first_name: dto.first_name,
        last_name: dto.last_name,
      },
    });

    const userRow = {
      id: userId,
      first_name: dto.first_name,
      last_name: dto.last_name,
      role: 'TALENT' as const,
      active: true,
    };

    const { error: userInsertError } = await client
      .from('User')
      .insert(userRow);

    if (userInsertError) {
      if (!isUniqueViolation(userInsertError)) {
        throwMappedPostgrestError(userInsertError);
      }
      const { error: userUpdateError } = await client
        .from('User')
        .update({
          first_name: dto.first_name,
          last_name: dto.last_name,
          role: 'TALENT',
          active: true,
        })
        .eq('id', userId);
      if (userUpdateError) {
        throwMappedPostgrestError(userUpdateError);
      }
    }

    const legacyForced = this.isForcedLegacySchema();
    const persistenceNotes: string[] = [];

    const baseProfileInsert: TalentProfileInsert = {
      user_id: userId,
      location: dto.location ?? null,
    };
    let profileInsert: TalentProfileInsert = baseProfileInsert;
    if (!legacyForced && dto.availability !== undefined) {
      profileInsert = {
        ...baseProfileInsert,
        availability: dto.availability,
      };
    }

    const { data: existingProfile } = await client
      .from('Talent_profile')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    let profile: { id: string };
    if (existingProfile) {
      profile = existingProfile;
      let patch: TalentProfileUpdate = {
        location: dto.location ?? null,
      };
      if (!legacyForced && dto.availability !== undefined) {
        patch = { ...patch, availability: dto.availability };
      }
      const { error: patchErr } = await client
        .from('Talent_profile')
        .update(patch)
        .eq('id', profile.id);
      if (
        patchErr &&
        isPostgrestMissingColumnOrSchemaCacheError(patchErr) &&
        dto.availability !== undefined &&
        'availability' in patch
      ) {
        const { error: p2 } = await client
          .from('Talent_profile')
          .update({ location: dto.location ?? null })
          .eq('id', profile.id);
        if (p2) throwMappedPostgrestError(patchErr);
        persistenceNotes.push(
          'availability no se guardó: falta la columna o el enum en Talent_profile (corré la migración extendida).',
        );
      } else if (patchErr) {
        throwMappedPostgrestError(patchErr);
      }
    } else {
      const insertOnce = (payload: TalentProfileInsert) =>
        client.from('Talent_profile').insert(payload).select('id').single();

      const firstInsert = await insertOnce(profileInsert);
      let created = firstInsert.data;
      const profileError = firstInsert.error;

      if (profileError) {
        if (isUniqueViolation(profileError)) {
          const { data: again, error: fetchErr } = await client
            .from('Talent_profile')
            .select('id')
            .eq('user_id', userId)
            .single();
          if (fetchErr || !again) {
            throwMappedPostgrestError(profileError);
          }
          profile = again;
        } else if (
          isPostgrestMissingColumnOrSchemaCacheError(profileError) &&
          !legacyForced &&
          dto.availability !== undefined &&
          'availability' in profileInsert
        ) {
          const retry = await insertOnce(baseProfileInsert);
          if (retry.error) throwMappedPostgrestError(profileError);
          if (!retry.data) {
            throw new InternalServerErrorException(
              'No se pudo crear el perfil',
            );
          }
          created = retry.data;
          persistenceNotes.push(
            'availability no se guardó: falta la columna o el enum en Talent_profile (corré la migración extendida).',
          );
          profile = created;
        } else {
          throwMappedPostgrestError(profileError);
        }
      } else if (!created) {
        throw new InternalServerErrorException('No se pudo crear el perfil');
      } else {
        profile = created;
      }
    }

    const avatar = await this.cloudinaryService.uploadTalentProfileAvatar(
      file,
      dto.first_name,
      dto.last_name,
    );

    if (!legacyForced) {
      const { error: avatarUpdateError } = await client
        .from('Talent_profile')
        .update({ avatar_url: avatar.secure_url })
        .eq('id', profile.id);

      if (
        avatarUpdateError &&
        isPostgrestMissingColumnOrSchemaCacheError(avatarUpdateError)
      ) {
        persistenceNotes.push(
          'avatar_url no se guardó en BD: falta la columna o PostgREST sin refrescar el esquema.',
        );
      } else if (avatarUpdateError) {
        throwMappedPostgrestError(avatarUpdateError);
      }
    }

    const blocked = dto.blocked_enterprise_ids ?? [];
    if (blocked.length > 0) {
      const rows = blocked.map((enterprise_id) => ({
        enterprise_id,
        talent_id: profile.id,
      }));
      const { error: blError } = await client
        .from('Enterprise_black_list')
        .insert(rows);
      if (blError) throwMappedPostgrestError(blError);
    }

    return {
      message: 'Perfil creado correctamente.',
      profile_id: profile.id,
      user_id: userId,
      avatar_url: avatar.secure_url,
      ...(persistenceNotes.length > 0 && {
        persistence_notes: persistenceNotes,
      }),
    };
  }

  /** Listado con datos de `User` anidados cuando la FK lo permite (sin roles/skills). */
  async listProfiles(): Promise<{ profiles: TalentProfileListItem[] }> {
    const client = this.supabaseService.getClient();
    const withUser = await client
      .from('Talent_profile')
      .select(
        '*, User(id, first_name, last_name, active), Talent_Role(id, role_name), Talent_skill(skill_id, Skill(id, title))',
      )
      .order('id', { ascending: true });

    if (!withUser.error && withUser.data) {
      return { profiles: withUser.data };
    }

    const { data, error } = await client
      .from('Talent_profile')
      .select('*')
      .order('id', { ascending: true });

    if (error) throwMappedPostgrestError(error);
    return { profiles: data ?? [] };
  }

  async findMyProfile(userId: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('Talent_profile')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throwMappedPostgrestError(error);
    if (!data)
      throw new NotFoundException('No tenés un perfil de talento creado');

    return this.findProfileById(data.id);
  }

  async findProfileById(profileId: string): Promise<{
    profile: TalentProfileRow;
    user: Database['public']['Tables']['User']['Row'] | null;
    roles: Database['public']['Tables']['Talent_Role']['Row'][];
    skills: unknown;
    blocked_enterprises: Database['public']['Tables']['Enterprise_black_list']['Row'][];
  }> {
    const client = this.supabaseService.getClient();

    const { data: profile, error: pErr } = await client
      .from('Talent_profile')
      .select('*')
      .eq('id', profileId)
      .single();

    if (pErr) {
      if (pErr.code === 'PGRST116') {
        throw new NotFoundException('Perfil de talento no encontrado');
      }
      throwMappedPostgrestError(pErr);
    }
    if (!profile) {
      throw new NotFoundException('Perfil de talento no encontrado');
    }

    let user: Database['public']['Tables']['User']['Row'] | null = null;
    if (profile.user_id) {
      const { data: u } = await client
        .from('User')
        .select('*')
        .eq('id', profile.user_id)
        .maybeSingle();
      user = u;
    }

    const { data: roles } = await client
      .from('Talent_Role')
      .select('*')
      .eq('profile_id', profileId);

    const { data: skillRows } = await client
      .from('Talent_skill')
      .select('*, Skill(*)')
      .eq('profile_id', profileId);

    const { data: blocked_enterprises } = await client
      .from('Enterprise_black_list')
      .select('*')
      .eq('talent_id', profileId);

    return {
      profile,
      user,
      roles: roles ?? [],
      skills: skillRows ?? [],
      blocked_enterprises: blocked_enterprises ?? [],
    };
  }

  private async verifyProfileOwnership(
    userId: string,
    profileId: string,
  ): Promise<void> {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('Talent_profile')
      .select('user_id')
      .eq('id', profileId)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Perfil no encontrado: ${profileId}`);
    }
    if (data.user_id !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para modificar este perfil.',
      );
    }
  }

  async updateProfile(
    userId: string,
    profileId: string,
    dto: UpdateTalentProfileDto,
  ): Promise<TalentProfileRow> {
    await this.verifyProfileOwnership(userId, profileId);
    const client = this.supabaseService.getClient();

    const patch: TalentProfileUpdate = {
      ...(dto.location !== undefined && { location: dto.location }),
      ...(dto.last_position !== undefined && {
        last_position: dto.last_position,
      }),
      ...(dto.experience_years !== undefined && {
        experience_years: dto.experience_years,
      }),
      ...(dto.age !== undefined && { age: dto.age }),
      ...(dto.education !== undefined && { education: dto.education }),
      ...(dto.availability !== undefined && { availability: dto.availability }),
      ...(dto.bio !== undefined && { bio: dto.bio }),
      ...(dto.portfolio_url !== undefined && {
        portfolio_url: dto.portfolio_url,
      }),
      ...(dto.work_experience !== undefined && {
        work_experience: dto.work_experience,
      }),
    };

    if (Object.keys(patch).length === 0) {
      const { profile } = await this.findProfileById(profileId);
      return profile;
    }

    const { data, error } = await client
      .from('Talent_profile')
      .update(patch)
      .eq('id', profileId)
      .select('*')
      .single();

    if (error) throwMappedPostgrestError(error);
    return data;
  }

  async updateRoleAndSkills(
    userId: string,
    profileId: string,
    dto: UpdateTalentRoleSkillsDto,
    file?: unknown,
  ): Promise<{ role: unknown; skills: unknown }> {
    await this.verifyProfileOwnership(userId, profileId);
    const client = this.supabaseService.getClient();

    const skillIds = (
      dto.skills as Array<{ skill_id: string; self_rating?: number }>
    ).map((s) => s.skill_id);

    const { data: existingSkills, error: skillCheckErr } = await client
      .from('Skill')
      .select('id')
      .in('id', skillIds);

    if (skillCheckErr) throwMappedPostgrestError(skillCheckErr);

    const foundIds = new Set((existingSkills ?? []).map((s) => s.id));
    const missing = skillIds.filter((id) => !foundIds.has(id));
    if (missing.length > 0) {
      throw new BadRequestException(
        `Las siguientes skills no existen: ${missing.join(', ')}`,
      );
    }

    let cvUrl: string | null = null;
    if (isNonEmptyUploadedFile(file)) {
      const uploaded = await this.cloudinaryService.uploadTalentCvPdf(file);
      cvUrl = uploaded.secure_url;
    }

    await client.from('Talent_Role').delete().eq('profile_id', profileId);

    const { data: role, error: roleErr } = await client
      .from('Talent_Role')
      .insert({
        profile_id: profileId,
        role_name: dto.role_name,
        visible: true,
        cv_url: cvUrl,
      })
      .select('*')
      .single();

    if (roleErr) throwMappedPostgrestError(roleErr);

    await client.from('Talent_skill').delete().eq('profile_id', profileId);

    const skillInserts = (
      dto.skills as Array<{ skill_id: string; self_rating?: number }>
    ).map((s) => ({
      profile_id: profileId,
      skill_id: s.skill_id,
      self_rating: s.self_rating != null ? String(s.self_rating) : null,
    }));

    const { data: skills, error: skErr } = await client
      .from('Talent_skill')
      .insert(skillInserts)
      .select('*');

    if (skErr) throwMappedPostgrestError(skErr);

    return { role, skills: skills ?? [] };
  }

  async uploadPortfolioPdf(
    profileId: string,
    file: unknown,
  ): Promise<TalentProfileRow> {
    await this.findProfileById(profileId);
    const uploaded =
      await this.cloudinaryService.uploadTalentPortfolioPdf(file);

    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('Talent_profile')
      .update({
        portfolio_public_id: uploaded.public_id,
        portfolio_url: uploaded.secure_url,
      })
      .eq('id', profileId)
      .select('*')
      .single();

    if (error) throwMappedPostgrestError(error);
    return data;
  }

  async uploadCv(
    userId: string,
    profileId: string,
    file: unknown,
  ): Promise<{ cv_url: string }> {
    await this.verifyProfileOwnership(userId, profileId);
    const uploaded = await this.cloudinaryService.uploadTalentCvPdf(file);

    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('Talent_Role')
      .update({ cv_url: uploaded.secure_url })
      .eq('profile_id', profileId)
      .select('cv_url')
      .single();

    if (error) throwMappedPostgrestError(error);
    return { cv_url: (data as { cv_url: string }).cv_url };
  }

  async deactivateProfile(profileId: string): Promise<{ message: string }> {
    const { profile } = await this.findProfileById(profileId);
    const userId = profile.user_id;
    if (!userId) {
      throw new InternalServerErrorException('Perfil sin usuario asociado');
    }

    const client = this.supabaseService.getClient();
    const { error } = await client
      .from('User')
      .update({ active: false })
      .eq('id', userId);

    if (error) throwMappedPostgrestError(error);
    return { message: 'Talento desactivado' };
  }

  /** Sugiere 4-5 skills via IA basándose en rol y skills existentes del talento */
  async suggestSkills(
    userId: string,
    profileId: string,
  ): Promise<{
    suggestions: Array<{ id: string; title: string; type: string }>;
    role_name: string | null;
  }> {
    await this.verifyProfileOwnership(userId, profileId);
    const client = this.supabaseService.getClient();

    // Rol del talento
    const { data: roleRow } = await client
      .from('Talent_Role')
      .select('role_name')
      .eq('profile_id', profileId)
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Skills actuales del talento
    const { data: existingTalentSkills } = await client
      .from('Talent_skill')
      .select('skill_id, Skill(id, title, type)')
      .eq('profile_id', profileId);

    const existingIds = (existingTalentSkills ?? [])
      .map((ts) => (ts.Skill as { id: string } | null)?.id)
      .filter((id): id is string => !!id);

    const existingTypes = (existingTalentSkills ?? []).map((ts) => {
      const s = ts.Skill as { type: string } | null;
      return s?.type ?? '';
    });

    const existingSkillsText =
      (existingTalentSkills ?? [])
        .map((ts) => {
          const s = ts.Skill as { title: string; type: string } | null;
          return `- ${s?.title} (${s?.type})`;
        })
        .join('\n') || 'Ninguna seleccionada aún';

    // Todas las skills disponibles no seleccionadas
    let availableQuery = client.from('Skill').select('id, title, type');
    if (existingIds.length > 0) {
      availableQuery = availableQuery.not(
        'id',
        'in',
        `(${existingIds.join(',')})`,
      );
    }
    const { data: availableSkills } = await availableQuery;
    const pool = availableSkills ?? [];

    if (pool.length === 0) {
      return { suggestions: [], role_name: roleRow?.role_name ?? null };
    }

    const hasSOFT = existingTypes.includes('SOFT');
    const poolList = pool
      .map((s) => `ID:${s.id} | ${s.title} | ${s.type}`)
      .join('\n');

    const prompt = `
Eres un asesor de carrera experto. Un profesional con rol objetivo "${
      roleRow?.role_name ?? 'Profesional'
    }" tiene actualmente estas habilidades:
${existingSkillsText}

${!hasSOFT ? 'IMPORTANTE: El talento NO tiene skills de tipo SOFT. Debes incluir al menos 2 skills SOFT para equilibrar su perfil.\n' : ''}
De la siguiente lista de skills disponibles, seleccioná EXACTAMENTE entre 4 y 5 que:
1. Sean más relevantes para el rol objetivo
2. Complementen las skills que ya tiene
3. LO MAS IMPORTANTE: Equilibren los tipos (TECH, SOFT, COGNITIVE), si el talento solo tiene skills de un tipo, debes sugerir skills de otros tipos para equilibrar su perfil.

Lista de skills disponibles:
${poolList}

Responde ÚNICAMENTE con un JSON válido sin markdown: ["uuid1", "uuid2", ...]
Solo IDs de la lista, entre 4 y 5 elementos.
    `.trim();

    let suggestedIds: string[] = [];
    try {
      const model = this.gemini.getGenerativeModel({
        model: 'gemini-3.5-flash',
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const clean = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      suggestedIds = JSON.parse(clean) as string[];
    } catch {
      // Si falla la IA, devolver las primeras 5 del pool
      suggestedIds = pool.slice(0, 5).map((s) => s.id);
    }

    // Filtrar solo IDs válidos del pool
    const validIdSet = new Set(pool.map((s) => s.id));
    const filteredIds = suggestedIds
      .filter((id) => validIdSet.has(id))
      .slice(0, 5);

    // Si no hay suficientes, completar con del pool
    if (filteredIds.length < 4) {
      for (const s of pool) {
        if (!filteredIds.includes(s.id)) filteredIds.push(s.id);
        if (filteredIds.length >= 4) break;
      }
    }

    const suggestions = filteredIds
      .map((id) => pool.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => s != null)
      .map((s) => ({
        id: s.id,
        title: s.title ?? '',
        type: s.type ?? 'TECH',
      }));

    return { suggestions, role_name: roleRow?.role_name ?? null };
  }

  /** Guarda las auto-calificaciones de skills del pre-diagnóstico */
  async saveSkillRatings(
    userId: string,
    profileId: string,
    dto: SaveSkillRatingsDto,
  ): Promise<{ saved: number }> {
    await this.verifyProfileOwnership(userId, profileId);
    const client = this.supabaseService.getClient();

    for (const entry of dto.ratings) {
      const { data: existing } = await client
        .from('Talent_skill')
        .select('id')
        .eq('profile_id', profileId)
        .eq('skill_id', entry.skill_id)
        .maybeSingle();

      if (existing) {
        const { error } = await client
          .from('Talent_skill')
          .update({ self_rating: entry.self_rating })
          .eq('id', existing.id);
        if (error) throwMappedPostgrestError(error);
      } else {
        const { error } = await client.from('Talent_skill').insert({
          profile_id: profileId,
          skill_id: entry.skill_id,
          self_rating: entry.self_rating,
          validated: false,
        });
        if (error) throwMappedPostgrestError(error);
      }
    }

    return { saved: dto.ratings.length };
  }
}
