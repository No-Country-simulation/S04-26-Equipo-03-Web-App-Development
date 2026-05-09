import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface SocialButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export const SocialButton = ({ icon, label, onClick }: SocialButtonProps) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="bg-white border-[#d1d5db] flex gap-[5.98px] items-center justify-center px-[17.25px] py-[13.25px] h-auto rounded-[8px] w-full hover:bg-gray-50 transition-colors shadow-none"
    >
      <div className="shrink-0 size-[16px] flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[#1f2937] text-[13px] font-medium font-['Inter'] leading-[13px] text-center">
        {label}
      </span>
    </Button>
  );
};
