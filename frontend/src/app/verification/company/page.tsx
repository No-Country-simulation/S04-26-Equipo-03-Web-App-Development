'use client';

import SiteHeader from '@/components/layout/SiteHeader';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import email from './vecteezy_white-envelope-icon_55066058.png';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CompanyOnboardingPage() {
  return (
    <main className="min-h-dvh flex flex-col bg-white">
      <SiteHeader
        rightContent={
          <Link href="/" className="text-sm text-gray-500">
            Volver al inicio
          </Link>
        }
      />
      <Card className="max-w-md mx-4 sm:mx-auto mt-12 p-6 flex flex-col gap-6">
        <div className="mx-auto flex flex-row items-center gap-3">
          <div className="bg-[#EEF2FF] size-14 rounded-full flex items-center justify-center">
            <Image src={email} alt="email" width={40} height={40} />
          </div>
          <h1>Revisá tu bandeja</h1>
        </div>
        <p className="text-center">
          Te enviamos un link de verificación a{' '}
          <strong className="font-bold">contacto@acme-studio.com.</strong>{' '}
          <span className="font-bold text-[#111827]">
            Hacé clic ahí para confirmar que el email es tuyo y seguir con el
            registro.
          </span>
        </p>
        <div className="flex flex-col gap-3">
          <Button variant="outline" className="cursor-pointer w-full">
            Reenviar email
          </Button>
          <Button variant="link" className="cursor-pointer w-full">
            Cambiar email
          </Button>
        </div>
        <p className="bg-[#F9FAFB] text-[#4B5563] text-sm p-6 text-center rounded-md">
          Avanzaremos automáticamente cuando confirmes el email. Si no recibís
          nada en 5 minutos, revisá la carpeta de spam.
        </p>
      </Card>
    </main>
  );
}
