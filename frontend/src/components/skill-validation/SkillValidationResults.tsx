'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TalentAppHeader } from '@/components/layout/TalentAppHeader';
import { Mascot } from '@/components/common/Mascot';
import {
  SKILL_VALIDATION_RESULT_KEY,
  type DiagnosticResultStore,
} from '@/lib/api/diagnostic';

const PASS_SCORE = 9;

export function SkillValidationResults() {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosticResultStore | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(SKILL_VALIDATION_RESULT_KEY);
    if (!raw) {
      router.replace('/talent/skill-validation');
      return;
    }
    setResult(JSON.parse(raw) as DiagnosticResultStore);
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-[40px] h-[40px] rounded-full border-[3px] border-[#e5e7eb] border-t-[#4f46e5] animate-spin" />
      </div>
    );
  }

  const { gapAnalysis, skillName } = result;
  const score = gapAnalysis.skill_scores[0]?.score ?? gapAnalysis.overall_score;
  const passed = score >= PASS_SCORE;
  const displayName = skillName ?? gapAnalysis.skill_scores[0]?.skill ?? 'Skill';
  const feedback = gapAnalysis.skill_scores[0]?.feedback;

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      <TalentAppHeader activeTab="diagnostic" />

      <div className="flex-1 flex flex-col items-center px-[24px] py-[40px]">
        <div className="w-full max-w-[560px] text-center">
          {/* Mascota */ }
          { passed
            ? <Mascot variant="happy" className="w-[80px] h-[80px] mb-[8px] mx-auto" />
            : <Mascot variant="backpack" className="w-[80px] h-[80px] mb-[8px] mx-auto" /> }

          <h1 className="text-[24px] font-bold text-[#111827] mb-[6px]">
            { passed ? 'Skill validada' : 'Diagnóstico completado' }
          </h1>
          <p className="text-[14px] text-[#6b7280] max-w-[440px] mx-auto mb-[28px]">
            { passed
              ? 'Tu badge verde ya está activo en el perfil. Los reclutadores pueden ver esta verificación.'
              : 'No alcanzaste el puntaje mínimo esta vez. Seguí practicando y volvé a intentarlo.' }
          </p>

          {/* Score card */ }
          <div
            className={
              'w-full rounded-[12px] px-[24px] py-[24px] mb-[24px] ' +
              (passed ? 'bg-[#111827]' : 'bg-white border border-[#e5e7eb]')
            }
          >
            <p
              className={
                'text-[11px] uppercase tracking-[0.08em] mb-[8px] ' +
                (passed ? 'text-[#9ca3af]' : 'text-[#6b7280]')
              }
            >
              { displayName }
            </p>
            <p
              className={
                'text-[40px] font-bold mb-[4px] ' +
                (passed ? 'text-[#22c55e]' : 'text-[#111827]')
              }
            >
              { score.toFixed(1) }
              <span className="text-[22px]">/10</span>
            </p>
            <p
              className={
                'text-[13px] font-semibold ' +
                (passed ? 'text-[#22c55e]' : 'text-[#dc2626]')
              }
            >
              { passed ? '✓ Aprobado — mínimo 9/10' : '✗ No aprobado — mínimo 9/10' }
            </p>
          </div>

          {/* Barra de progreso visual */ }
          <div className="w-full rounded-[12px] border border-[#e5e7eb] bg-white px-[24px] py-[20px] mb-[24px]">
            <div className="flex items-center justify-between mb-[8px]">
              <span className="text-[13px] text-[#374151]">Puntaje obtenido</span>
              <span className="text-[13px] font-semibold text-[#374151]">
                { score.toFixed(1) } / 10
              </span>
            </div>
            <div className="w-full h-[10px] rounded-full bg-[#e5e7eb]">
              <div
                className={
                  'h-[10px] rounded-full transition-all duration-700 ' +
                  (passed ? 'bg-[#22c55e]' : 'bg-[#f59e0b]')
                }
                style={ { width: `${(score / 10) * 100}%` } }
              />
            </div>
            <div className="flex justify-between mt-[6px]">
              <span className="text-[11px] text-[#9ca3af]">0</span>
              <span className="text-[11px] text-[#9ca3af]">Mínimo: 9</span>
              <span className="text-[11px] text-[#9ca3af]">10</span>
            </div>
          </div>

          {/* Feedback */ }
          { feedback && (
            <div className="w-full rounded-[12px] border border-[#e5e7eb] bg-white px-[24px] py-[20px] mb-[24px] text-left">
              <h2 className="text-[14px] font-semibold text-[#111827] mb-[8px]">
                Retroalimentación
              </h2>
              <p className="text-[13px] text-[#6b7280] leading-[1.6]">{ feedback }</p>
            </div>
          ) }

          {/* Acciones */ }
          <div className="flex flex-col gap-[12px]">
            <Link
              href="/talent/profile"
              className="block w-full py-[12px] rounded-[8px] bg-[#4f46e5] text-white text-[14px] font-semibold hover:bg-[#4338ca] transition-colors"
            >
              Ver mi perfil
            </Link>
            <Link
              href="/talent/skill-validation"
              className="block w-full py-[12px] rounded-[8px] border border-[#d1d5db] text-[14px] font-medium text-[#374151] hover:bg-[#f9fafb] transition-colors"
            >
              Validar otra skill
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
