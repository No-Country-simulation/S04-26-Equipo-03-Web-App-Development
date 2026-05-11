'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import SiteHeader from '@/components/layout/SiteHeader';
import FormField from '@/components/common/FormField';
import RememberField from '@/components/common/RememberField';
import AuthRedirect from '@/components/common/AuthRedirect';
import AuthHeader from '@/components/common/ AuthHeader';

export default function LoginPage() {
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

          <div className="space-y-4">
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
              placeholder="Mínimo 8 caracteres"
              hint="Al menos 8 caracteres, 1 número."
            />

            <FormField
              label="Confirmar contraseña"
              name="passwordConfirm"
              type="password"
              placeholder="Repetí la contraseña"
            />

            <RememberField />

            <Link href="/onboarding/company">
              <Button className="w-full h-12 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-md mt-2 text-base font-medium cursor-pointer">
                Crear cuenta de empresa
              </Button>
            </Link>

            <AuthRedirect type="signup" />
          </div>
        </Card>
      </div>
    </div>
  );
}
