interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="flex items-center gap-[10px] w-full pt-[0px]">
      <span className="text-[12px] text-[#6b7280] font-normal font-['Inter'] leading-[18px] shrink-0 w-[90px]">
        Paso {currentStep} de {totalSteps}
      </span>
      <div className="flex-1 h-[7.99px] bg-[#e5e7eb] rounded-[999px] overflow-hidden relative">
        <div
          className="absolute left-0 top-0 h-full bg-[#4f46e5] transition-all duration-300 rounded-[999px]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[12px] text-[#6b7280] font-normal font-['Consolas'] leading-[18px] shrink-0 w-[39.59px]">
        {Math.round(progress)}%
      </span>
    </div>
  );
}
