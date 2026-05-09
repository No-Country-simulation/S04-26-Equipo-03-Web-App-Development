interface StepHeaderProps {
  badge: {
    text: string;
    variant: 'obligatorio' | 'opcional';
  };
  title: string;
  subtitle: string;
}

export const StepHeader = ({ badge, title, subtitle }: StepHeaderProps) => {
  const isObligatorio = badge.variant === 'obligatorio';

  return (
    <div className="flex flex-col items-start w-full mb-[24.1px]">
      <div 
        className={`px-[9px] py-[4px] rounded-[6px] mb-[14px] ${
          isObligatorio 
            ? 'bg-[#4f46e5]' 
            : 'bg-[#fff7ed] border border-[#fed7aa]'
        }`}
      >
        <span 
          className={`text-[11px] font-semibold font-['Inter'] leading-[16.5px] tracking-[0.22px] ${
            isObligatorio ? 'text-white' : 'text-[#9a3412]'
          }`}
        >
          {badge.text}
        </span>
      </div>

      <div className="flex flex-col gap-[1.265px] w-full">
        <h2 className="text-[#111827] text-[22px] font-bold font-['Inter'] leading-[26.4px] tracking-[-0.22px]">
          {title}
        </h2>
        <p className="text-[#6b7280] text-[14px] font-normal font-['Inter'] leading-[21px]">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
