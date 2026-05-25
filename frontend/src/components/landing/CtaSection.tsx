'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { getCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';

function getUserRole(): string | null {
  const token = getCookie(AUTH_COOKIE_NAME);
  if (!token) return null;
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload?.user_metadata?.role ?? null;
  } catch {
    return null;
  }
}

export default function CtaSection() {
  const router = useRouter();
  const [role] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return getUserRole();
  });

  const handleBuscoTrabajo = () => {
    router.push(role === 'TALENT' ? '/talent/learning-path' : '/talent/signup');
  };

  const handleBuscoTalento = () => {
    router.push(role === 'RECRUITER' ? '/dashboard/company' : '/signup-company');
  };
  return (
    <section className="bg-[#1a1a2e] px-4 sm:px-6 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">
          Empezá hoy. Tomate 15 minutos.
        </h2>
        <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8">
          Tu próximo trabajo (o tu próximo hire) está a un diagnóstico de
          distancia.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={ handleBuscoTrabajo }
            className="w-full sm:w-auto bg-[#4f46e5] hover:bg-[#4338ca] text-white px-6 py-2.5 h-auto rounded-md"
          >
            Busco trabajo
          </Button>
          <Button
            onClick={ handleBuscoTalento }
            variant="outline"
            className="w-full sm:w-auto border-gray-600 text-white px-6 py-2.5 h-auto rounded-md hover:bg-white/10 bg-transparent"
          >
            Busco talento
          </Button>
        </div>
      </div>
    </section>
  );
}
