import { apiClient } from './client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface TalentProfileListItem {
  id: string;
  user_id: string | null;
  availability:
    | 'ACTIVE_JOB_SEARCH'
    | 'OPEN_TO_OFFERS'
    | 'NOT_LOOKING_ASSESSMENT_ONLY'
    | null;
  avatar_url: string | null;
  last_position: string | null;
  experience_years: string | null;
  location: string | null;
  User?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    active: boolean | null;
  } | null;
  Talent_Role?: { id: string; role_name: string | null }[] | null;
  Talent_skill?:
    | {
        skill_id: string | null;
        Skill: { id: string; title: string | null } | null;
      }[]
    | null;
}

export interface TalentSkillItem {
  id: string;
  skill_id: string | null;
  score: number | null;
  self_rating: string | null;
  validated: boolean | null;
  Skill: { id: string; title: string | null; type: string | null } | null;
}

export interface TalentRoleItem {
  id: string;
  role_name: string | null;
  cv_url: string | null;
}

export interface WorkExperienceEntry {
  company?: string;
  role?: string;
  description?: string;
  start_date?: string;
  end_date?: string | null;
  is_current?: boolean;
}

export interface EducationEntry {
  institution?: string;
  title?: string;
  graduation_year?: string;
}

export interface TalentProfileDetail {
  profile: {
    id: string;
    user_id: string | null;
    availability:
      | 'ACTIVE_JOB_SEARCH'
      | 'OPEN_TO_OFFERS'
      | 'NOT_LOOKING_ASSESSMENT_ONLY'
      | null;
    avatar_url: string | null;
    bio: string | null;
    education: EducationEntry[] | null;
    experience_years: string | null;
    last_position: string | null;
    location: string | null;
    portfolio_url: string | null;
    work_experience: WorkExperienceEntry[] | null;
    age: number | null;
  };
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
  roles: TalentRoleItem[];
  skills: TalentSkillItem[];
}

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

    const res = await fetch(`${API_URL}/talent/register`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(err.message || 'Error al registrar perfil');
    }
    return res.json() as Promise<RegisterTalentResponse>;
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

    const res = await fetch(
      `${API_URL}/talent/profile/${profileId}/role-skills`,
      {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      }
    );
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(err.message || 'Error al actualizar habilidades');
    }
    return res.json();
  },

  /**
   * PATCH /talent/profile/:profileId — Step 3 onboarding (JSON)
   */
  updateProfile: async (
    token: string,
    profileId: string,
    params: {
      bio?: string;
      location?: string;
      availability?: string;
      portfolio_url?: string;
      experience_years?: string | null;
      work_experience?: object[];
      education?: object[];
    }
  ): Promise<unknown> => {
    const body: Record<string, unknown> = {};
    if (params.bio !== undefined) body.bio = params.bio;
    if (params.location !== undefined) body.location = params.location;
    if (params.availability !== undefined)
      body.availability = params.availability;
    if (params.portfolio_url !== undefined)
      body.portfolio_url = params.portfolio_url;
    if (params.experience_years !== undefined)
      body.experience_years = params.experience_years;
    if (params.work_experience !== undefined)
      body.work_experience = params.work_experience;
    if (params.education !== undefined) body.education = params.education;

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
   * GET /talent/profiles — lista todos los perfiles (público)
   */
  listProfiles: async (): Promise<{ profiles: TalentProfileListItem[] }> => {
    const response = await apiClient.get<{ profiles: TalentProfileListItem[] }>(
      '/talent/profiles'
    );
    return response.data;
  },

  /**
   * GET /talent/profile/:profileId — detalle completo de un perfil
   */
  getProfileById: async (profileId: string): Promise<TalentProfileDetail> => {
    const res = await apiClient.get<TalentProfileDetail>(
      `/talent/profile/${profileId}`
    );
    return res.data;
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

    const res = await fetch(
      `${API_URL}/talent/profile/${profileId}/portfolio/pdf`,
      {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      }
    );
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { message?: string };
      throw new Error(err.message || 'Error al subir portfolio PDF');
    }
    return res.json();
  },
};
