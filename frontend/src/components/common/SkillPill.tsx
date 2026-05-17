interface SkillPillProps {
  name: string;
  level?: string;
  count?: number | string;
}
export default function SkillPill({ name, level, count }: SkillPillProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm cursor-pointer">
      <span className="text-gray-700">✓ {name}</span>
      {level && <span className="text-xs text-gray-600">· {level}</span>}
      {count && <span className="text-xs text-gray-600">({count})</span>}
    </div>
  );
}
