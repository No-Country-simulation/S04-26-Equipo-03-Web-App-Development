'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  diagnosticApi,
  DIAGNOSTIC_SESSION_KEY,
  DIAGNOSTIC_RESULT_KEY,
  type DiagnosticSession,
} from '@/lib/api/diagnostic';
import { getCookie, deleteCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';

const SUBMITTING_MESSAGES_ONBOARDING = [
  'Evaluando tus respuestas...',
  'Calculando tu brecha de habilidades...',
  'Diseñando tu ruta de aprendizaje...',
  '¡Finalizando! Un momento más...',
];

const SUBMITTING_MESSAGES_SKILL_VALIDATION = [
  'Evaluando tus respuestas...',
  'Calculando tu puntaje...',
  'Verificando el nivel de la skill...',
  '¡Finalizando! Un momento más...',
];

interface DiagnosticQuizProps {
  sessionKey?: string;
  resultKey?: string;
  fallbackPath?: string;
  resultPath?: string;
}

export function DiagnosticQuiz({
  sessionKey = DIAGNOSTIC_SESSION_KEY,
  resultKey = DIAGNOSTIC_RESULT_KEY,
  fallbackPath = '/talent/diagnostic',
  resultPath = '/talent/diagnostic/results',
}: DiagnosticQuizProps = {}) {
  const router = useRouter();
  const [session, setSession] = useState<DiagnosticSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'a' | 'b' | 'c' | 'd'>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittingStep, setSubmittingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submitting) return;
    setSubmittingStep(0);
    const id = setInterval(() => {
      setSubmittingStep((s) => Math.min(s + 1, 3));
    }, 3500);
    return () => clearInterval(id);
  }, [submitting]);

  useEffect(() => {
    const raw = sessionStorage.getItem(sessionKey);
    if (!raw) {
      router.replace(fallbackPath);
      return;
    }
    setSession(JSON.parse(raw) as DiagnosticSession);
  }, [router]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-[40px] h-[40px] rounded-full border-[3px] border-[#e5e7eb] border-t-[#4f46e5] animate-spin" />
      </div>
    );
  }

  const { questions, diagnosticId, roleName, skillId, skillName } = session;
  const isSkillValidation = Boolean(skillId);
  const submittingMessages = isSkillValidation
    ? SUBMITTING_MESSAGES_SKILL_VALIDATION
    : SUBMITTING_MESSAGES_ONBOARDING;
  const total = questions.length;
  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / total) * 100;
  const isLast = currentIndex === total - 1;

  const selectAnswer = (option: 'a' | 'b' | 'c' | 'd') => {
    setAnswers((prev) => ({ ...prev, [current.id]: option }));
    setError(null);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleNext = async () => {
    if (!answers[current.id]) {
      setError('Seleccioná una opción antes de continuar.');
      return;
    }
    setError(null);

    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      return;
    }

    // Última pregunta: enviar todo
    const token = getCookie(AUTH_COOKIE_NAME);
    if (!token) return;

    const responses = questions.map((q) => ({
      question_id: q.id,
      selected_option: answers[q.id],
    }));

    setSubmitting(true);
    try {
      const result = session.skillId
        ? await diagnosticApi.submitSkillValidationResponses(token, diagnosticId, responses)
        : await diagnosticApi.submitResponses(token, diagnosticId, responses);
      sessionStorage.setItem(
        resultKey,
        JSON.stringify({
          gapAnalysis: result.gap_analysis,
          completedAt: result.completed_at,
          roleName,
          skillId,
          skillName,
        }),
      );
      router.push(resultPath);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string; }; }; })
        ?.response?.data?.message;
      setError(msg ?? 'Error al enviar las respuestas. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      { submitting && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center px-[24px]">
          <div className="text-[72px] mb-[16px] animate-pulse select-none">🧠</div>
          <h2 className="text-[22px] font-bold text-[#111827] mb-[8px] text-center">
            Analizando tus resultados
          </h2>
          <p className="text-[14px] text-[#6b7280] text-center max-w-[380px] mb-[40px]">
            { isSkillValidation
              ? `Estamos evaluando tus respuestas sobre ${skillName ?? 'la skill'}.`
              : 'Estamos evaluando tus respuestas y preparando tu ruta personalizada.' }
          </p>
          <div className="flex flex-col gap-[14px] w-full max-w-[360px]">
            { submittingMessages.map((msg, i) => (
              <div
                key={ msg }
                className={ 'flex items-center gap-[12px] text-[14px] transition-opacity duration-500 ' + (i <= submittingStep ? 'opacity-100' : 'opacity-25') }
              >
                <span className={ 'shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-bold ' + (i < submittingStep ? 'bg-[#22c55e] text-white' : i === submittingStep ? 'bg-[#4f46e5] text-white' : 'bg-[#e5e7eb] text-[#9ca3af]') }>
                  { i < submittingStep ? '✓' : i + 1 }
                </span>
                <span className={ i === submittingStep ? 'text-[#111827] font-medium' : 'text-[#6b7280]' }>
                  { msg }
                </span>
                { i === submittingStep && (
                  <span className="ml-auto shrink-0 w-[14px] h-[14px] rounded-full border-[2px] border-[#4f46e5] border-t-transparent animate-spin" />
                ) }
              </div>
            )) }
          </div>
        </div>
      ) }
      {/* Header */ }
      <header className="shrink-0 border-b border-[#e5e7eb] px-[24px] py-[14px] bg-white">
        <div className="max-w-[720px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <div className="w-[28px] h-[28px] bg-[#1a1a2e] rounded-[6px] flex items-center justify-center">
              <span className="text-white text-[11px] font-bold">T</span>
            </div>
            <span className="font-semibold text-[#1a1a2e] text-[15px]">TalentBridge</span>
          </div>
          <div className="flex items-center gap-[12px]">
            <button
              onClick={ () => router.push(fallbackPath) }
              className="flex items-center gap-[6px] px-[14px] py-[7px] rounded-[8px] border border-[#e5e7eb] text-[13px] text-[#6b7280] hover:bg-[#f9fafb] transition-colors cursor-pointer"
            >
              💾 Pausar y guardar
            </button>
            <QuizAvatarMenu />
          </div>
        </div>
      </header>

      {/* Progress bar */ }
      <div className="px-[24px] py-[10px] border-b border-[#f3f4f6]">
        <div className="max-w-[720px] mx-auto flex items-center gap-[14px]">
          <span className="shrink-0 text-[12px] text-[#6b7280]">
            Pregunta { currentIndex + 1 } de { total }
          </span>
          <div className="flex-1 h-[5px] bg-[#e5e7eb] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4f46e5] rounded-full transition-all duration-300"
              style={ { width: `${progress}%` } }
            />
          </div>
        </div>
      </div>

      {/* Content */ }
      <div className="flex-1 max-w-[720px] mx-auto w-full px-[24px] py-[40px]">
        {/* Skill tag */ }
        <div className="mb-[20px]">
          <span className="inline-block px-[12px] py-[5px] rounded-full border border-[#e5e7eb] text-[12px] text-[#374151]">
            { current.skill_related }
          </span>
        </div>

        {/* Question */ }
        <h2 className="text-[19px] font-bold text-[#111827] mb-[28px] leading-[1.45]">
          { current.question_text }
        </h2>

        {/* Options */ }
        <div className="flex flex-col gap-[12px] mb-[24px]">
          { (Object.entries(current.options) as ['a' | 'b' | 'c' | 'd', string][]).map(
            ([key, text]) => {
              const selected = answers[current.id] === key;
              return (
                <button
                  key={ key }
                  onClick={ () => selectAnswer(key) }
                  className={
                    'w-full text-left px-[20px] py-[16px] rounded-[12px] border-[2px] text-[14px] transition-colors cursor-pointer flex items-center gap-[14px] ' +
                    (selected
                      ? 'border-[#4f46e5] bg-[#eef2ff] text-[#3730a3]'
                      : 'border-[#e5e7eb] text-[#374151] hover:border-[#c7d2fe] hover:bg-[#f5f3ff]')
                  }
                >
                  <span
                    className={
                      'shrink-0 w-[18px] h-[18px] rounded-full border-[2px] flex items-center justify-center ' +
                      (selected ? 'border-[#4f46e5]' : 'border-[#9ca3af]')
                    }
                  >
                    { selected && (
                      <span className="w-[8px] h-[8px] rounded-full bg-[#4f46e5]" />
                    ) }
                  </span>
                  { text }
                </button>
              );
            },
          ) }
        </div>

        {/* Auto-save note */ }
        <p className="text-[12px] text-[#9ca3af] text-center mb-[28px]">
          Tu progreso se guarda automáticamente cada respuesta.
        </p>

        { error && (
          <div className="mb-[16px] rounded-[8px] bg-[#fef2f2] border border-[#fecaca] px-[16px] py-[10px] text-[14px] text-[#dc2626]">
            { error }
          </div>
        ) }

        {/* Navigation */ }
        <div className="flex items-center justify-between">
          <button
            onClick={ handlePrev }
            disabled={ currentIndex === 0 }
            className="text-[14px] text-[#6b7280] hover:text-[#111827] transition-colors disabled:invisible cursor-pointer"
          >
            ← Pregunta anterior
          </button>
          <button
            onClick={ handleNext }
            disabled={ submitting }
            className="flex items-center gap-[8px] px-[28px] py-[10px] rounded-[8px] bg-[#4f46e5] text-white text-[14px] font-semibold hover:bg-[#4338ca] transition-colors cursor-pointer disabled:opacity-60"
          >
            { isLast ? 'Finalizar' : 'Siguiente →' }
          </button>
        </div>
      </div>
    </div>
  );
}

function QuizAvatarMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [initials, setInitials] = useState('T');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const first: string = payload?.user_metadata?.first_name?.[0]?.toUpperCase() ?? '';
        const last: string = payload?.user_metadata?.last_name?.[0]?.toUpperCase() ?? '';
        const computed = `${first}${last}`;
        if (computed) setInitials(computed);
      } catch { /* mantiene 'T' */ }
    }
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleLogout = () => {
    deleteCookie(AUTH_COOKIE_NAME);
    router.replace('/talent/login');
  };

  return (
    <div className="relative" ref={ menuRef }>
      <button
        onClick={ () => setOpen((p) => !p) }
        className="w-[34px] h-[34px] rounded-full bg-[#4f46e5] flex items-center justify-center cursor-pointer hover:bg-[#4338ca] transition-colors focus:outline-none"
        aria-label="Menú de usuario"
        aria-expanded={ open }
      >
        <span className="text-white text-[13px] font-semibold select-none leading-none">{ initials }</span>
      </button>

      { open && (
        <div className="absolute right-0 mt-[8px] w-[180px] rounded-[10px] border border-[#e5e7eb] bg-white shadow-lg py-[6px] z-50">
          <button
            onClick={ handleLogout }
            className="w-full flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-[#374151] hover:bg-[#f9fafb] transition-colors cursor-pointer text-left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-[15px] h-[15px] text-[#6b7280]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={ 2 }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
            Cerrar sesión
          </button>
        </div>
      ) }
    </div>
  );
}
