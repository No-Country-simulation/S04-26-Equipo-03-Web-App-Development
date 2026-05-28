import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SupabaseService } from '../supabase/supabase.service';
import type { Json } from '../types/database.types';
import { CreateDiagnosticDto } from './dto/create-diagnostic.dto';
import { SubmitResponsesDto } from './dto/submit-responses.dto';

export interface SkillContext {
  title: string;
  category: string;
  self_rating: string | null;
}

/** Convierte el label de self_rating a un número representativo para prompts */
function selfRatingToScore(rating: string | null): number | null {
  if (rating === null) return null;
  if (rating === 'no_lo_conozco') return 2;
  if (rating === 'lo_uso') return 5;
  if (rating === 'lo_domino') return 8;
  // fallback numérico legacy (por si queda algún número guardado como string)
  const n = Number(rating);
  return isNaN(n) ? null : n;
}

export interface GeneratedQuestion {
  id: number;
  type: string;
  skill_related: string;
  difficulty: string;
  question_text: string;
  options: Record<'a' | 'b' | 'c' | 'd', string>;
  correct_answer: 'a' | 'b' | 'c' | 'd';
}

export interface SkillScore {
  skill: string;
  score: number;
  feedback: string;
}

export interface GapAnalysis {
  overall_score: number;
  skill_scores: SkillScore[];
  strengths: string[];
  gaps: string[];
  recommendation: string;
}

type PathModuleInput = {
  module_title: string;
  module_description: string;
  category: 'TECH' | 'SOFT' | 'EMPLOYABILITY';
  steps: Array<{
    title: string;
    description: string;
    type: 'VIDEO' | 'ARTICLE';
    resource_url: string;
    estimated_minutes: number;
  }>;
};

/** Puntuación mínima para aprobar una validación de skill (90% en escala 0-10) */
const PASS_SCORE = 9;
/** Cantidad de preguntas que Gemini debe generar por diagnóstico */
const QUESTION_COUNT = 5;

