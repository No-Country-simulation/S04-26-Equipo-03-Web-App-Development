import axios from 'axios';
import { AUTH_COOKIE_NAME } from '../constants/routes';
import { getCookie, setCookie, deleteCookie } from '../utils/cookies';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    accept: '*/*',
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (err: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (err ? p.reject(err) : p.resolve(token!)));
  failedQueue = [];
};

const clearSession = () => {
  deleteCookie(AUTH_COOKIE_NAME);
  deleteCookie('refresh_token');
  window.location.replace('/talent/login');
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Solo actuar en 401 client-side, y no reintentar infinitamente
    if (
      typeof window === 'undefined' ||
      error?.response?.status !== 401 ||
      original._retry
    ) {
      return Promise.reject(error);
    }

    // Si ya se está refrescando, encolar la petición fallida
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          original.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(original);
        })
        .catch((err) => Promise.reject(err));
    }

    original._retry = true;
    isRefreshing = true;

    const refreshToken = getCookie('refresh_token');
    if (!refreshToken) {
      isRefreshing = false;
      clearSession();
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post<{
        access_token: string;
        refresh_token: string;
      }>(`${API_URL}/auth/refresh`, { refresh_token: refreshToken });

      setCookie(AUTH_COOKIE_NAME, data.access_token);
      setCookie('refresh_token', data.refresh_token);

      processQueue(null, data.access_token);
      original.headers['Authorization'] = `Bearer ${data.access_token}`;
      return apiClient(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearSession();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
