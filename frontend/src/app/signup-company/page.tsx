'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import SiteHeader from '@/components/layout/SiteHeader';
import { Checkbox } from '@/components/ui/checkbox';

export default function LoginPage() {
  const [isSelected, setIsSelected] = useState(true);

  const toggleLevel = (isSelected: boolean) => {
    setIsSelected(isSelected);
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
          <h1 className="text-2xl font-bold text-[#1a1a2e]">
            Creá tu cuenta de empresa
          </h1>
          <p className="text-gray-500 mb-0">
            Accedé al pool de talento validado.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-2">
                Email corporativo
              </label>
              <Input
                type="email"
                placeholder="nombre@empresa.com"
                className="h-12 border-gray-200 rounded-md"
              />
              <p className="text-sm text-gray-500 mt-2">
                No aceptamos cuentas personales (gmail, hotmail, yahoo, etc).
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-2">
                Contraseña
              </label>
              <Input
                name="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                className="h-12 border-gray-200 rounded-md"
              />
              <p className="text-sm text-gray-500 mt-2">
                Al menos 8 caracteres, 1 número.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-2">
                Confirmar contraseña
              </label>
              <Input
                name="passwordConfirm"
                type="password"
                placeholder="Repetí la contraseña"
                className="h-12 border-gray-200 rounded-md"
              />
            </div>

            <label
              key="recordar"
              className="flex items-center gap-3 cursor-pointer"
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => toggleLevel(!isSelected)}
                className={`${
                  isSelected
                    ? 'data-[state=checked]:bg-[#4f46e5] data-[state=checked]:border-[#4f46e5]'
                    : ''
                }`}
              />
              <span className="text-sm text-[#1a1a2e] whitespace-nowrap">
                Recordar mi cuenta en este dispositivo
              </span>
            </label>

            <Link href="/onboarding/company">
              <Button className="w-full h-12 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-md mt-2 text-base font-medium cursor-pointer">
                Crear cuenta de empresa
              </Button>
            </Link>

            <p className="text-sm text-gray-500 text-center mt-4">
              ¿Ya tenés cuenta?{' '}
              <a
                href="/login-company"
                className="text-[#4f46e5] hover:underline font-medium"
              >
                Iniciá sesión
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