@Injectable()
export class DiagnosticService {
  private readonly gemini: GoogleGenerativeAI;
  private readonly geminiBackup: GoogleGenerativeAI | null;

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly config: ConfigService,
  ) {
    const apiKey = this.config.getOrThrow<string>('GEMINI_API_KEY');
    this.gemini = new GoogleGenerativeAI(apiKey);
    const backupKey = this.config.get<string>('GEMINI_API_KEY_BACKUP');
    this.geminiBackup = backupKey ? new GoogleGenerativeAI(backupKey) : null;
  }

  /**
   * Envía un prompt a Gemini usando el modelo estable gemini-2.5-flash.
   * Si la clave primaria falla (cuota, red, etc.) reintenta con la de respaldo.
   */
  private async callGeminiText(prompt: string): Promise<string> {
    const modelName = 'gemini-2.5-flash';
    try {
      const model = this.gemini.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (primaryErr) {
      if (!this.geminiBackup) throw primaryErr;
      const backupModel = this.geminiBackup.getGenerativeModel({
        model: modelName,
      });
      const result = await backupModel.generateContent(prompt);
      return result.response.text().trim();
    }
  }

  /** Genera el cuestionario y crea el registro Diagnostic en PENDING */
  async create(dto: CreateDiagnosticDto) {
    const client = this.supabaseService.getClient();

    // 1. Verificar que el perfil existe y obtener rol + skills
    const { data: profile, error: pErr } = await client
      .from('Talent_profile')
      .select('id, experience_years')
      .eq('id', dto.talent_profile_id)
      .single();

    if (pErr || !profile) {
      throw new NotFoundException(
        `Perfil de talento no encontrado: ${dto.talent_profile_id}`,
      );
    }

    const { data: roleRow } = await client
      .from('Talent_Role')
      .select('id, role_name')
      .eq('profile_id', dto.talent_profile_id)
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!roleRow) {
      throw new BadRequestException(
        'El talento no tiene rol asignado. Completá el paso 2 del onboarding primero.',
      );
    }

    const diagnosticType = dto.type ?? 'INITIAL_ONBOARDING';

    if (diagnosticType === 'SKILL_VALIDATION' && !dto.skill_id) {
      throw new BadRequestException(
        'Debe indicar skill_id para un diagnóstico de tipo SKILL_VALIDATION.',
      );
    }

    if (diagnosticType === 'INITIAL_ONBOARDING' && dto.skill_id) {
      throw new BadRequestException(
        'skill_id no aplica para diagnósticos de tipo INITIAL_ONBOARDING.',
      );
    }

    // Verificar cooldown si es diagnóstico inicial
    if (diagnosticType === 'INITIAL_ONBOARDING') {
      await this.checkInitialOnboardingCooldown(client, dto.talent_profile_id);
    }

    // Verificar cooldown si es validación de skill
    if (diagnosticType === 'SKILL_VALIDATION' && dto.skill_id) {
      await this.checkSkillValidationCooldown(
        client,
        dto.talent_profile_id,
        dto.skill_id,
      );
    }

    const { data: talentSkills } = await client
      .from('Talent_skill')
      .select('self_rating, Skill(id, title, type)')
      .eq('profile_id', dto.talent_profile_id);

    let filteredSkills = talentSkills ?? [];

    if (diagnosticType === 'SKILL_VALIDATION') {
      filteredSkills = filteredSkills.filter((ts) => {
        const skill = ts.Skill as { id: string | null } | null;
        return skill?.id === dto.skill_id;
      });

      if (filteredSkills.length === 0) {
        throw new BadRequestException(
          `La skill ${dto.skill_id} no pertenece al perfil del talento o no existe.`,
        );
      }
    }

    const skills: SkillContext[] = filteredSkills.map((ts) => {
      const skill = ts.Skill as {
        id: string;
        title: string | null;
        type: string | null;
      } | null;
      return {
        title: skill?.title ?? 'Skill desconocida',
        category: skill?.type ?? 'TECH',
        self_rating: ts.self_rating ?? null,
      };
    });

    if (skills.length === 0) {
      throw new BadRequestException(
        diagnosticType === 'SKILL_VALIDATION'
          ? 'No se encontraron las skills indicadas en el perfil del talento.'
          : 'El talento no tiene skills asignadas. Completá el paso 2 del onboarding primero.',
      );
    }

    // 2. Generar preguntas con Gemini
    const questions = await this.generateQuestions(
      roleRow.role_name ?? 'Profesional',
      profile.experience_years != null
        ? Number(profile.experience_years)
        : null,
      skills,
      diagnosticType,
    );

    // 3. Crear registro Diagnostic
    const { data: diagnostic, error: dErr } = await client
      .from('Diagnostic')
      .insert({
        talent_profile_id: dto.talent_profile_id,
        talent_role_id: roleRow.id,
        type: diagnosticType,
        status: 'PENDING',
        skill_id: dto.skill_id ?? null,
        ai_generated_questions: { questions } as unknown as Json,
      })
      .select('*')
      .single();

    if (dErr || !diagnostic) {
      throw new InternalServerErrorException(
        `Error al crear el diagnóstico: ${dErr?.message ?? 'sin datos'}`,
      );
    }

    return {
      id: diagnostic.id,
      type: diagnostic.type,
      status: diagnostic.status,
      skill_id: diagnostic.skill_id ?? null,
      questions: this.stripCorrectAnswers(questions),
    };
  }

  /** Recibe las respuestas del diagnóstico inicial, genera gap analysis y crea la ruta de aprendizaje */
  async submitOnboardingResponses(
    diagnosticId: string,
    dto: SubmitResponsesDto,
  ) {
    // Pre-cargar contexto para llamada combinada a Gemini (evita dos round-trips)
    const dbClient = this.supabaseService.getClient();
    const { data: diagRow } = await dbClient
      .from('Diagnostic')
      .select('ai_generated_questions, talent_profile_id')
      .eq('id', diagnosticId)
      .single();

    let precomputedGapAnalysis: GapAnalysis | undefined;
    let precomputedModules: PathModuleInput[] | undefined;

    if (diagRow?.talent_profile_id) {
      const { data: talentSkills } = await dbClient
        .from('Talent_skill')
        .select('self_rating, Skill(title, type)')
        .eq('profile_id', diagRow.talent_profile_id);

      const questions: GeneratedQuestion[] =
        (
          (diagRow.ai_generated_questions as unknown as {
            questions?: GeneratedQuestion[];
          }) ?? {}
        ).questions ?? [];

      const skillsCtx: SkillContext[] = (talentSkills ?? []).map((ts) => {
        const skill = ts.Skill as {
          title: string | null;
          type: string | null;
        } | null;
        return {
          title: skill?.title ?? 'Skill desconocida',
          category: skill?.type ?? 'TECH',
          self_rating: ts.self_rating ?? null,
        };
      });

      const typedResponses = dto.responses as Array<{
        question_id: number;
        selected_option: 'a' | 'b' | 'c' | 'd';
      }>;

      // Una sola llamada a Gemini: gap analysis + módulos de la ruta
      const combined = await this.generateGapAnalysisAndModules(
        questions,
        typedResponses,
        skillsCtx,
      );
      precomputedGapAnalysis = combined.gapAnalysis;
      precomputedModules = combined.modules;
    }

    // Si el pre-fetching no pudo cargar las preguntas/skills, lanzar antes de marcar COMPLETED
    // (así el diagnóstico queda en PENDING y el usuario puede reintentar).
    if (!precomputedGapAnalysis || !precomputedModules) {
      throw new InternalServerErrorException(
        'No se pudo preparar el análisis previo. Por favor, intentá de nuevo.',
      );
    }

    const { client, updated, gapAnalysis, diagnostic } =
      await this.processResponses(
        diagnosticId,
        dto,
        'INITIAL_ONBOARDING',
        precomputedGapAnalysis,
      );

    // Crear la ruta de aprendizaje. Si falla, el diagnóstico ya está COMPLETED y el
    // gap_analysis fue guardado, por lo que NO relanzamos: el usuario puede ver sus
    // resultados y la ruta puede regenerarse en un reintento posterior.
    let learningPath: {
      id: string;
      modules: Array<{
        module_title: string;
        category: string;
        steps: object[];
      }>;
    } | null = null;
    try {
      learningPath = await this.createLearningPath(
        diagnosticId,
        diagnostic.talent_profile_id!,
        gapAnalysis,
        client,
        precomputedModules,
      );
    } catch (lpErr) {
      console.error(
        '[DiagnosticService] Error creando ruta de aprendizaje (diagnóstico completado, ruta pendiente):',
        lpErr,
      );
    }

    return {
      id: updated.id,
      type: updated.type,
      status: updated.status,
      completed_at: updated.completed_at,
      gap_analysis: gapAnalysis,
      learning_path: learningPath,
    };
  }

  /** Recibe las respuestas del diagnóstico de validación de skills, genera gap analysis sin crear ruta */
  async submitSkillValidationResponses(
    diagnosticId: string,
    dto: SubmitResponsesDto,
  ) {
    const { updated, gapAnalysis } = await this.processResponses(
      diagnosticId,
      dto,
      'SKILL_VALIDATION',
    );

    return {
      id: updated.id,
      type: updated.type,
      status: updated.status,
      completed_at: updated.completed_at,
      gap_analysis: gapAnalysis,
    };
  }

  /** Lógica común: carga el diagnóstico, valida tipo y respuestas, genera gap analysis y actualiza skills */
  private async processResponses(
    diagnosticId: string,
    dto: SubmitResponsesDto,
    expectedType: 'INITIAL_ONBOARDING' | 'SKILL_VALIDATION',
    precomputedGapAnalysis?: GapAnalysis,
  ) {
    const client = this.supabaseService.getClient();

    const { data: diagnostic, error: dErr } = await client
      .from('Diagnostic')
      .select('*')
      .eq('id', diagnosticId)
      .single();

    if (dErr || !diagnostic) {
      throw new NotFoundException(`Diagnóstico no encontrado: ${diagnosticId}`);
    }

    if (diagnostic.type !== expectedType) {
      throw new BadRequestException(
        `Este endpoint es solo para diagnósticos de tipo ${expectedType}. El diagnóstico es de tipo ${diagnostic.type ?? 'desconocido'}.`,
      );
    }

    if (diagnostic.status === 'COMPLETED') {
      throw new BadRequestException('Este diagnóstico ya fue completado.');
    }

    const questionsWrapper = (diagnostic.ai_generated_questions ??
      {}) as unknown as { questions: GeneratedQuestion[] };
    const questions: GeneratedQuestion[] = questionsWrapper.questions ?? [];

    if (dto.responses.length !== questions.length) {
      throw new BadRequestException(
        `Se esperan ${questions.length} respuestas, se recibieron ${dto.responses.length}.`,
      );
    }

    const typedResponses = dto.responses as Array<{
      question_id: number;
      selected_option: 'a' | 'b' | 'c' | 'd';
    }>;

    const unknownIds = typedResponses
      .map((r) => r.question_id)
      .filter((id) => !questions.some((q) => q.id === id));
    if (unknownIds.length > 0) {
      throw new BadRequestException(
        `Los siguientes question_id no corresponden a este diagnóstico: ${unknownIds.join(', ')}`,
      );
    }

    // Obtener contexto de skills para el análisis
    const { data: talentSkills } = await client
      .from('Talent_skill')
      .select('id, skill_id, self_rating, Skill(title, type)')
      .eq('profile_id', diagnostic.talent_profile_id!);

    const skillsCtx: SkillContext[] = (talentSkills ?? [])
      .filter((ts) => {
        // Para SKILL_VALIDATION: evaluar solo la skill específica del diagnóstico
        if (diagnostic.type === 'SKILL_VALIDATION' && diagnostic.skill_id) {
          return ts.skill_id === diagnostic.skill_id;
        }
        return true;
      })
      .map((ts) => {
        const skill = ts.Skill as {
          title: string | null;
          type: string | null;
        } | null;
        return {
          title: skill?.title ?? 'Skill desconocida',
          category: skill?.type ?? 'TECH',
          self_rating: ts.self_rating ?? null,
        };
      });

    // Para SKILL_VALIDATION: calcular score objetivo por aciertos reales
    const objectiveScore =
      diagnostic.type === 'SKILL_VALIDATION'
        ? this.calculateObjectiveScore(questions, typedResponses)
        : undefined;

    // Generar gap analysis con Gemini (o usar el precomputado para evitar doble llamada)
    const gapAnalysis =
      precomputedGapAnalysis ??
      (await this.generateGapAnalysis(
        questions,
        typedResponses,
        skillsCtx,
        objectiveScore,
      ));

    // Actualizar Diagnostic
    const { data: updated, error: uErr } = await client
      .from('Diagnostic')
      .update({
        user_responses: typedResponses,
        gap_analysis: gapAnalysis as unknown as Json,
        status: 'COMPLETED',
        completed_at: new Date().toISOString(),
      })
      .eq('id', diagnosticId)
      .select('*')
      .single();

    if (uErr || !updated) {
      throw new InternalServerErrorException(
        `Error al guardar el análisis: ${uErr?.message ?? 'no se pudo recuperar el registro actualizado'}`,
      );
    }

    // Actualizar score en Talent_skill
    if (diagnostic.type === 'SKILL_VALIDATION' && diagnostic.skill_id) {
      // Validación de skill única: actualiza score + estado de validación
      const match = (talentSkills ?? []).find(
        (ts) => ts.skill_id === diagnostic.skill_id,
      );
      if (match) {
        const score = gapAnalysis.skill_scores[0]?.score ?? 0;
        await client
          .from('Talent_skill')
          .update({
            score,
            last_diagnostic_id: diagnosticId,
            validated: score >= PASS_SCORE,
            validated_at: score >= PASS_SCORE ? new Date().toISOString() : null,
          })
          .eq('id', match.id);
      }
    } else {
      // Onboarding inicial: solo actualiza score de referencia, sin marcar como validada
      for (const skillScore of gapAnalysis.skill_scores) {
        const match = (talentSkills ?? []).find((ts) => {
          const s = ts.Skill as { title: string | null } | null;
          return s?.title === skillScore.skill;
        });
        if (!match) continue;

        await client
          .from('Talent_skill')
          .update({
            score: skillScore.score,
            last_diagnostic_id: diagnosticId,
          })
          .eq('id', match.id);
      }
    }

    return { client, diagnostic, updated, gapAnalysis };
  }

  async findById(diagnosticId: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('Diagnostic')
      .select(
        'id, type, status, skill_id, talent_profile_id, talent_role_id, completed_at, gap_analysis, ai_generated_questions',
      )
      .eq('id', diagnosticId)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Diagnóstico no encontrado: ${diagnosticId}`);
    }
    const wrapper = (data.ai_generated_questions ?? {}) as unknown as {
      questions?: GeneratedQuestion[];
    };
    const questions = Array.isArray(wrapper.questions)
      ? this.stripCorrectAnswers(wrapper.questions)
      : [];
    return {
      id: data.id,
      type: data.type,
      status: data.status,
      skill_id: data.skill_id,
      talent_profile_id: data.talent_profile_id,
      talent_role_id: data.talent_role_id,
      completed_at: data.completed_at,
      gap_analysis: data.gap_analysis,
      questions,
    };
  }

  async findByProfile(profileId: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('Diagnostic')
      .select(
        'id, type, status, skill_id, talent_profile_id, talent_role_id, completed_at, gap_analysis',
      )
      .eq('talent_profile_id', profileId)
      .order('completed_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
    return { diagnostics: data ?? [] };
  }

  // ── Helpers de sanitización ─────────────────────────────────────────────

  /** Elimina correct_answer de las preguntas antes de enviarlas al cliente */
  private stripCorrectAnswers(
    questions: GeneratedQuestion[],
  ): Omit<GeneratedQuestion, 'correct_answer'>[] {
    return questions.map(
      ({ id, type, skill_related, difficulty, question_text, options }) => ({
        id,
        type,
        skill_related,
        difficulty,
        question_text,
        options,
      }),
    );
  }

  /** Elimina correct_answer del campo ai_generated_questions de un registro Diagnostic */
  private sanitizeDiagnostic<
    T extends { ai_generated_questions?: Json | null },
  >(diagnostic: T): T {
    if (!diagnostic.ai_generated_questions) return diagnostic;
    const wrapper = diagnostic.ai_generated_questions as unknown as {
      questions?: GeneratedQuestion[];
    };
    if (!Array.isArray(wrapper.questions)) return diagnostic;
    return {
      ...diagnostic,
      ai_generated_questions: {
        questions: this.stripCorrectAnswers(wrapper.questions),
      },
    };
  }

  // ── Cooldown de diagnóstico inicial (30 días) ─────────────────────────

  private async checkInitialOnboardingCooldown(
    client: ReturnType<SupabaseService['getClient']>,
    talentProfileId: string,
  ) {
    const COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

    const { data: last } = await client
      .from('Diagnostic')
      .select('completed_at')
      .eq('talent_profile_id', talentProfileId)
      .eq('type', 'INITIAL_ONBOARDING')
      .eq('status', 'COMPLETED')
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!last?.completed_at) return;

    const completedAt = new Date(last.completed_at);
    const diffMs = Date.now() - completedAt.getTime();

    if (diffMs < COOLDOWN_MS) {
      const unlocksAt = new Date(completedAt.getTime() + COOLDOWN_MS);
      const days = Math.ceil(
        (unlocksAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000),
      );
      throw new BadRequestException(
        `Ya completaste el diagnóstico inicial recientemente. Podés volver a tomarlo en ${days} día${days !== 1 ? 's' : ''} (${unlocksAt.toISOString().split('T')[0]}).`,
      );
    }
  }

  // ── Cooldown de validación de skill ────────────────────────────────────

  private async checkSkillValidationCooldown(
    client: ReturnType<SupabaseService['getClient']>,
    talentProfileId: string,
    skillId: string,
  ) {
    // Obtener todos los diagnósticos COMPLETED de SKILL_VALIDATION para esta skill
    const { data: previous } = await client
      .from('Diagnostic')
      .select('id, completed_at, gap_analysis')
      .eq('talent_profile_id', talentProfileId)
      .eq('type', 'SKILL_VALIDATION')
      .eq('skill_id', skillId)
      .eq('status', 'COMPLETED')
      .order('completed_at', { ascending: false });

    if (!previous || previous.length === 0) return;

    // Filtrar solo los fallidos (overall_score < PASS_SCORE)
    const failures = previous.filter((d) => {
      const ga = d.gap_analysis as { overall_score?: number } | null;
      return (ga?.overall_score ?? 10) < PASS_SCORE;
    });

    if (failures.length === 0) return;

    const lastFailure = failures[0];
    if (!lastFailure.completed_at) return;

    const lastFailedAt = new Date(lastFailure.completed_at);
    const now = new Date();
    const diffMs = now.getTime() - lastFailedAt.getTime();

    // 1er fallo → cooldown 1 semana, 2+ fallos → 1 mes
    const cooldownMs =
      failures.length === 1
        ? 7 * 24 * 60 * 60 * 1000
        : 30 * 24 * 60 * 60 * 1000;

    if (diffMs < cooldownMs) {
      const unlocksAt = new Date(lastFailedAt.getTime() + cooldownMs);
      const days = Math.ceil(
        (unlocksAt.getTime() - now.getTime()) / (24 * 60 * 60 * 1000),
      );
      const period = failures.length === 1 ? '1 semana' : '1 mes';
      throw new BadRequestException(
        `Debés esperar ${period} entre intentos fallidos. Podés volver a intentarlo en ${days} día${days !== 1 ? 's' : ''} (${unlocksAt.toISOString().split('T')[0]}).`,
      );
    }
  }

  // ── Learning Path ───────────────────────────────────────────────────────

  private async createLearningPath(
    diagnosticId: string,
    talentProfileId: string,
    gapAnalysis: GapAnalysis,
    client: ReturnType<SupabaseService['getClient']>,
    precomputedModules: PathModuleInput[],
  ) {
    const { data: path, error: pathErr } = await client
      .from('Learning_Path')
      .insert({
        diagnostic_id: diagnosticId,
        talent_profile_id: talentProfileId,
        status: 'PENDING',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (pathErr || !path) {
      throw new InternalServerErrorException(
        `Error al crear la ruta de aprendizaje: ${pathErr?.message ?? 'sin datos'}`,
      );
    }

    const modules = precomputedModules ?? [];

    const result: Array<{
      module_title: string;
      category: string;
      steps: object[];
    }> = [];

    for (const [modIndex, mod] of modules.entries()) {
      // Insertar el módulo
      const { data: insertedModule, error: modErr } = await client
        .from('Path_Module')
        .insert({
          learning_path_id: path.id,
          title: mod.module_title,
          description: mod.module_description ?? null,
          order: modIndex + 1,
          category: mod.category,
        })
        .select('id')
        .single();

      if (modErr || !insertedModule) {
        throw new InternalServerErrorException(
          `Error al crear el módulo "${mod.module_title}": ${modErr?.message ?? 'sin datos'}`,
        );
      }

      // Insertar los pasos del módulo
      const stepInserts = mod.steps.map((step, stepIndex) => ({
        learning_path_id: path.id,
        module_id: insertedModule.id,
        order: stepIndex + 1,
        title: step.title,
        description: step.description,
        type: step.type,
        resource_url: step.resource_url,
        estimated_minutes: step.estimated_minutes ?? null,
        is_completed: false,
      }));

      const { error: stepsErr } = await client
        .from('Path_Step')
        .insert(stepInserts);

      if (stepsErr) {
        throw new InternalServerErrorException(
          `Error al crear los pasos del módulo "${mod.module_title}": ${stepsErr.message}`,
        );
      }

      result.push({
        module_title: mod.module_title,
        category: mod.category,
        steps: mod.steps,
      });
    }

    return { id: path.id, modules: result };
  }

  // ── Gemini helpers ──────────────────────────────────────────────────────

  private async generateQuestions(
    roleName: string,
    experienceYears: number | null,
    skills: SkillContext[],
    diagnosticType: 'INITIAL_ONBOARDING' | 'SKILL_VALIDATION',
  ): Promise<GeneratedQuestion[]> {
    const skillList = skills
      .map(
        (s) =>
          `- ${s.title} (${s.category})${s.self_rating !== null ? `, autoevaluación: ${selfRatingToScore(s.self_rating) ?? '?'}/10` : ''}`,
      )
      .join('\n');

    const jsonFormat = `
Formato de Salida (Estricto JSON): Devuelve exclusivamente un objeto JSON con el siguiente formato:
{
  "questions": [
    {
      "id": 1,
      "type": "SOFT/TECH/COGNITIVE",
      "skill_related": "nombre_de_la_skill",
      "difficulty": "junior/mid/senior",
      "question_text": "¿...?",
      "options": { "a": "opcion 1", "b": "opcion 2", "c": "opcion 3", "d": "opcion 4" },
      "correct_answer": "a"
    }
  ]
}
No incluyas explicaciones fuera del JSON.`.trim();

    const prompt =
      diagnosticType === 'SKILL_VALIDATION'
        ? `
Eres un evaluador técnico experto en tecnología. Tu objetivo es VALIDAR si el candidato realmente domina las skills que declara tener.

Rol del candidato: ${roleName}
Años de experiencia: ${experienceYears ?? 'no especificado'}
Skills a validar (con autoevaluación del candidato):
${skillList}

Genera exactamente ${QUESTION_COUNT} preguntas de opción múltiple con 4 opciones cada una, diseñadas para VALIDAR el dominio real de las skills. Las preguntas deben:
- Ser técnicas, precisas y de dificultad media-alta (nivel mid/senior)
- Centrarse exclusivamente en las skills declaradas, no en el rol en general
- Incluir casos prácticos, escenarios reales o detalles técnicos específicos
- Detectar si la autoevaluación del candidato es precisa o inflada
- Cubrir al menos una pregunta por cada skill listada

Distribución de dificultad: preferentemente mid y senior.

${jsonFormat}
`.trim()
        : `
Eres un evaluador técnico experto en tecnología y talento digital.
Debes generar un cuestionario de diagnóstico para un candidato con el siguiente perfil:

Rol: ${roleName}
Años de experiencia: ${experienceYears ?? 'no especificado'}
Skills declaradas:
${skillList}

Genera exactamente ${QUESTION_COUNT} preguntas de opción múltiple con 4 opciones cada una (no abiertas) que permitan evaluar el nivel real de conocimiento en las skills declaradas. Las preguntas deben:
- Ser específicas, adaptadas al rol
- Cubrir todas las skills listadas
- Aumentar progresivamente en dificultad
- Detectar si la autoevaluación del candidato es precisa

Distribución de Dificultad: Las preguntas deben ajustarse a los años de experiencia si esta está disponible.

${jsonFormat}
`.trim();

    try {
      const text = await this.callGeminiText(prompt);
      const clean = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      const parsed = JSON.parse(clean) as { questions: GeneratedQuestion[] };
      return parsed.questions;
    } catch (err) {
      throw new InternalServerErrorException(
        `Error al generar preguntas con Gemini: ${String(err)}`,
      );
    }
  }

  /** Calcula el score objetivo basado en aciertos reales (escala 0-10, 1 decimal) */
  private calculateObjectiveScore(
    questions: GeneratedQuestion[],
    responses: Array<{
      question_id: number;
      selected_option: 'a' | 'b' | 'c' | 'd';
    }>,
  ): number {
    if (questions.length === 0) return 0;
    const correct = questions.filter((q) => {
      const resp = responses.find((r) => r.question_id === q.id);
      return resp?.selected_option === q.correct_answer;
    }).length;
    return Math.round((correct / questions.length) * 100) / 10;
  }

  /**
   * Llamada Gemini combinada: genera gap analysis + módulos de ruta de aprendizaje
   * en un solo round-trip, reduciendo ~50% el tiempo de espera al enviar respuestas.
   */
  private async generateGapAnalysisAndModules(
    questions: GeneratedQuestion[],
    responses: Array<{
      question_id: number;
      selected_option: 'a' | 'b' | 'c' | 'd';
    }>,
    skills: SkillContext[],
  ): Promise<{ gapAnalysis: GapAnalysis; modules: PathModuleInput[] }> {
    const qa = questions
      .map((q) => {
        const resp = responses.find((r) => r.question_id === q.id);
        const sel = resp?.selected_option ?? null;
        const selText = sel ? q.options[sel] : '(sin respuesta)';
        const isCorrect = sel === q.correct_answer;
        return `P${q.id} (${q.skill_related}, ${q.difficulty}): ${q.question_text}\nElegida: ${sel ?? '-'}) ${selText} | Correcta: ${q.correct_answer}) ${q.options[q.correct_answer]} | Acierto: ${isCorrect ? 'SÍ' : 'NO'}`;
      })
      .join('\n\n');

    const skillList = skills
      .map(
        (s) =>
          `- ${s.title}${s.self_rating !== null ? ` (autoevaluación: ${selfRatingToScore(s.self_rating) ?? '?'}/10)` : ''}`,
      )
      .join('\n');

    const skillNames = skills.map((s) => s.title).join(', ');

    const prompt = `
