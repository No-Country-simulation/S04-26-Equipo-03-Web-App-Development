'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TalentAppHeader } from '@/components/layout/TalentAppHeader';
import {
  DIAGNOSTIC_RESULT_KEY,
  type DiagnosticResultStore,
  type GapAnalysis,
} from '@/lib/api/diagnostic';

function scoreToLevel(score: number): string {
  if (score < 3) return 'Principiante';
  if (score < 5) return 'Junior';
  if (score < 7) return 'Semi-Senior';
  if (score < 9) return 'Senior';
  return 'Experto';
}

export function DiagnosticResults() {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosticResultStore | null>(null);
  const [expanded, setExpanded] = useState<string | null>('bien');

  useEffect(() => {
    const raw = sessionStorage.getItem(DIAGNOSTIC_RESULT_KEY);
    if (!raw) {
      router.replace('/talent/diagnostic');
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

  const { gapAnalysis, roleName } = result;
  const level = scoreToLevel(gapAnalysis.overall_score);

  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col">
      <TalentAppHeader activeTab="diagnostic" />

      <div className="flex-1 flex flex-col items-center px-[24px] py-[40px]">
        {/* Mascot */ }
        <div className="text-[72px] mb-[8px] select-none">🥳</div>

        <h1 className="text-[24px] font-bold text-[#111827] mb-[6px] text-center">
          Diagnóstico completado
        </h1>
        <p className="text-[14px] text-[#6b7280] text-center max-w-[440px] mb-[28px]">
          ¡Lo hiciste! Esto es lo que encontramos en tu perfil.
        </p>

        {/* Level banner */ }
        <div className="w-full max-w-[560px] rounded-[12px] bg-[#111827] px-[24px] py-[24px] mb-[24px] text-center">
          <p className="text-[11px] text-[#9ca3af] uppercase tracking-[0.08em] mb-[8px]">
            Tu perfil corresponde a
          </p>
          <p className="text-[24px] font-bold text-[#6366f1]">
            { level } · { roleName || 'Profesional' }
          </p>
        </div>

        {/* Skills evaluadas */ }
        { gapAnalysis.skill_scores.length > 0 && (
          <div className="w-full max-w-[560px] rounded-[12px] border border-[#e5e7eb] bg-white px-[24px] py-[20px] mb-[20px]">
            <h2 className="text-[15px] font-semibold text-[#111827] mb-[16px]">
              Skills evaluadas en este diagnóstico
            </h2>
            <div className="flex flex-col gap-[14px]">
              { gapAnalysis.skill_scores.map((s) => (
                <div key={ s.skill } className="flex flex-col gap-[6px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-[#374151]">{ s.skill }</span>
                    <span className="text-[13px] font-semibold text-[#374151]">
                      { s.score.toFixed(1) } / 10
                    </span>
                  </div>
                  <div className="w-full h-[8px] rounded-full bg-[#e5e7eb]">
                    <div
                      className="h-[8px] rounded-full bg-[#22c55e] transition-all duration-500"
                      style={ { width: `${(s.score / 10) * 100}%` } }
                    />
                  </div>
                </div>
              )) }
            </div>
          </div>
        ) }

        {/* Análisis detallado */ }
        <div className="w-full max-w-[560px] mb-[32px]">
          <h2 className="text-[16px] font-semibold text-[#111827] mb-[12px]">
            Análisis detallado
          </h2>
          <AnalysisSections
            gapAnalysis={ gapAnalysis }
            expanded={ expanded }
            onToggle={ (id) => setExpanded((p) => (p === id ? null : id)) }
          />
        </div>

        {/* Actions */ }
        <div className="flex gap-[12px] flex-wrap justify-center">
          <Link
            href="/talent/learning-path"
            className="px-[24px] py-[11px] rounded-[8px] bg-[#4f46e5] text-white text-[14px] font-semibold hover:bg-[#4338ca] transition-colors"
          >
            Ver mi ruta de aprendizaje
          </Link>
          <Link
            href="/talent/profile"
            className="px-[24px] py-[11px] rounded-[8px] border border-[#d1d5db] text-[14px] font-medium text-[#374151] hover:bg-[#f9fafb] transition-colors"
          >
            Ver mi perfil actualizado
          </Link>
        </div>
      </div>
    </div>
  );
}

function AnalysisSections({
  gapAnalysis,
  expanded,
  onToggle,
}: {
  gapAnalysis: GapAnalysis;
  expanded: string | null;
  onToggle: (id: string) => void;
}) {
  const sections = [
    { id: 'bien', emoji: '🟢', title: 'Lo que salió bien', items: gapAnalysis.strengths },
    { id: 'trabajar', emoji: '🟡', title: 'Lo que vale trabajar', items: gapAnalysis.gaps },
    {
      id: 'seguir',
      emoji: '🔵',
      title: 'Por dónde seguir',
      items: [gapAnalysis.recommendation],
    },
  ];

  return (
    <div className="flex flex-col gap-[8px]">
      { sections.map((s) => (
        <div
          key={ s.id }
          className="rounded-[10px] border border-[#e5e7eb] bg-white overflow-hidden"
        >
          <button
            onClick={ () => onToggle(s.id) }
            className="w-full flex items-center justify-between px-[20px] py-[14px] text-left cursor-pointer hover:bg-[#f9fafb] transition-colors"
          >
            <span className="flex items-center gap-[10px] text-[14px] font-medium text-[#374151]">
              <span>{ s.emoji }</span>
              { s.title }
            </span>
            <span className="text-[#9ca3af] text-[11px]">
              { expanded === s.id ? '▲' : '▼' }
            </span>
          </button>

          { expanded === s.id && s.items.length > 0 && (
            <div className="px-[20px] pb-[16px]">
              { s.items.length === 1 ? (
                <p className="text-[13px] text-[#6b7280] leading-[1.6]">{ s.items[0] }</p>
              ) : (
                <ul className="flex flex-col gap-[6px]">
                  { s.items.map((item, i) => (
                    <li key={ i } className="flex items-start gap-[8px] text-[13px] text-[#6b7280]">
                      <span className="mt-[3px] shrink-0 text-[#9ca3af]">•</span>
                      { item }
                    </li>
                  )) }
                </ul>
              ) }
            </div>
          ) }
        </div>
      )) }
    </div>
  );
}


