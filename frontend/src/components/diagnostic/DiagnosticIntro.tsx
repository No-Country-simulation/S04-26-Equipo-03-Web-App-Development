'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TalentAppHeader } from '@/components/layout/TalentAppHeader';
import {
  diagnosticApi,
  DIAGNOSTIC_SESSION_KEY,
  type PastDiagnostic,
} from '@/lib/api/diagnostic';
import { getCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';

interface Props {
  profileId: string;
  roleName: string;
}

export function DiagnosticIntro({ profileId, roleName }: Props) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDiagnostic, setLastDiagnostic] = useState<PastDiagnostic | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (!token) return;
    diagnosticApi
      .findByProfile(token, profileId)
      .then(({ diagnostics }) => {
        const completed = diagnostics.find(
          (d) => d.type === 'INITIAL_ONBOARDING' && d.status === 'COMPLETED',
        );
        setLastDiagnostic(completed ?? null);
      })
      .catch(() => { })
      .finally(() => setLoadingHistory(false));
  }, [profileId]);

  const handleStart = async () => {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (!token) return;
    setStarting(true);
    setError(null);
    try {
      const { id, questions } = await diagnosticApi.create(token, profileId);
      sessionStorage.setItem(
        DIAGNOSTIC_SESSION_KEY,
        JSON.stringify({ diagnosticId: id, questions, profileId, roleName }),
      );
      router.push('/talent/diagnostic/quiz');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string; }; }; })
        ?.response?.data?.message;
      setError(msg ?? 'No se pudo iniciar el diagnóstico. Intentá de nuevo.');
    } finally {
      setStarting(false);
    }
  };

  const cooldownDays = (() => {
    if (!lastDiagnostic?.completed_at) return null;
    const diffDays = Math.floor(
      (Date.now() - new Date(lastDiagnostic.completed_at).getTime()) /
      (1000 * 60 * 60 * 24),
    );
    return diffDays < 30 ? 30 - diffDays : null;
  })();

  const formattedDate = lastDiagnostic?.completed_at
    ? new Date(lastDiagnostic.completed_at).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
    })
    : null;

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      <TalentAppHeader activeTab="diagnostic" />

      <div className="flex-1 flex flex-col items-center px-[24px] py-[48px]">
        {/* Mascot */ }
        <div className="text-[80px] mb-[16px] select-none">🤖</div>

        <h1 className="text-[26px] font-bold text-[#111827] mb-[8px] text-center">
          Tu diagnóstico de habilidades
        </h1>
        <p className="text-[14px] text-[#6b7280] text-center max-w-[400px] mb-[32px]">
          Es la forma de validar tu nivel y armar una ruta personalizada. No hay
          respuestas correctas o incorrectas: el resultado es una foto de dónde
          estás hoy.
        </p>

        {/* Info card */ }
        <div className="w-full max-w-[480px] rounded-[12px] border border-[#e5e7eb] bg-white px-[24px] py-[20px] mb-[16px]">
          { [
            '15-20 preguntas de opción múltiple',
            'Tiempo estimado: 15 minutos',
            'Podés pausarlo y retomarlo cuando quieras',
          ].map((item) => (
            <div key={ item } className="flex items-center gap-[10px] py-[6px]">
              <span className="text-[#22c55e] font-bold">✓</span>
              <span className="text-[14px] text-[#374151]">{ item }</span>
            </div>
          )) }
        </div>

        {/* Previous diagnostic notice */ }
        { !loadingHistory && lastDiagnostic && (
          <div className="w-full max-w-[480px] rounded-[12px] border border-[#bbf7d0] bg-[#f0fdf4] px-[20px] py-[14px] mb-[24px]">
            <p className="text-[13px] font-semibold text-[#15803d]">
              ✓ Ya hiciste el diagnóstico{ formattedDate ? ` el ${formattedDate}` : '' }.
            </p>
            <p className="text-[13px] text-[#16a34a] mt-[2px]">
              { cooldownDays
                ? `Podés volver a tomarlo en ${cooldownDays} días para reflejar tu progreso.`
                : 'Podés volver a tomarlo cuando quieras.' }
            </p>
          </div>
        ) }

        { error && (
          <div className="w-full max-w-[480px] mb-[16px] rounded-[8px] bg-[#fef2f2] border border-[#fecaca] px-[16px] py-[10px] text-[14px] text-[#dc2626]">
            { error }
          </div>
        ) }

        {/* Actions */ }
        <div className="flex gap-[12px] flex-wrap justify-center">
          <button
            onClick={ handleStart }
            disabled={ starting }
            className="flex items-center gap-[8px] px-[28px] py-[11px] rounded-[8px] bg-[#4f46e5] text-white text-[14px] font-semibold hover:bg-[#4338ca] transition-colors cursor-pointer disabled:opacity-60"
          >
            { starting && (
              <span className="w-[14px] h-[14px] rounded-full border-[2px] border-white border-t-transparent animate-spin" />
            ) }
            Empezar el diagnóstico
          </button>
          <Link
            href="/talent/learning-path"
            className="px-[24px] py-[11px] rounded-[8px] border border-[#d1d5db] text-[14px] font-medium text-[#374151] hover:bg-[#f9fafb] transition-colors"
          >
            Ver mi ruta actual
          </Link>
        </div>
      </div>
    </div>
  );
}