Eres un evaluador técnico experto y diseñador instruccional. Analiza las respuestas del candidato y realiza dos tareas.

Skills evaluadas: ${skillNames}

Skills con autoevaluación del candidato:
${skillList}

Preguntas y respuestas del candidato:
${qa}

═══════════════════════════════════════
TAREA 1 — GAP ANALYSIS
═══════════════════════════════════════
Calcula para CADA skill una puntuación individual (0-10) basada EXCLUSIVAMENTE en su desempeño en las preguntas de esa skill.
Reglas estrictas:
- Cada skill DEBE tener un score DIFERENTE que refleje su rendimiento real en esas preguntas
- Si acertó la mayoría de preguntas de una skill → score alto (7-10)
- Si erró la mayoría → score bajo (1-4)
- Si tuvo resultados mixtos → score medio (4-7)
- NO promedies ni iguales los scores entre skills
- El overall_score es el promedio ponderado de todos los skill_scores

═══════════════════════════════════════
TAREA 2 — RUTA DE APRENDIZAJE
═══════════════════════════════════════
Diseña módulos de aprendizaje para cerrar las brechas encontradas.
Categorías y cantidad EXACTA de módulos:
- TECH: exactamente 3 módulos
- SOFT: exactamente 1 módulo
- EMPLOYABILITY: exactamente 1 módulo
Cada módulo debe tener EXACTAMENTE 2 recursos (pasos). Tipos: "VIDEO" o "ARTICLE" (únicamente).

