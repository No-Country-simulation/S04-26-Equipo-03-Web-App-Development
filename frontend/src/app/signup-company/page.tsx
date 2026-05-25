'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import SiteHeader from '@/components/layout/SiteHeader';
import AuthRedirect from '@/components/common/AuthRedirect';
import AuthHeader from '@/components/common/AuthHeader';
import { authApi } from '@/lib/api/auth';
import { setCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';

const PERSONAL_DOMAINS = [
  'gmail.com', 'gmail.com.ar', 'hotmail.com', 'hotmail.es', 'hotmail.co',
  'outlook.com', 'outlook.es', 'yahoo.com', 'yahoo.es', 'yahoo.com.ar',
  'icloud.com', 'me.com', 'live.com', 'live.es', 'live.com.ar',
  'msn.com', 'aol.com', 'protonmail.com', 'pm.me',
];

function isPersonalEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return !!domain && PERSONAL_DOMAINS.includes(domain);
}

export default function SignupCompanyPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password || !form.confirmPassword) {
      setError('Completá todos los campos.');
      return;
    }

    if (isPersonalEmail(form.email)) {
      setError('Solo aceptamos emails corporativos. No uses Gmail, Hotmail, Outlook, Yahoo u otras cuentas personales.');
      return;
    }

    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.registerEnterprise({
        email: form.email,
        password: form.password,
      });
      setCookie(AUTH_COOKIE_NAME, data.access_token);
      router.push('/onboarding/company');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al crear la cuenta.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <SiteHeader
        rightContent={
          <Link href="/" className="text-sm text-gray-500 hover:text-[#1a1a2e]">
            Volver al inicio
          </Link>
        }
      />

      <div className="flex items-center justify-center px-4 sm:px-6 py-16">
        <Card className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
          <AuthHeader
            title="Creá tu cuenta de empresa"
            subtitle="Accedé al pool de talento validado."
          />

          <form onSubmit={ handleSubmit } className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
                Email corporativo
              </label>
              <Input
                type="email"
                name="email"
                placeholder="nombre@empresa.com"
                value={ form.email }
                onChange={ handleChange }
                className="h-12 border-gray-200 rounded-md"
                autoComplete="email"
              />
              <p className="mt-1 text-xs text-gray-400">
                No aceptamos cuentas personales (gmail, hotmail, yahoo, etc).
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
                Contraseña
              </label>
              <Input
                type="password"
                name="password"
                placeholder="Mínimo 8 caracteres"
                value={ form.password }
                onChange={ handleChange }
                className="h-12 border-gray-200 rounded-md"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-1">
                Confirmar contraseña
              </label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Repetí la contraseña"
                value={ form.confirmPassword }
                onChange={ handleChange }
                className="h-12 border-gray-200 rounded-md"
                autoComplete="new-password"
              />
            </div>

            { error && (
              <p className="text-sm text-red-500 text-center">{ error }</p>
            ) }

            <Button
              type="submit"
              disabled={ loading }
              className="w-full h-12 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-md mt-2 text-base font-medium cursor-pointer"
            >
              { loading ? 'Creando cuenta...' : 'Crear cuenta de empresa' }
            </Button>

            <AuthRedirect type="signup" />
          </form>
        </Card>
      </div>
    </div>
  );
}
