import { apiClient } from './client';
import { TalentProfileListItem } from './talent';

export interface EnterpriseRecord {
  id: string;
  name: string | null;
  description?: string | null;
  website_url?: string | null;
}

export interface EnterpriseOnboardingRequest {
  first_name: string;
  last_name: string;
  company_name: string;
  website_url?: string;
  industry?: string;
  size?: string;
}

export interface EnterpriseOnboardingResponse {
  message: string;
  enterprise_id: string;
}

export const enterprisesApi = {
  listAll: async (): Promise<EnterpriseRecord[]> => {
    const response = await apiClient.get<EnterpriseRecord[]>('/enterprises');
    return response.data;
  },

  completeOnboarding: async (
    data: EnterpriseOnboardingRequest,
    token: string
  ): Promise<EnterpriseOnboardingResponse> => {
    const response = await apiClient.post<EnterpriseOnboardingResponse>(
      '/enterprises/onboarding',
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  getFavorites: async (
    token: string
  ): Promise<{ favorites: TalentProfileListItem[] }> => {
    const response = await apiClient.get<{
      favorites: TalentProfileListItem[];
    }>('/enterprises/recruiters/me/favorites', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  addFavorite: async (
    token: string,
    profileId: string
  ): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      `/enterprises/recruiters/me/favorites/${profileId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  removeFavorite: async (
    token: string,
    profileId: string
  ): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      `/enterprises/recruiters/me/favorites/${profileId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};
