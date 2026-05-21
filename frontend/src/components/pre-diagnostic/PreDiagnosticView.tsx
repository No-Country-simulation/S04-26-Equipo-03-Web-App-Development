'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TalentAppHeader } from '@/components/layout/TalentAppHeader';
import {
  type SkillSuggestion,
  type SelfRatingLabel,
  type SkillRatingEntry,
  preDiagnosticApi,
} from '@/lib/api/pre-diagnostic';
import { getCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';

const RATING_OPTIONS: { label: string; value: SelfRatingLabel; }[] = [
  { label: 'No lo conozco', value: 'no_lo_conozco' },
  { label: 'Lo uso', value: 'lo_uso' },
  { label: 'Lo domino', value: 'lo_domino' },
];

interface Props {
  profileId: string;
}

export function PreDiagnosticView({ profileId }: Props) {
  const router = useRouter();

  const [suggestions, setSuggestions] = useState<SkillSuggestion[]>([]);
  const [ratings, setRatings] = useState<Record<string, SelfRatingLabel>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (!token) {
      router.replace('/talent/login');
      return;
    }
    preDiagnosticApi
      .getSuggestions(token, profileId)
      .then(({ suggestions: s }) => setSuggestions(s))
      .catch(() => setError('No se pudieron cargar las sugerencias. Intentá de nuevo.'))
      .finally(() => setLoading(false));
  }, [profileId, router]);

  const handleRating = useCallback((skillId: string, value: SelfRatingLabel) => {
    setRatings((prev) => ({ ...prev, [skillId]: value }));
  }, []);

  const handleContinue = async () => {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (!token) return;

    const ratingsToSave: SkillRatingEntry[] = suggestions
      .filter((s) => ratings[s.id])
      .map((s) => ({ skill_id: s.id, self_rating: ratings[s.id] }));

    if (ratingsToSave.length === 0) {
      setError('Calificá al menos una habilidad antes de continuar.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await preDiagnosticApi.saveRatings(token, profileId, ratingsToSave);
      router.push('/talent/diagnostic');
    } catch {
      setError('Ocurrió un error al guardar. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <TalentAppHeader activeTab="diagnostic" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-[16px] w-[44px] h-[44px] rounded-full border-[3px] border-[#e5e7eb] border-t-[#4f46e5] animate-spin" />
            <p className="text-[14px] text-[#6b7280]">La IA está analizando tu perfil…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TalentAppHeader activeTab="diagnostic" />

      {/* Content */ }
      <div className="flex-1 max-w-[860px] mx-auto w-full px-[24px] py-[40px]">
        {/* Title */ }
        <div className="flex items-start gap-[16px] mb-[32px]">
          <div className="shrink-0 w-[48px] h-[48px] rounded-full bg-[#4f46e5] flex items-center justify-center text-[22px]">
            🙂
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-[#111827] mb-[6px]">
              ¿Cómo te sentís con estas habilidades?
            </h1>
            <p className="text-[14px] text-[#6b7280] max-w-[540px]">
              Esto no es el diagnóstico. Solo quiero entender tu punto de
              partida para personalizar tus resultados.
            </p>
          </div>
        </div>

        {/* Error */ }
        { error && (
          <div className="mb-[20px] rounded-[8px] bg-[#fef2f2] border border-[#fecaca] px-[16px] py-[10px] text-[14px] text-[#dc2626]">
            { error }
          </div>
        ) }

        {/* Sin sugerencias */ }
        { suggestions.length === 0 && !error && (
          <div className="rounded-[12px] border border-[#e5e7eb] px-[24px] py-[32px] text-center text-[14px] text-[#6b7280]">
            Ya tenés una gran base de habilidades. Podés continuar al diagnóstico.
          </div>
        ) }

        {/* Skills card */ }
        { suggestions.length > 0 && (
          <div className="mb-[24px] rounded-[12px] border border-[#e5e7eb] overflow-hidden">
            <div className={ 'px-[24px] py-[14px] border-b border-[#e5e7eb]' }>
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b7280]">
                Sugerencias de habilidades para tu rol objetivo
              </span>
            </div>
            { suggestions.map((skill, i) => (
              <div
                key={ skill.id }
                className={
                  'px-[24px] py-[18px] flex flex-col gap-[12px]' +
                  (i > 0 ? ' border-t border-[#f3f4f6]' : '')
                }
              >
                <span className="flex-1 text-[15px] font-medium text-[#111827]">
                  { skill.title }
                </span>
                <div className="flex gap-[8px] flex-wrap">
                  { RATING_OPTIONS.map((opt) => {
                    const selected = ratings[skill.id] === opt.value;
                    return (
                      <button
                        key={ opt.value }
                        onClick={ () => handleRating(skill.id, opt.value) }
                        className={
                          'rounded-full px-[16px] py-[7px] text-[13px] font-medium border transition-colors cursor-pointer ' +
                          (selected
                            ? 'bg-[#4f46e5] border-[#4f46e5] text-white'
                            : 'bg-white border-[#d1d5db] text-[#374151] hover:border-[#4f46e5] hover:text-[#4f46e5]')
                        }
                      >
                        { opt.label }
                      </button>
                    );
                  }) }
                </div>
              </div>
            )) }
          </div>
        ) }

        {/* Footer nav */ }
        <div className="flex items-center justify-end mt-[8px]">
          { suggestions.length > 0 ? (
            <button
              onClick={ handleContinue }
              disabled={ submitting }
              className="flex items-center gap-[8px] px-[28px] py-[10px] rounded-[8px] bg-[#4f46e5] text-white text-[14px] font-semibold hover:bg-[#4338ca] transition-colors cursor-pointer disabled:opacity-60"
            >
              { submitting && (
                <span className="w-[14px] h-[14px] rounded-full border-[2px] border-white border-t-transparent animate-spin" />
              ) }
              Continuar →
            </button>
          ) : (
            <button
              onClick={ () => router.push('/talent/diagnostic') }
              className="px-[28px] py-[10px] rounded-[8px] bg-[#4f46e5] text-white text-[14px] font-semibold hover:bg-[#4338ca] transition-colors cursor-pointer"
            >
              Continuar →
            </button>
          ) }
        </div>
      </div>
    </div>
  );
}


