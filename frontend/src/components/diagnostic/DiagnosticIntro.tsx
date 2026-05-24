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
import { Mascot } from '@/components/common/Mascot';

interface Props {
  profileId: string;
  roleName: string;
}

const STARTING_MESSAGES = [
  'Analizando tu perfil y skills...',
  'Generando preguntas con IA...',
  'Personalizando el cuestionario...',
  '¡Casi listo! Preparando tu test...',
];

export function DiagnosticIntro({ profileId, roleName }: Props) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastDiagnostic, setLastDiagnostic] = useState<PastDiagnostic | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!starting) return;
    setLoadingStep(0);
    const id = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, STARTING_MESSAGES.length - 1));
    }, 3500);
    return () => clearInterval(id);
  }, [starting]);

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

  if (starting) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex flex-col items-center justify-center px-[24px]">
        <Mascot variant="searching" className="w-[80px] h-[80px] mb-[16px] animate-pulse" />
        <h2 className="text-[22px] font-bold text-[#111827] mb-[8px] text-center">
          Preparando tu diagnóstico
        </h2>
        <p className="text-[14px] text-[#6b7280] text-center max-w-[380px] mb-[40px]">
          Estamos generando preguntas personalizadas según tu perfil y skills.
        </p>
        <div className="flex flex-col gap-[14px] w-full max-w-[360px]">
          { STARTING_MESSAGES.map((msg, i) => (
            <div
              key={ msg }
              className={ 'flex items-center gap-[12px] text-[14px] transition-opacity duration-500 ' + (i <= loadingStep ? 'opacity-100' : 'opacity-25') }
            >
              <span className={ 'shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-bold ' + (i < loadingStep ? 'bg-[#22c55e] text-white' : i === loadingStep ? 'bg-[#4f46e5] text-white' : 'bg-[#e5e7eb] text-[#9ca3af]') }>
                { i < loadingStep ? '✓' : i + 1 }
              </span>
              <span className={ i === loadingStep ? 'text-[#111827] font-medium' : 'text-[#6b7280]' }>
                { msg }
              </span>
              { i === loadingStep && (
                <span className="ml-auto shrink-0 w-[14px] h-[14px] rounded-full border-[2px] border-[#4f46e5] border-t-transparent animate-spin" />
              ) }
            </div>
          )) }
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      <TalentAppHeader activeTab="diagnostic" />

      <div className="flex-1 flex flex-col items-center px-[24px] py-[48px]">
        {/* Mascot */ }
        <Mascot variant="idle" className="w-[96px] h-[96px] mb-[16px]" />

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
            disabled={ starting || !!cooldownDays }
            className="flex items-center gap-[8px] px-[28px] py-[11px] rounded-[8px] bg-[#4f46e5] text-white text-[14px] font-semibold hover:bg-[#4338ca] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
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


