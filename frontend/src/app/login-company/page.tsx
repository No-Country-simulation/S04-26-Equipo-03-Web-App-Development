'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import SiteHeader from '@/components/layout/SiteHeader';
import { ArrowLeft } from 'lucide-react';
import FormField from '@/components/common/FormField';
import RememberField from '@/components/common/RememberField';
import AuthRedirect from '@/components/common/AuthRedirect';
import AuthHeader from '@/components/common/AuthHeader';
import { useLoginForm } from '@/components/auth/useLoginForm';

export default function LoginPage() {
  const { isLoading, error, handleLogin } = useLoginForm();
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <SiteHeader
        rightContent={
          <Link href="/" className="text-sm text-gray-500 hover:text-[#1a1a2e]">
            Volver al inicio
          </Link>
        }
      />

      <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-16">
        <Card className="relative w-full max-w-md p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
          <Link
            href="/"
            className="absolute flex items-center -top-7 left-0 mb-2 text-xs text-[#6B7280] cursor-pointer"
          >
            <ArrowLeft size={ 16 } className="mr-1" /> Atrás
          </Link>
          <AuthHeader
            title="Iniciar sesión"
            subtitle="Accedé al pool de talento validado."
          />

          <form action={ handleLogin } className="space-y-4">
            <FormField
              type="email"
              name="email"
              label="Email corporativo"
              placeholder="nombre@empresa.com"
              hint="No aceptamos cuentas personales (gmail, hotmail, yahoo, etc)."
            />

            <FormField
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
            />

            <RememberField
              label="Recordar mi cuenta"
              forgotHref="/forgot-password"
            />

            { error && (
              <p className="text-red-500 text-sm">{ error }</p>
            ) }

            <Button
              type="submit"
              disabled={ isLoading }
              className="w-full h-12 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-md mt-2 text-base font-medium cursor-pointer disabled:opacity-70"
            >
              { isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }
            </Button>

            <AuthRedirect type="login" />
          </form>

        </Card>
      </div>
    </div>
  );
}
