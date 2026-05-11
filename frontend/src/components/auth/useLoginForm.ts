import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, LoginRequest } from '@/lib/api/auth';
import { AUTH_COOKIE_NAME, PRIVATE_ROUTES_TALENT, PRIVATE_ROUTES_COMPANY } from '@/lib/constants/routes';
import { setCookie } from '@/lib/utils/cookies';

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

      console.log('Login successful:', data);
      
      if (data.access_token) {
        setCookie(AUTH_COOKIE_NAME, data.access_token);
      }
      
      const role = data.user_metadata?.role;
      
      if (role === 'RECRUITER') {
        router.push(PRIVATE_ROUTES_COMPANY[0]);
      } else if (role === 'TALENT'){
        router.push(PRIVATE_ROUTES_TALENT[0]);
      } else if (role === 'ADMIN') {
        router.push('/');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
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
