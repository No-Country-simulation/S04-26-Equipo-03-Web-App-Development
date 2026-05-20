import axios from 'axios';
import { AUTH_COOKIE_NAME } from '../constants/routes';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    accept: '*/*',
    'Content-Type': 'application/json',
  },
});

// Cerrar sesión automáticamente si el token expiró (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      window.location.replace('/talent/login');
    }
    return Promise.reject(error);
  }
);
