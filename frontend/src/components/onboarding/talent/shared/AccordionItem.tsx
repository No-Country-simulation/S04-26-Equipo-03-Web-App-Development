import { ChevronDown } from 'lucide-react';
import { ReactNode } from 'react';

interface AccordionItemProps {
  id: string;
  title: string;
  subtitle: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export const AccordionItem = ({ id, title, subtitle, isOpen, onToggle, children }: AccordionItemProps) => {
  return (
    <div
      className={`bg-white border border-[#e5e7eb] rounded-[10px] shadow-[0px_1px_2px_rgba(17,24,39,0.06),0px_1px_3px_rgba(17,24,39,0.08)] overflow-hidden transition-all ${
        isOpen ? 'ring-1 ring-[#4f46e5]/20' : ''
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-[16px] py-[14px] text-left hover:bg-[#f9fafb] transition-colors"
      >
        <div className="flex flex-col gap-[1.115px]">
          <span className="text-[14px] font-semibold text-[#111827] font-['Inter'] leading-[21px]">
            {title}
          </span>
          <span className="text-[12px] font-normal text-[#6b7280] font-['Inter'] leading-[18px]">
            {subtitle}
          </span>
        </div>
        <ChevronDown className={`size-[18px] text-[#9ca3af] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="bg-[#f9fafb] border-t border-[#e5e7eb] p-[16px] pt-[15.25px]">
          {children}
        </div>
      )}
    </div>
  );
};
