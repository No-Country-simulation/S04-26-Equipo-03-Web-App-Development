import { AuthLogo } from '@/components/layout/auth/AuthLogo';
import { ProgressBar } from './ProgressBar';

interface OnboardingHeaderProps {
  step: number;
  totalSteps: number;
}

export const OnboardingHeader = ({ step, totalSteps }: OnboardingHeaderProps) => {
  return (
    <header className="bg-white border-b-[1.25px] border-[#e5e7eb] flex flex-col gap-[11.99px] items-start pb-[17.25px] pt-[16px] px-[32px] w-full">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <AuthLogo />
        <div className="h-[17.99px] w-[210.04px]" />
      </div>
      <div className="w-full max-w-7xl mx-auto">
        <ProgressBar currentStep={step} totalSteps={totalSteps} />
      </div>
    </header>
  );
};
