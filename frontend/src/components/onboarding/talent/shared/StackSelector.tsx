'use client';

import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, useRef } from 'react';
import { talentApi, type SkillRecord } from '@/lib/api/talent';

interface StackSelectorProps {
  stack: SkillRecord[];
  onAddSkill: (skill: SkillRecord) => void;
  onRemoveSkill: (skillId: string) => void;
  error?: string;
}

export const StackSelector = ({ stack, onAddSkill, onRemoveSkill, error }: StackSelectorProps) => {
  const [query, setQuery] = useState('');
  const [allSkills, setAllSkills] = useState<SkillRecord[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    talentApi.listSkills().then(setAllSkills).catch(() => { });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedIds = new Set(stack.map((s) => s.id));

  const suggestions = allSkills.filter(
    (s) =>
      !selectedIds.has(s.id) &&
      s.title.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (skill: SkillRecord) => {
    onAddSkill(skill);
    setQuery('');
    setIsOpen(false);
  };

  const remaining = Math.max(0, 3 - stack.length);

  return (
    <div className="flex flex-col gap-[20.84px] w-full mb-[32px]">
      <div className="flex flex-col gap-[6px]">
        <label className="text-[#374151] text-[12px] font-medium font-['Inter'] leading-[18px]">
          Stack y herramientas <span className="text-[#ef4444]">*</span>
        </label>

        <div className="relative" ref={ containerRef }>
          <input
            type="text"
            placeholder="Buscá: Figma, React, SQL…"
            className="bg-white border border-[#d1d5db] h-[43.98px] px-[12px] rounded-[8px] w-full text-[14px] leading-[21px] placeholder:text-[#6b7280] outline-none focus:border-[#4f46e5] transition-colors"
            value={ query }
            onChange={ (e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            } }
            onFocus={ () => setIsOpen(true) }
          />

          { isOpen && query.length > 0 && (
            <ul className="absolute z-10 mt-[4px] w-full bg-white border border-[#d1d5db] rounded-[8px] shadow-md max-h-[200px] overflow-y-auto">
              { suggestions.length > 0 ? (
                suggestions.map((skill) => (
                  <li
                    key={ skill.id }
                    onMouseDown={ () => handleSelect(skill) }
                    className="px-[12px] py-[10px] text-[13px] text-[#111827] cursor-pointer hover:bg-[#f3f4f6] transition-colors"
                  >
                    { skill.title }
                  </li>
                ))
              ) : (
                <li className="px-[12px] py-[10px] text-[13px] text-[#6b7280]">
                  Sin resultados
                </li>
              ) }
            </ul>
          ) }
        </div>

        <p className={ `text-[12px] font-['Inter'] leading-[18px] ${error ? 'text-[#ef4444]' : remaining > 0 ? 'text-[#6b7280]' : 'text-[#16a34a]'}` }>
          { error
            ? error
            : remaining > 0
              ? `Elegí al menos ${remaining} más`
              : '¡Listo! Podés agregar más si querés.' }
        </p>
      </div>

      { stack.length > 0 && (
        <div className="flex flex-wrap gap-[6px] pt-[2px]">
          { stack.map((skill) => (
            <Badge
              key={ skill.id }
              className="bg-[#f3f4f6] border-[#e5e7eb] text-[#374151] px-[11.25px] py-[6.25px] rounded-full flex items-center gap-[6px] font-normal text-[12px] border transition-colors shadow-none"
            >
              { skill.title }
              <button
                type="button"
                onClick={ () => onRemoveSkill(skill.id) }
                className="text-[#6b7280] hover:text-[#ef4444]"
              >
                <X className="size-[11px]" />
              </button>
            </Badge>
          )) }
        </div>
      ) }
    </div>
  );
};
