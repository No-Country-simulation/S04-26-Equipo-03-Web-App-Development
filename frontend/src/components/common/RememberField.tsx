import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useState } from 'react';
interface RememberFieldProps {
  label?: string;
  forgotHref?: string;
}
export default function RememberField({
  label = 'Recordar mi cuenta en este dispositivo',
  forgotHref,
}: RememberFieldProps) {
  const [isSelected, setIsSelected] = useState(true);

  const toggleLevel = (isSelected: boolean) => {
    setIsSelected(isSelected);
  };
  const checkbox = (
    <label className="flex items-center gap-3 cursor-pointer">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => toggleLevel(!isSelected)}
        className={`${
          isSelected
            ? 'data-[state=checked]:bg-[#4f46e5] data-[state=checked]:border-[#4f46e5]'
            : ''
        }`}
      />
      <span className="text-sm text-[#1a1a2e] whitespace-nowrap">{label}</span>
    </label>
  );
  if (!forgotHref) return checkbox;
  return (
    <div className="flex items-center justify-between">
      {checkbox}
      <Link
        href={forgotHref}
        className="text-[#4f46e5] text-xs hover:underline whitespace-nowrap"
      >
        ¿Olvidaste tu contraseña?
      </Link>
    </div>
  );
}
