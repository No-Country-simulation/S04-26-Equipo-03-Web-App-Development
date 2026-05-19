'use client';

import { X, CheckCircle2, PlayCircle, BookOpen, Dumbbell, HelpCircle, ExternalLink } from 'lucide-react';
import { type PathCategory, type PathModuleRecord, type PathStepRecord, type StepType } from '@/lib/api/learning-path';

const CATEGORY_LABELS: Record<Exclude<PathCategory, 'TECH'>, string> = {
  SOFT: 'Habilidades Blandas',
  EMPLOYABILITY: 'Empleabilidad',
};

const TYPE_LABELS: Record<StepType, string> = {
  VIDEO: 'Video',
  ARTICLE: 'Lectura',
  EXERCISE: 'Ejercicio',
  QUIZ: 'Quiz',
};

const TYPE_ICONS: Record<StepType, React.ReactNode> = {
  VIDEO: <PlayCircle className="w-[14px] h-[14px]" />,
  ARTICLE: <BookOpen className="w-[14px] h-[14px]" />,
  EXERCISE: <Dumbbell className="w-[14px] h-[14px]" />,
  QUIZ: <HelpCircle className="w-[14px] h-[14px]" />,
};

interface StepRowProps {
  step: PathStepRecord;
  onToggle?: (stepId: string, completed: boolean) => void;
}

function StepRow({ step, onToggle }: StepRowProps) {
  const type = step.type ?? 'ARTICLE';
  const isCompleted = step.is_completed ?? false;
  const mins = step.estimated_minutes;

  return (
    <div className="flex items-center justify-between px-[20px] py-[12px] gap-[12px] border-b border-[#f3f4f6] last:border-0">
      <div className="flex items-center gap-[10px] flex-1 min-w-0">
        <button
          onClick={ () => onToggle?.(step.id, !isCompleted) }
          className="shrink-0"
          aria-label={ isCompleted ? 'Marcar como no completado' : 'Marcar como completado' }
        >
          { isCompleted ? (
            <CheckCircle2 className="w-[20px] h-[20px] text-[#10b981]" />
          ) : (
            <div className="w-[20px] h-[20px] rounded-full border-2 border-[#d1d5db]" />
          ) }
        </button>

        <div className="flex-1 min-w-0">
          <p className={ [
            'text-[14px] font-medium leading-[20px] truncate',
            isCompleted ? 'text-[#9ca3af] line-through' : 'text-[#111827]',
          ].join(' ') }>
            { step.title }
          </p>
          <div className="flex items-center gap-[4px] text-[12px] text-[#9ca3af] mt-[2px]">
            { TYPE_ICONS[type] }
            <span>{ TYPE_LABELS[type] }</span>
            { mins && <span>· { mins >= 60 ? `~${Math.round(mins / 60)} h` : `${mins} min` }</span> }
          </div>
        </div>
      </div>

      { step.resource_url && (
        <a
          href={ step.resource_url }
          target="_blank"
          rel="noopener noreferrer"
          onClick={ () => !isCompleted && onToggle?.(step.id, true) }
          className="shrink-0 flex items-center gap-[4px] text-[12px] text-[#4f46e5] font-medium hover:underline"
        >
          Ver contenido
          <ExternalLink className="w-[11px] h-[11px]" />
        </a>
      ) }
    </div>
  );
}

interface CategoryLibraryAsideProps {
  category: Exclude<PathCategory, 'TECH'>;
  modules: PathModuleRecord[];
  onClose: () => void;
  onToggleStep?: (stepId: string, completed: boolean) => void;
}

export function CategoryLibraryAside({
  category,
  modules,
  onClose,
  onToggleStep,
}: CategoryLibraryAsideProps) {
  const categoryLabel = CATEGORY_LABELS[category];

  return (
    <>
      {/* Backdrop */ }
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={ onClose }
        aria-hidden="true"
      />

      {/* Panel */ }
      <aside className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-50 shadow-xl flex flex-col overflow-hidden">
        {/* Header */ }
        <div className="flex items-start justify-between px-[20px] pt-[20px] pb-[16px] border-b border-[#f3f4f6]">
          <div>
            <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-widest mb-[4px]">
              Biblioteca · { categoryLabel }
            </p>
            <h2 className="text-[20px] font-bold text-[#111827] leading-[28px]">
              { modules.length === 1 && modules[0].title
                ? modules[0].title
                : categoryLabel }
            </h2>
            <p className="text-[13px] text-[#6b7280] mt-[4px]">
              Sin orden forzado. Sin dependencias. Hacelos cuando los necesites.
            </p>
          </div>
          <button
            onClick={ onClose }
            className="shrink-0 ml-[12px] mt-[2px] text-[#9ca3af] hover:text-[#374151] transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-[20px] h-[20px]" />
          </button>
        </div>

        {/* Steps */ }
        <div className="flex-1 overflow-y-auto">
          { modules.map((mod) => (
            <div key={ mod.id }>
              { modules.length > 1 && (
                <p className="px-[20px] pt-[14px] pb-[6px] text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">
                  { mod.title }
                </p>
              ) }
              { mod.steps.map((step) => (
                <StepRow key={ step.id } step={ step } onToggle={ onToggleStep } />
              )) }
            </div>
          )) }
          { modules.length === 0 && (
            <p className="text-[14px] text-[#9ca3af] text-center py-[40px] px-[20px]">
              No hay recursos en esta categoría todavía.
            </p>
          ) }
        </div>

        {/* Footer */ }
        <div className="px-[20px] py-[14px] border-t border-[#f3f4f6]">
          <p className="text-[12px] text-[#9ca3af]">
            Estos recursos son complementarios. No bloquean tu progreso técnico.
          </p>
        </div>
      </aside>
    </>
  );
}
