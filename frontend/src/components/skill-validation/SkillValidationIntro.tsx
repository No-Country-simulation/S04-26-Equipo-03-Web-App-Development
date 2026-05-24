'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TalentAppHeader } from '@/components/layout/TalentAppHeader';
import {
  diagnosticApi,
  SKILL_VALIDATION_SESSION_KEY,
  type PastDiagnostic,
} from '@/lib/api/diagnostic';
import { getCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';
import { Mascot } from '@/components/common/Mascot';

interface SkillOption {
  skill_id: string;
  Skill: { id: string; title: string; type: string; } | null;
  validated: boolean | null;
}

interface Props {
  profileId: string;
  skills: SkillOption[];
}

const STARTING_MESSAGES = [
  'Cargando contexto de la skill...',
  'Generando preguntas de validación...',
  'Calibrando dificultad...',
  '¡Todo listo! Iniciando test...',
];

const PASS_SCORE = 9;

function computeCooldowns(diagnostics: PastDiagnostic[]): Record<string, Date> {
  // Agrupa diagnósticos SKILL_VALIDATION completados por skill
  const bySkill: Record<string, PastDiagnostic[]> = {};
  for (const d of diagnostics) {
    if (d.type !== 'SKILL_VALIDATION' || d.status !== 'COMPLETED' || !d.skill_id) continue;
    if (!bySkill[d.skill_id]) bySkill[d.skill_id] = [];
    bySkill[d.skill_id].push(d);
  }

  const cooldowns: Record<string, Date> = {};
  const now = new Date();

  for (const [skillId, diags] of Object.entries(bySkill)) {
    // Ordena descendente por completed_at (la API ya lo devuelve así, pero por seguridad)
    const sorted = [...diags].sort(
      (a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime(),
    );
    const failures = sorted.filter(
      (d) => (d.gap_analysis?.overall_score ?? 10) < PASS_SCORE,
    );
    if (failures.length === 0) continue;

    const lastFailedAt = new Date(failures[0].completed_at!);
    // 1er fallo → 7 días, 2+ fallos → 30 días (igual que backend)
    const cooldownMs =
      failures.length === 1
        ? 7 * 24 * 60 * 60 * 1000
        : 30 * 24 * 60 * 60 * 1000;
    const unlocksAt = new Date(lastFailedAt.getTime() + cooldownMs);

    if (unlocksAt > now) {
      cooldowns[skillId] = unlocksAt;
    }
  }

  return cooldowns;
}

export function SkillValidationIntro({ profileId, skills }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<SkillOption | null>(null);
  const [starting, setStarting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<string, Date>>({});

  // Carga cooldowns al montar
  useEffect(() => {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (!token) return;
    diagnosticApi
      .findByProfile(token, profileId)
      .then(({ diagnostics }) => setCooldowns(computeCooldowns(diagnostics)))
      .catch(() => {/* no crítico, omitir */ });
  }, [profileId]);

  useEffect(() => {
    if (!starting) return;
    setLoadingStep(0);
    const id = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, STARTING_MESSAGES.length - 1));
    }, 3500);
    return () => clearInterval(id);
  }, [starting]);

  const handleStart = async () => {
    if (!selected) return;
    const token = getCookie(AUTH_COOKIE_NAME);
    if (!token) return;
    setStarting(true);
    setError(null);
    try {
      const { id, questions } = await diagnosticApi.createSkillValidation(
        token,
        profileId,
        selected.skill_id,
      );
      sessionStorage.setItem(
        SKILL_VALIDATION_SESSION_KEY,
        JSON.stringify({
          diagnosticId: id,
          questions,
          profileId,
          roleName: '',
          skillId: selected.skill_id,
          skillName: selected.Skill?.title ?? selected.skill_id,
        }),
      );
      router.push('/talent/skill-validation/quiz');
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string; }; }; })
        ?.response?.data?.message;
      setError(msg ?? 'No se pudo iniciar el diagnóstico. Intentá de nuevo.');
      setStarting(false);
    }
  };

  const pending = skills.filter((s) => !s.validated);
  const validated = skills.filter((s) => s.validated === true);

  if (starting) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex flex-col items-center justify-center px-[24px]">
        <Mascot variant="searching" className="w-[80px] h-[80px] mb-[16px] animate-pulse" />
        <h2 className="text-[22px] font-bold text-[#111827] mb-[8px] text-center">
          Preparando tu validación
        </h2>
        <p className="text-[14px] text-[#6b7280] text-center max-w-[380px] mb-[40px]">
          Generando preguntas específicas para{ ' ' }
          <strong>{ selected?.Skill?.title ?? 'la skill seleccionada' }</strong>.
        </p>
        <div className="flex flex-col gap-[14px] w-full max-w-[360px]">
          { STARTING_MESSAGES.map((msg, i) => (
            <div
              key={ msg }
              className={
                'flex items-center gap-[12px] text-[14px] transition-opacity duration-500 ' +
                (i <= loadingStep ? 'opacity-100' : 'opacity-25')
              }
            >
              <span
                className={
                  'shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-bold ' +
                  (i < loadingStep
                    ? 'bg-[#22c55e] text-white'
                    : i === loadingStep
                      ? 'bg-[#4f46e5] text-white'
                      : 'bg-[#e5e7eb] text-[#9ca3af]')
                }
              >
                { i < loadingStep ? '✓' : i + 1 }
              </span>
              <span
                className={
                  i === loadingStep ? 'text-[#111827] font-medium' : 'text-[#6b7280]'
                }
              >
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

      <div className="flex-1 flex flex-col items-center px-[24px] py-[40px]">
        <div className="w-full max-w-[560px]">
          {/* Encabezado */ }
          <div className="text-center mb-[32px]">
            <Mascot variant="ready" className="w-[56px] h-[56px] mb-[12px]" />
            <h1 className="text-[24px] font-bold text-[#111827] mb-[8px]">
              Validar una skill
            </h1>
            <p className="text-[14px] text-[#6b7280] max-w-[420px] mx-auto">
              Elegí una skill y respondé 10 preguntas específicas. Si alcanzás{ ' ' }
              <strong>9/10 puntos</strong>, la skill queda verificada en tu perfil.
            </p>
          </div>

          { skills.length === 0 ? (
            <div className="rounded-[12px] border border-[#e5e7eb] bg-white px-[24px] py-[32px] text-center">
              <p className="text-[15px] font-semibold text-[#111827] mb-[8px]">
                No tenés skills registradas
              </p>
              <p className="text-[13px] text-[#6b7280]">
                Completá el diagnóstico inicial para registrar tus skills.
              </p>
            </div>
          ) : (
            <>
              {/* Skills pendientes */ }
              { pending.length > 0 && (
                <div className="mb-[20px]">
                  <p className="text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide mb-[10px]">
                    Pendientes de validación
                  </p>
                  <div className="flex flex-col gap-[8px]">
                    { pending.map((s) => {
                      const isSelected = selected?.skill_id === s.skill_id;
                      const unlocksAt = cooldowns[s.skill_id];
                      const locked = Boolean(unlocksAt);
                      const daysLeft = locked
                        ? Math.ceil((unlocksAt!.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
                        : 0;
                      return (
                        <button
                          key={ s.skill_id }
                          disabled={ locked }
                          onClick={ () => !locked && setSelected(s) }
                          className={
                            'w-full text-left px-[20px] py-[16px] rounded-[12px] border-[2px] transition-colors flex items-center gap-[14px] ' +
                            (locked
                              ? 'border-[#e5e7eb] bg-[#f9fafb] opacity-60 cursor-not-allowed'
                              : isSelected
                                ? 'border-[#4f46e5] bg-[#eef2ff] cursor-pointer'
                                : 'border-[#e5e7eb] bg-white hover:border-[#c7d2fe] cursor-pointer')
                          }
                        >
                          <span
                            className={
                              'shrink-0 w-[18px] h-[18px] rounded-full border-[2px] flex items-center justify-center ' +
                              (locked ? 'border-[#d1d5db]' : isSelected ? 'border-[#4f46e5]' : 'border-[#9ca3af]')
                            }
                          >
                            { !locked && isSelected && (
                              <span className="w-[8px] h-[8px] rounded-full bg-[#4f46e5]" />
                            ) }
                            { locked && <span className="text-[10px]">🔒</span> }
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-medium text-[#111827] flex items-center gap-[8px]">
                              { s.Skill?.title ?? s.skill_id }
                              { locked && (
                                <span className="text-[11px] bg-[#fef3c7] text-[#92400e] px-[8px] py-[2px] rounded-full font-semibold shrink-0">
                                  { daysLeft }d bloqueado
                                </span>
                              ) }
                            </p>
                            <p className="text-[12px] text-[#9ca3af]">
                              { locked
                                ? `Disponible el ${unlocksAt!.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}`
                                : `${s.Skill?.type ?? ''} · Sin validar` }
                            </p>
                          </div>
                        </button>
                      );
                    }) }
                  </div>
                </div>
              ) }

              {/* Skills ya validadas */ }
              { validated.length > 0 && (
                <div className="mb-[20px]">
                  <p className="text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide mb-[10px]">
                    Ya validadas — podés re-validar
                  </p>
                  <div className="flex flex-col gap-[8px]">
                    { validated.map((s) => {
                      const isSelected = selected?.skill_id === s.skill_id;
                      const unlocksAt = cooldowns[s.skill_id];
                      const locked = Boolean(unlocksAt);
                      const daysLeft = locked
                        ? Math.ceil((unlocksAt!.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
                        : 0;
                      return (
                        <button
                          key={ s.skill_id }
                          disabled={ locked }
                          onClick={ () => !locked && setSelected(s) }
                          className={
                            'w-full text-left px-[20px] py-[16px] rounded-[12px] border-[2px] transition-colors flex items-center gap-[14px] ' +
                            (locked
                              ? 'border-[#e5e7eb] bg-[#f9fafb] opacity-60 cursor-not-allowed'
                              : isSelected
                                ? 'border-[#4f46e5] bg-[#eef2ff] cursor-pointer'
                                : 'border-[#e5e7eb] bg-white hover:border-[#c7d2fe] cursor-pointer')
                          }
                        >
                          <span
                            className={
                              'shrink-0 w-[18px] h-[18px] rounded-full border-[2px] flex items-center justify-center ' +
                              (locked ? 'border-[#d1d5db]' : isSelected ? 'border-[#4f46e5]' : 'border-[#9ca3af]')
                            }
                          >
                            { !locked && isSelected && (
                              <span className="w-[8px] h-[8px] rounded-full bg-[#4f46e5]" />
                            ) }
                            { locked && <span className="text-[10px]">🔒</span> }
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-medium text-[#111827] flex items-center gap-[8px]">
                              { s.Skill?.title ?? s.skill_id }
                              { locked ? (
                                <span className="text-[11px] bg-[#fef3c7] text-[#92400e] px-[8px] py-[2px] rounded-full font-semibold shrink-0">
                                  { daysLeft }d bloqueado
                                </span>
                              ) : (
                                <span className="text-[11px] bg-[#dcfce7] text-[#16a34a] px-[8px] py-[2px] rounded-full font-semibold shrink-0">
                                  Validada
                                </span>
                              ) }
                            </p>
                            <p className="text-[12px] text-[#9ca3af]">
                              { locked
                                ? `Disponible el ${unlocksAt!.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}`
                                : `${s.Skill?.type ?? ''} · Re-validar renueva el badge` }
                            </p>
                          </div>
                        </button>
                      );
                    }) }
                  </div>
                </div>
              ) }

              {/* Advertencia re-validación */ }
              { selected?.validated && (
                <div className="mb-[16px] rounded-[8px] bg-[#fefce8] border border-[#fde047] px-[16px] py-[10px] text-[13px] text-[#854d0e]">
                  Atención: si no alcanzás 9/10 puntos, se pierde la validación actual de esta skill.
                </div>
              ) }

              { error && (
                <div className="mb-[16px] rounded-[8px] bg-[#fef2f2] border border-[#fecaca] px-[16px] py-[10px] text-[14px] text-[#dc2626]">
                  { error }
                </div>
              ) }

              <button
                onClick={ handleStart }
                disabled={ !selected || starting || Boolean(selected && cooldowns[selected.skill_id]) }
                className="w-full py-[14px] rounded-[10px] bg-[#4f46e5] text-white text-[15px] font-semibold hover:bg-[#4338ca] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                { selected
                  ? `Iniciar validación de "${selected.Skill?.title ?? 'skill'}"`
                  : 'Seleccioná una skill para continuar' }
              </button>
            </>
          ) }
        </div>
      </div>
    </div>
  );
}
