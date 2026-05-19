'use client';

import { type PathCategory } from '@/lib/api/learning-path';

const TABS: { id: PathCategory; label: string; }[] = [
  { id: 'TECH', label: 'Técnica' },
  { id: 'SOFT', label: 'Blandas' },
  { id: 'EMPLOYABILITY', label: 'Empleabilidad' },
];

interface CategoryTabsProps {
  active: PathCategory;
  onChange: (cat: PathCategory) => void;
  note?: string;
}

export function CategoryTabs({ active, onChange, note }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-[8px] flex-wrap">
      { TABS.map((tab) => (
        <button
          key={ tab.id }
          onClick={ () => onChange(tab.id) }
          className={ [
            'px-[12px] py-[5px] rounded-full text-[13px] font-medium transition-colors',
            active === tab.id
              ? 'bg-[#4f46e5] text-white'
              : 'bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]',
          ].join(' ') }
        >
          { tab.label }
        </button>
      )) }
      { note && (
        <span className="text-[12px] text-[#9ca3af] ml-[4px]">{ note }</span>
      ) }
    </div>
  );
}