Responde ÚNICAMENTE con JSON válido, sin markdown ni texto extra.
El array skill_scores debe tener UNA entrada por CADA skill evaluada (${skills.length} entradas), con scores distintos:
{
  "gap_analysis": {
    "overall_score": 6.5,
    "skill_scores": [
      { "skill": "NombreSkill1", "score": 8.0, "feedback": "Descripción breve de su desempeño en esta skill" },
      { "skill": "NombreSkill2", "score": 4.5, "feedback": "Descripción breve de su desempeño en esta skill" },
      { "skill": "NombreSkill3", "score": 7.0, "feedback": "Descripción breve de su desempeño en esta skill" }
    ],
    "strengths": ["fortaleza concreta 1", "fortaleza concreta 2"],
    "gaps": ["brecha concreta 1", "brecha concreta 2"],
    "recommendation": "Recomendación de aprendizaje personalizada"
  },
  "learning_path": [
    {
      "module_title": "Título del módulo",
      "module_description": "Descripción breve (1-2 oraciones)",
      "category": "TECH",
      "steps": [
        {
          "title": "Título del recurso",
          "description": "Descripción breve de qué aprenderá",
          "type": "VIDEO",
          "resource_url": "https://learn.example.com/path",
          "estimated_minutes": 20
        }
      ]
    }
  ]
}
`.trim();

    try {
      const text = await this.callGeminiText(prompt);
      const clean = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      const parsed = JSON.parse(clean) as {
        gap_analysis: GapAnalysis;
        learning_path: PathModuleInput[];
      };

      const normalizeType = (raw: string): 'VIDEO' | 'ARTICLE' => {
        const up = raw.toUpperCase();
        if (up.includes('VIDEO')) return 'VIDEO';
        return 'ARTICLE';
      };

      // path_category solo acepta TECH | SOFT | EMPLOYABILITY.
      // Skill.category incluye COGNITIVE, que Gemini puede copiar al módulo → viola el enum de DB.
      // COGNITIVE → EMPLOYABILITY (las skills cognitivas aplican a empleabilidad, no a TECH).
      const normalizeCategory = (
        raw: string,
      ): 'TECH' | 'SOFT' | 'EMPLOYABILITY' => {
        const up = raw.toUpperCase();
        if (up === 'SOFT') return 'SOFT';
        if (up === 'COGNITIVE' || up === 'EMPLOYABILITY')
          return 'EMPLOYABILITY';
        return 'TECH'; // cualquier valor inesperado → TECH
      };

      const modules: PathModuleInput[] = parsed.learning_path.map((mod) => ({
        ...mod,
        category: normalizeCategory(mod.category),
        steps: mod.steps.map((step) => ({
          ...step,
          type: normalizeType(step.type),
        })),
      }));

      return { gapAnalysis: parsed.gap_analysis, modules };
    } catch (err) {
      throw new InternalServerErrorException(
        `Error al generar el análisis y ruta con Gemini: ${String(err)}`,
      );
    }
  }

  private async generateGapAnalysis(
    questions: GeneratedQuestion[],
    responses: Array<{
      question_id: number;
      selected_option: 'a' | 'b' | 'c' | 'd';
    }>,
    skills: SkillContext[],
    objectiveScore?: number,
  ): Promise<GapAnalysis> {
    const qa = questions
      .map((q) => {
        const resp = responses.find((r) => r.question_id === q.id);
        const selectedOption = resp?.selected_option ?? null;
        const selectedText = selectedOption
          ? q.options[selectedOption]
          : '(sin respuesta)';
        const isCorrect = selectedOption === q.correct_answer;
        return `Pregunta ${q.id} (${q.skill_related}, ${q.difficulty}): ${q.question_text}\nOpciones: ${JSON.stringify(q.options)}\nRespuesta elegida: ${selectedOption ?? '-'}) ${selectedText}\nCorrecta: ${q.correct_answer}) ${q.options[q.correct_answer]}\nAcierto: ${isCorrect ? 'SÍ' : 'NO'}`;
      })
      .join('\n\n');

    const skillList = skills
      .map(
        (s) =>
          `- ${s.title}${s.self_rating !== null ? ` (autoevaluación: ${selfRatingToScore(s.self_rating) ?? '?'}/10)` : ''}`,
      )
      .join('\n');

    const scoreInstruction =
      objectiveScore !== undefined
        ? `\nPuntuación objetiva calculada por aciertos: ${objectiveScore}/10. Debes usar EXACTAMENTE este valor en "overall_score" y en el score de la skill evaluada. No lo modifiques.`
        : '';

    const prompt = `
