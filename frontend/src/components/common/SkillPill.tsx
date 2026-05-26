interface SkillPillProps {
  name: string;
  level?: string;
  count?: number | string;
}
export default function SkillPill({ name, level, count }: SkillPillProps) {
  const validated = level === 'Validado';
  return (
    <div
      className={ `flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer border ${validated
          ? 'bg-[#ede9fe] border-[#4f46e5] text-[#4f46e5]'
          : 'bg-gray-100 border-gray-200 text-gray-700'
        }` }
    >
      <span>{ validated ? '✓ ' : '' }{ name }</span>
      { level && (
        <span className={ `text-xs ${validated ? 'text-[#6d5ef7]' : 'text-gray-500'}` }>
          · { level }
        </span>
      ) }
      { count && <span className="text-xs text-gray-500">({ count })</span> }
    </div>
  );
}
