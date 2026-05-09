import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useState } from 'react';

export const AuthActionRow = () => {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="flex items-center justify-between pt-[3.125px] w-full">
      <label className="flex gap-[7.98px] items-center cursor-pointer">
        <Checkbox
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          className="border-[#4f46e5] border-[0.813px] data-[state=checked]:bg-[#4f46e5] data-[state=checked]:border-[#4f46e5] rounded-[2.439px] w-[13.01px] h-[13.823px] transition-none"
        />
        <span className="text-[#374151] text-[13px] font-normal font-['Inter'] leading-[19.5px] whitespace-nowrap">
          Recordar mi cuenta
        </span>
      </label>
      <Link
        href="/forgot-password"
        className="text-[#4f46e5] text-[12px] font-normal font-['Inter'] leading-[18px] whitespace-nowrap hover:underline"
      >
        ¿Olvidaste tu contraseña?
      </Link>
    </div>
  );
};
