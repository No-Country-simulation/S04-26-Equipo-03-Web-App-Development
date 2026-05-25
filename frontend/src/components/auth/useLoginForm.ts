import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, LoginRequest } from '@/lib/api/auth';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';
import { setCookie, deleteCookie } from '@/lib/utils/cookies';

function getRoleFromToken(token: string): string | undefined {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload?.user_metadata?.role;
  } catch {
    return undefined;
  }
}

export const useLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    setIsLoading(true);
    setError(null);

    try {
      const credentials: LoginRequest = { email, password };
      const data = await authApi.login(credentials);

      if (data.access_token) {
        // Limpiar token anterior antes de setear el nuevo
        deleteCookie(AUTH_COOKIE_NAME);
        setCookie(AUTH_COOKIE_NAME, data.access_token);
      }
      if (data.refresh_token) {
        setCookie('refresh_token', data.refresh_token);
      }

      // Leer el rol desde el JWT directamente (igual que el middleware)
      const role =
        getRoleFromToken(data.access_token) ?? data.user_metadata?.role;

      if (role === 'RECRUITER') {
        router.push('/dashboard/company');
      } else if (role === 'TALENT') {
        router.push('/talent/learning-path');
      } else if (role === 'ADMIN') {
        router.push('/');
      } else {
        router.push('/');
      }
    } catch (err: unknown) {
      const axiosMsg =
        err instanceof Error &&
        'response' in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message;
      setError(
        axiosMsg ||
          'Error al iniciar sesión. Por favor, verifica tus credenciales.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleLogin,
  };
};
