import { apiClient } from './client';

export type SelfRatingLabel = 'no_lo_conozco' | 'lo_uso' | 'lo_domino';

export interface SkillSuggestion {
  id: string;
  title: string;
  type: 'TECH' | 'SOFT' | 'COGNITIVE';
}

export interface SkillSuggestionsResponse {
  suggestions: SkillSuggestion[];
  role_name: string | null;
}

export interface SkillRatingEntry {
  skill_id: string;
  self_rating: SelfRatingLabel;
}

export const preDiagnosticApi = {
  getSuggestions: async (
    token: string,
    profileId: string
  ): Promise<SkillSuggestionsResponse> => {
    const { data } = await apiClient.get<SkillSuggestionsResponse>(
      `/talent/${profileId}/skill-suggestions`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },

  saveRatings: async (
    token: string,
    profileId: string,
    ratings: SkillRatingEntry[]
  ): Promise<{ saved: number }> => {
    const { data } = await apiClient.post<{ saved: number }>(
      `/talent/${profileId}/skill-ratings`,
      { ratings },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  },
};
