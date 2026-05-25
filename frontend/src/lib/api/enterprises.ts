import { apiClient } from './client';

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
};