Eres un evaluador técnico experto. Analiza las respuestas del candidato al siguiente cuestionario y genera un gap analysis detallado.

Skills evaluadas:
${skillList}${scoreInstruction}

Preguntas y respuestas:
${qa}

Genera un análisis que incluya:
- Puntuación global (0-10)${objectiveScore !== undefined ? ` — usa el valor provisto: ${objectiveScore}` : ''}
- Puntuación por skill (0-10) con feedback breve
- Fortalezas detectadas
- Brechas o gaps identificados
- Recomendación de aprendizaje

Responde ÚNICAMENTE con un JSON válido con este formato exacto, sin markdown ni texto adicional:
{
  "overall_score": 7,
  "skill_scores": [
    { "skill": "nombre", "score": 8, "feedback": "texto breve" }
  ],
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "gaps": ["gap 1", "gap 2"],
  "recommendation": "texto de recomendación"
}
`.trim();

    try {
      const text = await this.callGeminiText(prompt);
      const clean = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      const analysis = JSON.parse(clean) as GapAnalysis;
      // Garantizar que el score objetivo no sea alterado por Gemini
      if (objectiveScore !== undefined) {
        analysis.overall_score = objectiveScore;
        if (analysis.skill_scores.length > 0) {
          analysis.skill_scores[0].score = objectiveScore;
        }
      }
      return analysis;
    } catch (err) {
      throw new InternalServerErrorException(
        `Error al generar el gap analysis con Gemini: ${String(err)}`,
      );
    }
  }
}
