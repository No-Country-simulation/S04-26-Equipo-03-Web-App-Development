import { apiClient } from './client';

export interface EnterpriseRecord {
  id: string;
  name: string | null;
  description?: string | null;
  website_url?: string | null;
}

export const enterprisesApi = {
  listAll: async (): Promise<EnterpriseRecord[]> => {
    const response = await apiClient.get<EnterpriseRecord[]>('/enterprises');
    return response.data;
  },
};
