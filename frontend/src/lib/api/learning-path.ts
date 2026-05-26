import { apiClient } from './client';

export type PathCategory = 'TECH' | 'SOFT' | 'EMPLOYABILITY';
export type PathStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type StepType = 'VIDEO' | 'ARTICLE' | 'EXERCISE' | 'QUIZ';

export interface PathStepRecord {
  id: string;
  title: string | null;
  description: string | null;
  type: StepType | null;
  resource_url: string | null;
  is_completed: boolean | null;
  order: number | null;
  module_id: string | null;
  estimated_minutes: number | null;
}

export interface PathModuleRecord {
  id: string;
  title: string | null;
  description: string | null;
  order: number | null;
  category: PathCategory | null;
  steps: PathStepRecord[];
  progress: {
    total: number;
    completed: number;
    percentage: number;
  };
}

export interface LearningPathDetail {
  id: string;
  status: PathStatus | null;
  role_name: string | null;
  diagnostic_id: string | null;
  talent_profile_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  completed_at: string | null;
  progress: {
    total: number;
    completed: number;
    percentage: number;
  };
  modules: PathModuleRecord[];
  ungrouped_steps: PathStepRecord[];
}

export interface LearningPathSummary {
  id: string;
  status: PathStatus | null;
  created_at: string | null;
  updated_at: string | null;
  completed_at: string | null;
  diagnostic_id: string | null;
  progress: {
    total: number;
    completed: number;
    percentage: number;
  };
}

export const learningPathApi = {
  /** GET /learning-path/me — rutas del talento autenticado */
  findMe: async (
    token: string
  ): Promise<{ learning_paths: LearningPathSummary[] }> => {
    const response = await apiClient.get<{
      learning_paths: LearningPathSummary[];
    }>('/learning-path/me', { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  },

  /** GET /learning-path/profile/:profileId — rutas de un talento (accesible por reclutadores) */
  findByProfile: async (
    token: string,
    profileId: string
  ): Promise<{ learning_paths: LearningPathSummary[] }> => {
    const response = await apiClient.get<{
      learning_paths: LearningPathSummary[];
    }>(`/learning-path/profile/${profileId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  /** GET /learning-path/:id — ruta completa con módulos y pasos */
  findById: async (
    token: string,
    pathId: string
  ): Promise<LearningPathDetail> => {
    const response = await apiClient.get<LearningPathDetail>(
      `/learning-path/${pathId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  /** PATCH /learning-path/:id/steps/:stepId/complete */
  completeStep: async (token: string, pathId: string, stepId: string) => {
    const response = await apiClient.patch(
      `/learning-path/${pathId}/steps/${stepId}/complete`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  /** PATCH /learning-path/:id/steps/:stepId/uncomplete */
  uncompleteStep: async (token: string, pathId: string, stepId: string) => {
    const response = await apiClient.patch(
      `/learning-path/${pathId}/steps/${stepId}/uncomplete`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};
