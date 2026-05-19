'use client';

import { CheckCircle2, PlayCircle, BookOpen, Dumbbell, HelpCircle, ExternalLink } from 'lucide-react';
import { type PathStepRecord, type StepType } from '@/lib/api/learning-path';

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

interface ResourceItemProps {
  step: PathStepRecord;
  onToggle?: (stepId: string, completed: boolean) => void;
}

export function ResourceItem({ step, onToggle }: ResourceItemProps) {
  const type = step.type ?? 'ARTICLE';
  const label = TYPE_LABELS[type];
  const icon = TYPE_ICONS[type];
  const isCompleted = step.is_completed ?? false;

  return (
    <div
      className={ [
        'flex items-center justify-between px-[16px] py-[12px] gap-[12px]',
        'border-b border-[#f3f4f6] last:border-0',
      ].join(' ') }
    >
      <div className="flex items-center gap-[10px] flex-1 min-w-0">
        {/* Checkbox / completado */ }
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

        <div className="flex flex-col min-w-0">
          <span
            className={ [
              'text-[13px] font-medium leading-[18px] truncate',
              isCompleted ? 'line-through text-[#9ca3af]' : 'text-[#111827]',
            ].join(' ') }
          >
            { step.title ?? 'Sin título' }
          </span>
          <span className="flex items-center gap-[4px] text-[11px] text-[#6b7280] mt-[2px]">
            { icon }
            { label }
            { step.estimated_minutes != null && (
              <> · { step.estimated_minutes } min</>
            ) }
          </span>
        </div>
      </div>

      {/* Botón "Ver contenido" si tiene URL */ }
      { step.resource_url && (
        <a
          href={ step.resource_url }
          target="_blank"
          rel="noopener noreferrer"
          onClick={ () => !isCompleted && onToggle?.(step.id, true) }
          className="shrink-0 flex items-center gap-[4px] bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[12px] font-medium px-[10px] py-[6px] rounded-[6px] transition-colors"
        >
          Ver contenido
          <ExternalLink className="w-[11px] h-[11px]" />
        </a>
      ) }
    </div>
  );
}
