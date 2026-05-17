import { X, Check, Astroid } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ReactNode } from 'react';
interface SkillBadgeProps {
  children: ReactNode;
  variant?: 'filter' | 'level' | 'verified' | 'pending' | 'star' | 'muted';
  /** Solo para variant="filter" — mustra el ícono X */
  onRemove?: () => void;
}
const variantStyles: Record<string, string> = {
  filter: 'bg-[#EEF2FF] border-[#C7D2FE] text-[#4F46E5] px-2',
  level: 'bg-[#4f46e5] text-white rounded-md',
  verified: 'border-[#A7F3D0] text-[#065F46] bg-white',
  pending: 'text-[#4B5563] bg-white border-dashed border-[#D1D5DB]',
  star: 'bg-[#1a1a2e] text-white ml-2 rounded-md',
  muted: 'bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]',
};
export default function SkillBadge({
  children,
  variant = 'filter',
  onRemove,
}: SkillBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`text-xs ${variant !== 'star' ? 'py-2' : 'py-1'} ${variantStyles[variant]}`}
    >
      {variant === 'star' && (
        <Astroid size={16} className="fill-[#FBBF24] text-[#FBBF24]" />
      )}
      {(variant === 'level' || variant === 'verified') && (
        <Check
          className={variant === 'level' ? 'text-white' : 'text-[#10B981]'}
        />
      )}
      {children}
      {variant === 'pending' && (
        <span className="ml-1 text-xs text-[#6B7280]">pendiente</span>
      )}
      {variant === 'filter' && onRemove && (
        <X
          className="text-[#6B7280] color-[#6B7280] cursor-pointer ml-1"
          size={16}
          onClick={onRemove}
        />
      )}
    </Badge>
  );
}
