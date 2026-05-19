import { apiClient } from './client';

export interface RegisterTalentResponse {
  message: string;
  profile_id: string;
  user_id: string;
  avatar_url: string;
  persistence_notes?: string[];
}

export interface SkillRecord {
  id: string;
  title: string;
  type: string;
}

export const talentApi = {
  /**
   * POST /talent/register — Step 1 onboarding (multipart/form-data)
   */
  register: async (
    token: string,
    params: {
      first_name: string;
      last_name: string;
      location?: string;
      availability?: string;
      blocked_enterprise_ids?: string[];
      avatar?: File | null;
    }
  ): Promise<RegisterTalentResponse> => {
    const form = new FormData();
    form.append('first_name', params.first_name);
    form.append('last_name', params.last_name);
    if (params.location) form.append('location', params.location);
    if (params.availability) form.append('availability', params.availability);
    if (params.blocked_enterprise_ids?.length) {
      form.append(
        'blocked_enterprise_ids',
        JSON.stringify(params.blocked_enterprise_ids)
      );
    }
    if (params.avatar) form.append('file', params.avatar);

    const response = await apiClient.post<RegisterTalentResponse>(
      '/talent/register',
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * GET /skills — lista todos los skills existentes
   */
  listSkills: async (): Promise<SkillRecord[]> => {
    const response = await apiClient.get<SkillRecord[]>('/skills');
    return response.data;
  },

  /**
   * POST /skills — crea un skill nuevo y retorna su registro
   */
  createSkill: async (token: string, title: string): Promise<SkillRecord> => {
    const response = await apiClient.post<SkillRecord>(
      '/skills',
      { title, type: 'TECH' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  /**
   * Resuelve un array de nombres de skills a IDs.
   * Busca primero en la lista existente; crea los que faltan.
   */
  resolveSkillIds: async (
    token: string,
    names: string[]
  ): Promise<string[]> => {
    if (!names.length) return [];
    const allSkills = await talentApi.listSkills();
    const ids: string[] = [];

    for (const name of names) {
      const match = allSkills.find(
        (s) => s.title.toLowerCase() === name.toLowerCase()
      );
      if (match) {
        ids.push(match.id);
      } else {
        const created = await talentApi.createSkill(token, name);
        ids.push(created.id);
      }
    }

    return ids;
  },

  /**
   * PATCH /talent/profile/:profileId/role-skills — Step 2 onboarding (multipart/form-data)
   */
  updateRoleSkills: async (
    token: string,
    profileId: string,
    params: {
      role_name: string;
      skill_ids: string[];
      cv?: File | null;
    }
  ): Promise<unknown> => {
    const form = new FormData();
    form.append('role_name', params.role_name);
    form.append(
      'skills',
      JSON.stringify(params.skill_ids.map((id) => ({ skill_id: id })))
    );
    if (params.cv) form.append('cv', params.cv);

    const response = await apiClient.patch(
      `/talent/profile/${profileId}/role-skills`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * PATCH /talent/profile/:profileId — Step 3 onboarding (JSON)
   */
  updateProfile: async (
    token: string,
    profileId: string,
    params: {
      bio?: string;
      portfolio_url?: string;
      experience_years?: string | null;
      work_experience?: object[];
      education?: object[];
    }
  ): Promise<unknown> => {
    const body: Record<string, unknown> = {};
    if (params.bio) body.bio = params.bio;
    if (params.portfolio_url) body.portfolio_url = params.portfolio_url;
    if (params.experience_years)
      body.experience_years = params.experience_years;
    if (params.work_experience?.length)
      body.work_experience = params.work_experience;
    if (params.education?.length) body.education = params.education;

    const response = await apiClient.patch(
      `/talent/profile/${profileId}`,
      body,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  /**
   * PATCH /talent/profile/:profileId/portfolio/pdf — sube portfolio PDF
   */
  uploadPortfolioPdf: async (
    token: string,
    profileId: string,
    file: File
  ): Promise<unknown> => {
    const form = new FormData();
    form.append('portfolio', file);

    const response = await apiClient.patch(
      `/talent/profile/${profileId}/portfolio/pdf`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
