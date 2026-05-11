import { Smile } from 'lucide-react';

interface RutySpeechBubbleProps {
  text: string;
  className?: string;
}

export const RutySpeechBubble = ({ text, className }: RutySpeechBubbleProps) => {
  return (
    <div className={`bg-white border border-[#e5e7eb] rounded-[10px] p-[13.25px] flex items-start gap-[11.99px] shadow-sm ${className}`}>
      <div className="size-[41.99px] rounded-full bg-[#eef2ff] flex items-center justify-center shrink-0 border border-[#c7d2fe]">
        <Smile className="size-[24px] text-[#4f46e5]" />
      </div>
      <div className="bg-[#eef2ff] border border-[#c7d2fe] p-[13.25px] px-[15.25px] rounded-[10px] relative">
        <p className="text-[#1f2937] text-[13px] leading-[18.85px] font-['Inter']">
          {text}
        </p>
        <div className="absolute left-[-6px] top-[14px] size-[12px] bg-[#eef2ff] border-l border-b border-[#c7d2fe] rotate-45" />
      </div>
    </div>
  );
};

export const RutyIndicator = ({ className }: { className?: string }) => {
  return (
    <div className={`size-[24px] bg-[#4f46e5]/10 rounded-full flex items-center justify-center ${className}`}>
      <div className="size-[8px] bg-[#4f46e5] rounded-full animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
    </div>
  );
};

export const RutyTipBox = ({ title, text, className }: { title: string; text: string; className?: string }) => {
  return (
    <div className={`bg-[#f9fafb] p-[16px] rounded-[12px] border border-[#e5e7eb] border-l-[4px] border-l-[#4f46e5] w-full ${className}`}>
      <div className="flex flex-col gap-[4px]">
        <p className="text-[13px] font-semibold text-[#111827] font-['Inter']">{title}</p>
        <p className="text-[12px] text-[#6b7280] leading-[18px] font-['Inter']">
          {text}
        </p>
      </div>
    </div>
  );
};
