import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, RegisterRequest } from '@/lib/api/auth';
import { setCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';

export const useRegisterTalent = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const validate = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    return true;
  };

  const register = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setError(null);

    try {
      const payload: RegisterRequest = {
        email: formData.email,
        password: formData.password,
      };

      const data = await authApi.registerTalent(payload);
      setCookie(AUTH_COOKIE_NAME, data.access_token);

      router.push('/talent/onboarding');
    } catch (err: unknown) {
      const axiosMsg =
        err instanceof Error &&
        'response' in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message;
      setError(
        axiosMsg ||
          'Ocurrió un error al registrarse. Por favor intenta de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    error,
    handleChange,
    register,
  };
};
