import { ReactNode } from 'react';

interface InfoBoxProps {
  children: ReactNode;
  variant?: 'default' | 'blue';
  className?: string;
}

export const InfoBox = ({ children, variant = 'default', className }: InfoBoxProps) => {
  const isBlue = variant === 'blue';

  return (
    <div 
      className={`border border-dashed p-[12.365px] px-[15.25px] rounded-[8px] w-full ${
        isBlue 
          ? 'bg-[#eff6ff] border-[#bfdbfe]' 
          : 'bg-[#f9fafb] border-[#d1d5db]'
      } ${className}`}
    >
      <div 
        className={`text-[12.5px] leading-[18.75px] font-['Inter'] ${
          isBlue ? 'text-[#1d4ed8]' : 'text-[#374151]'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
