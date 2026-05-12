import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  isPostgrestMissingColumnOrSchemaCacheError,
  throwMappedPostgrestError,
} from '../common/map-postgrest-error';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { SupabaseService } from '../supabase/supabase.service';
import type { Database } from '../types/database.types';
import { CreateTalentRegisterDto } from './dto/create-talent-register.dto';
import { UpdateTalentProfileDto } from './dto/update-talent-profile.dto';
import { UpdateTalentRoleSkillsDto } from './dto/update-talent-role-skills.dto';

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
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly config: ConfigService,
  ) {}

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
      .select('*, User(id, first_name, last_name, active)')
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

  async updateProfile(
    profileId: string,
    dto: UpdateTalentProfileDto,
  ): Promise<TalentProfileRow> {
    await this.findProfileById(profileId);
    const client = this.supabaseService.getClient();

    const extended = this.isExtendedTalentProfileSchema();
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
    };

    if (extended) {
      Object.assign(patch, {
        ...(dto.availability !== undefined && {
          availability: dto.availability,
        }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.portfolio_url !== undefined && {
          portfolio_url: dto.portfolio_url,
        }),
        ...(dto.work_experience !== undefined && {
          work_experience: dto.work_experience,
        }),
      });
    } else if (
      dto.availability !== undefined ||
      dto.bio !== undefined ||
      dto.portfolio_url !== undefined ||
      dto.work_experience !== undefined
    ) {
      throw new BadRequestException(
        'Sin SUPABASE_TALENT_EXTENDED_SCHEMA=true no se guardan availability, bio, portfolio_url ni work_experience (hace falta la migración en Supabase).',
      );
    }

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
    profileId: string,
    dto: UpdateTalentRoleSkillsDto,
  ): Promise<{ role: unknown; skills: unknown }> {
    await this.findProfileById(profileId);
    const client = this.supabaseService.getClient();

    await client.from('Talent_Role').delete().eq('profile_id', profileId);

    const { data: role, error: roleErr } = await client
      .from('Talent_Role')
      .insert({
        profile_id: profileId,
        role_name: dto.role_name,
        visible: true,
        cv_url: dto.cv_url ?? null,
      })
      .select('*')
      .single();

    if (roleErr) throwMappedPostgrestError(roleErr);

    await client.from('Talent_skill').delete().eq('profile_id', profileId);

    const skillInserts = dto.skill_ids.map((skill_id) => ({
      profile_id: profileId,
      skill_id,
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
}
