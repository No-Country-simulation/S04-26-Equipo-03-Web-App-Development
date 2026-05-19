import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class LearningPathService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findMe(userId: string) {
    const client = this.supabaseService.getClient();

    const { data: profile, error: profileErr } = await client
      .from('Talent_profile')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileErr || !profile) {
      throw new NotFoundException(
        'No se encontró un perfil de talento para este usuario.',
      );
    }

    return this.findByProfile(profile.id);
  }

  async findByProfile(profileId: string) {
    const client = this.supabaseService.getClient();

    const { data: paths, error } = await client
      .from('Learning_Path')
      .select('id, status, created_at, updated_at, completed_at, diagnostic_id')
      .eq('talent_profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    const pathsWithProgress = await Promise.all(
      (paths ?? []).map(async (path) => {
        const progress = await this.getProgress(path.id);
        return { ...path, progress };
      }),
    );

    return { learning_paths: pathsWithProgress };
  }

  async findById(pathId: string) {
    const client = this.supabaseService.getClient();

    const { data: path, error } = await client
      .from('Learning_Path')
      .select('*')
      .eq('id', pathId)
      .single();

    if (error || !path) {
      throw new NotFoundException(
        `Ruta de aprendizaje no encontrada: ${pathId}`,
      );
    }

    // Obtener rol del talento para el título de la ruta
    let roleName: string | null = null;
    if (path.talent_profile_id) {
      const { data: role } = await client
        .from('Talent_Role')
        .select('role_name')
        .eq('profile_id', path.talent_profile_id as string)
        .order('id', { ascending: true })
        .limit(1)
        .maybeSingle();
      roleName = role?.role_name ?? null;
    }

    // Obtener módulos con sus pasos anidados
    const { data: modules, error: modulesError } = await client
      .from('Path_Module')
      .select('id, title, description, order, category')
      .eq('learning_path_id', pathId)
      .order('order', { ascending: true });

    if (modulesError) {
      throw new InternalServerErrorException(modulesError.message);
    }

    const { data: steps, error: stepsError } = await client
      .from('Path_Step')
      .select(
        'id, order, title, description, type, resource_url, is_completed, module_id, estimated_minutes',
      )
      .eq('learning_path_id', pathId)
      .order('order', { ascending: true });

    if (stepsError) {
      throw new InternalServerErrorException(stepsError.message);
    }

    const allSteps = steps ?? [];
    const moduleList = (modules ?? []).map((mod) => {
      const modSteps = allSteps.filter((s) => s.module_id === mod.id);
      const modTotal = modSteps.length;
      const modCompleted = modSteps.filter((s) => s.is_completed).length;
      return {
        ...mod,
        steps: modSteps,
        progress: {
          total: modTotal,
          completed: modCompleted,
          percentage:
            modTotal > 0 ? Math.round((modCompleted / modTotal) * 100) : 0,
        },
      };
    });

    // Pasos sin módulo asignado (compatibilidad con datos anteriores)
    const ungroupedSteps = allSteps.filter((s) => !s.module_id);

    const total = allSteps.length;
    const completed = allSteps.filter((s) => s.is_completed).length;

    return {
      id: path.id,
      status: path.status,
      role_name: roleName,
      diagnostic_id: path.diagnostic_id,
      talent_profile_id: path.talent_profile_id,
      created_at: path.created_at,
      updated_at: path.updated_at,
      completed_at: path.completed_at,
      progress: {
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
      modules: moduleList,
      ungrouped_steps: ungroupedSteps,
    };
  }

  async completeStep(userId: string, pathId: string, stepId: string) {
    return this.setStepCompletion(userId, pathId, stepId, true);
  }

  async uncompleteStep(userId: string, pathId: string, stepId: string) {
    return this.setStepCompletion(userId, pathId, stepId, false);
  }

  private async verifyPathOwnership(
    userId: string,
    pathId: string,
  ): Promise<void> {
    const client = this.supabaseService.getClient();

    const { data: path, error } = await client
      .from('Learning_Path')
      .select('talent_profile_id')
      .eq('id', pathId)
      .single();

    if (error || !path) {
      throw new NotFoundException(
        `Ruta de aprendizaje no encontrada: ${pathId}`,
      );
    }

    const { data: profile, error: profileErr } = await client
      .from('Talent_profile')
      .select('user_id')
      .eq('id', path.talent_profile_id as string)
      .single();

    if (profileErr || !profile || profile.user_id !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para modificar esta ruta de aprendizaje.',
      );
    }
  }

  private async setStepCompletion(
    userId: string,
    pathId: string,
    stepId: string,
    isCompleted: boolean,
  ) {
    await this.verifyPathOwnership(userId, pathId);
    const client = this.supabaseService.getClient();

    // Verificar que el paso pertenece a la ruta
    const { data: step, error: stepErr } = await client
      .from('Path_Step')
      .select('id, learning_path_id')
      .eq('id', stepId)
      .eq('learning_path_id', pathId)
      .single();

    if (stepErr || !step) {
      throw new NotFoundException(`Paso no encontrado en esta ruta: ${stepId}`);
    }

    // Actualizar el paso
    const { error: updateErr } = await client
      .from('Path_Step')
      .update({ is_completed: isCompleted })
      .eq('id', stepId);

    if (updateErr) {
      throw new InternalServerErrorException(updateErr.message);
    }

    // Recalcular el progreso y actualizar el status de la ruta
    const { data: allSteps } = await client
      .from('Path_Step')
      .select('is_completed')
      .eq('learning_path_id', pathId);

    const stepsList = allSteps ?? [];
    const total = stepsList.length;
    const completed = stepsList.filter((s) => s.is_completed).length;

    let newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    if (completed === 0) {
      newStatus = 'PENDING';
    } else if (completed === total) {
      newStatus = 'COMPLETED';
    } else {
      newStatus = 'IN_PROGRESS';
    }

    const { error: pathErr } = await client
      .from('Learning_Path')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
        completed_at:
          newStatus === 'COMPLETED' ? new Date().toISOString() : null,
      })
      .eq('id', pathId);

    if (pathErr) {
      throw new InternalServerErrorException(pathErr.message);
    }

    return {
      step_id: stepId,
      is_completed: isCompleted,
      path_status: newStatus,
      progress: {
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
    };
  }

  private async getProgress(pathId: string) {
    const client = this.supabaseService.getClient();
    const { data: steps } = await client
      .from('Path_Step')
      .select('is_completed')
      .eq('learning_path_id', pathId);

    const list = steps ?? [];
    const total = list.length;
    const completed = list.filter((s) => s.is_completed).length;
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}
