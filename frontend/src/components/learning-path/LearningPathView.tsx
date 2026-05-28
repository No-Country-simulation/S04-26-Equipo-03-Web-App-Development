'use client';

import { useState, useCallback } from 'react';
import { type LearningPathDetail, type PathCategory } from '@/lib/api/learning-path';
import { learningPathApi } from '@/lib/api/learning-path';
import { getCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';
import { CategoryTabs } from './CategoryTabs';
import { ModuleCard } from './ModuleCard';
import { CategoryLibraryAside } from './CategoryLibraryAside';


interface LearningPathViewProps {
  initialPath: LearningPathDetail;
}

export function LearningPathView({ initialPath }: LearningPathViewProps) {
  const [path, setPath] = useState(initialPath);
  const [asideCategory, setAsideCategory] = useState<'SOFT' | 'EMPLOYABILITY' | null>(null);

  // Categoría principal: TECH si hay módulos técnicos, si no SOFT, si no EMPLOYABILITY
  const hasTech = path.modules.some((m) => m.category === 'TECH');
  const hasSoft = path.modules.some((m) => m.category === 'SOFT');
  const hasEmployability = path.modules.some((m) => m.category === 'EMPLOYABILITY');
  const primaryCategory: PathCategory = hasTech ? 'TECH' : hasSoft ? 'SOFT' : 'EMPLOYABILITY';
  const visibleCategories = (['TECH', 'SOFT', 'EMPLOYABILITY'] as PathCategory[]).filter(
    (cat) => path.modules.some((m) => m.category === cat),
  );

  const primaryModules = path.modules.filter((m) => m.category === primaryCategory);

  const firstIncompleteIdx = primaryModules.findIndex(
    (m) => m.progress.completed < m.progress.total,
  );

  const handleTabChange = (cat: PathCategory) => {
    if (cat === primaryCategory) {
      setAsideCategory(null);
    } else {
      setAsideCategory(cat as 'SOFT' | 'EMPLOYABILITY');
    }
  };

  const handleToggleStep = useCallback(
    async (stepId: string, completed: boolean) => {
      const token = getCookie(AUTH_COOKIE_NAME);
      if (!token) return;
      try {
        if (completed) {
          await learningPathApi.completeStep(token, path.id, stepId);
        } else {
          await learningPathApi.uncompleteStep(token, path.id, stepId);
        }
        const updated = await learningPathApi.findById(token, path.id);
        setPath(updated);
      } catch {
        // error silencioso — el usuario puede reintentar
      }
    },
    [path.id],
  );

  const completedModules = path.modules.filter(
    (m) => m.progress.total > 0 && m.progress.completed === m.progress.total,
  ).length;

  const activeTabValue: PathCategory = asideCategory ?? primaryCategory;

  return (
    <>
      <div className="w-full max-w-[680px] mx-auto px-[24px] py-[32px]">
        {/* Título + progreso global */ }
        <div className="flex items-start justify-between gap-[16px] mb-[8px]">
          <h1 className="text-[22px] font-bold text-[#111827] leading-[30px]">
            { path.role_name
              ? `Tu ruta hacia ${path.role_name}`
              : 'Tu ruta de aprendizaje' }
          </h1>
          <span className="shrink-0 text-[13px] text-[#6b7280] mt-[4px]">
            { path.progress.percentage }% completado
          </span>
        </div>

        {/* Subtítulo con hitos */ }
        <p className="text-[13px] text-[#6b7280] mb-[6px]">
          { completedModules } hitos completados · { path.modules.length } totales
        </p>

        {/* Barra de progreso global */ }
        <div className="h-[6px] bg-[#e5e7eb] rounded-full overflow-hidden mb-[24px]">
          <div
            className="h-full bg-[#4f46e5] rounded-full transition-all duration-500"
            style={ { width: `${path.progress.percentage}%` } }
          />
        </div>

        {/* Tabs de categoría */ }
        <div className="mb-[20px]">
          <CategoryTabs
            active={ activeTabValue }
            onChange={ handleTabChange }
            visibleCategories={ visibleCategories }
            note={
              hasTech
                ? 'Blandas y empleabilidad son bibliotecas libres — toca para abrir.'
                : hasSoft && hasEmployability
                  ? 'Empleabilidad es una biblioteca libre — toca para abrir.'
                  : undefined
            }
          />
        </div>

        {/* Lista de módulos principales */ }
        { primaryModules.length === 0 ? (
          <p className="text-[14px] text-[#9ca3af] py-[32px] text-center">
            No hay módulos todavía.
          </p>
        ) : (
          <div className="flex flex-col gap-[12px]">
            { primaryModules.map((mod, idx) => (
              <ModuleCard
                key={ mod.id }
                module={ mod }
                index={ idx }
                isActive={ idx === firstIncompleteIdx }
                isLocked={ firstIncompleteIdx !== -1 && idx > firstIncompleteIdx }
                onToggleStep={ handleToggleStep }
              />
            )) }
          </div>
        ) }

        {/* Banner "Próximamente" */ }
        <div className="mt-[32px] bg-[#1a1a2e] rounded-[12px] px-[24px] py-[20px]">
          <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-widest mb-[6px]">
            Próximamente
          </p>
          <h3 className="text-[16px] font-semibold text-white mb-[6px]">
            Practicá entrevistas con IA
          </h3>
          <p className="text-[13px] text-[#9ca3af] mb-[16px] leading-[20px]">
            Vas a poder simular entrevistas técnicas y de comportamiento con
            feedback en tiempo real. Te avisamos cuando esté disponible.
          </p>
          <button
            disabled
            className="text-[13px] font-medium text-[#1a1a2e] bg-white px-[14px] py-[7px] rounded-[8px] opacity-80 cursor-not-allowed"
          >
            Avisarme cuando esté listo
          </button>
        </div>
      </div>

      {/* Aside de biblioteca (Blandas / Empleabilidad) */ }
      { asideCategory && (
        <CategoryLibraryAside
          category={ asideCategory }
          modules={ path.modules.filter((m) => m.category === asideCategory) }
          onClose={ () => setAsideCategory(null) }
          onToggleStep={ handleToggleStep }
        />
      ) }
    </>
  );
}
