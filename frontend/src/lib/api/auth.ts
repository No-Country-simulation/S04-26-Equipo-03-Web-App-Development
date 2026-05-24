import { apiClient } from './client';

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user_metadata: {
    active: boolean;
    email: string;
    email_verified: boolean;
    first_name: string;
    last_name: string;
    phone_verified: boolean;
    role: 'TALENT' | 'RECRUITER' | 'ADMIN';
    sub: string;
  };
}

export interface RegisterRequest {
  email: string;
  password?: string;
}

export interface RegisterResponse {
  message: string;
  access_token: string;
  user_metadata: LoginResponse['user_metadata'];
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials
    );
    return response.data;
  },

  registerTalent: async (
    credentials: RegisterRequest
  ): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      '/auth/register/talent',
      credentials
    );
    return response.data;
  },
};
