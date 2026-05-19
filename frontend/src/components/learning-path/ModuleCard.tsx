'use client';

import { useState } from 'react';
import { CheckCircle2, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { type PathModuleRecord } from '@/lib/api/learning-path';
import { ResourceItem } from './ResourceItem';

interface ModuleCardProps {
  module: PathModuleRecord;
  index: number;
  isActive: boolean;
  isLocked: boolean;
  onToggleStep?: (stepId: string, completed: boolean) => void;
}

export function ModuleCard({
  module,
  index,
  isActive,
  isLocked,
  onToggleStep,
}: ModuleCardProps) {
  const [expanded, setExpanded] = useState(isActive);
  const isCompleted = module.progress.total > 0 &&
    module.progress.completed === module.progress.total;

  const statusBadge = isLocked ? null : isCompleted ? (
    <span className="text-[12px] font-medium text-[#10b981] bg-[#ecfdf5] border border-[#6ee7b7] px-[8px] py-[3px] rounded-full">
      Completado
    </span>
  ) : isActive ? (
    <span className="text-[12px] font-medium text-[#4f46e5] bg-[#eef2ff] border border-[#c7d2fe] px-[8px] py-[3px] rounded-full">
      En curso
    </span>
  ) : null;

  const subtitle = isLocked
    ? module.steps.length > 0
      ? `${module.steps.length} recursos · bloqueado`
      : 'bloqueado'
    : isCompleted
      ? `${module.progress.total} de ${module.progress.total} recursos · completado`
      : isActive
        ? `${module.progress.completed} de ${module.progress.total} recursos`
        : `${module.steps.length} recursos`;

  return (
    <div
      className={ [
        'rounded-[12px] border transition-colors',
        isActive
          ? 'border-[#4f46e5] shadow-[0_0_0_3px_rgba(79,70,229,0.08)]'
          : 'border-[#e5e7eb]',
        isLocked ? 'opacity-60' : '',
      ].join(' ') }
    >
      {/* Header del módulo */ }
      <button
        className="w-full flex items-center gap-[12px] px-[16px] py-[14px] text-left"
        onClick={ () => !isLocked && setExpanded((v) => !v) }
        disabled={ isLocked }
      >
        {/* Número / icono */ }
        <div
          className={ [
            'shrink-0 w-[28px] h-[28px] rounded-full flex items-center justify-center text-[13px] font-semibold',
            isLocked
              ? 'bg-[#f3f4f6] text-[#9ca3af]'
              : isCompleted
                ? 'bg-[#10b981] text-white'
                : isActive
                  ? 'bg-[#4f46e5] text-white'
                  : 'bg-[#f3f4f6] text-[#374151]',
          ].join(' ') }
        >
          { isLocked ? (
            <Lock className="w-[13px] h-[13px]" />
          ) : isCompleted ? (
            <CheckCircle2 className="w-[14px] h-[14px]" />
          ) : (
            index + 1
          ) }
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#111827] leading-[20px]">
            { module.title ?? `Módulo ${index + 1}` }
          </p>
          <p className="text-[12px] text-[#6b7280] mt-[1px]">{ subtitle }</p>
        </div>

        <div className="flex items-center gap-[8px]">
          { statusBadge }
          { !isLocked && (
            expanded
              ? <ChevronUp className="w-[16px] h-[16px] text-[#9ca3af]" />
              : <ChevronDown className="w-[16px] h-[16px] text-[#9ca3af]" />
          ) }
        </div>
      </button>

      {/* Barra de progreso (si está en curso) */ }
      { isActive && !isLocked && (
        <div className="px-[16px] pb-[4px]">
          <div className="h-[4px] bg-[#e5e7eb] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4f46e5] rounded-full transition-all"
              style={ { width: `${module.progress.percentage}%` } }
            />
          </div>
        </div>
      ) }

      {/* Recursos expandidos */ }
      { expanded && !isLocked && module.steps.length > 0 && (
        <div className="border-t border-[#f3f4f6]">
          { module.steps.map((step) => (
            <ResourceItem
              key={ step.id }
              step={ step }
              onToggle={ onToggleStep }
            />
          )) }
        </div>
      ) }
    </div>
  );
}
