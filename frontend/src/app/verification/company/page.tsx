'use client';

import SiteHeader from '@/components/layout/SiteHeader';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import email from './vecteezy_white-envelope-icon_55066058.png';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CompanyOnboardingPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <div className="">
        <SiteHeader
          rightContent={
            <Link href="/" className="text-sm text-gray-500">
              Volver al inicio
            </Link>
          }
        />
      </div>
      <Card className="w-md mx-auto mt-12 p-6">
        <div className="mx-auto flex flex-row items-center gap-3">
          <div className="bg-[#EEF2FF] py-3 px-2.5 w-15 rounded-full items-center">
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
        <Button variant="outline" className="cursor-pointer">
          Reenviar email
        </Button>
        <Button variant="link" className="cursor-pointer">
          Cambiar email
        </Button>
        <p className="bg-[#F9FAFB] text-[#4B5563] text-sm p-6 text-center rounded-md">
          Avanzaremos automáticamente cuando confirmes el email. Si no recibís
          nada en 5 minutos, revisá la carpeta de spam.
        </p>
      </Card>
    </div>
  );
}
