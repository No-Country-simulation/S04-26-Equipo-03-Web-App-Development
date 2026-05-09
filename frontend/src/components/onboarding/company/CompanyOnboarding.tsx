'use client';

// import { ProgressBar } from './ProgressBar'
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';

interface CompanyOnboardingProps {
  step: number;
  formData: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  onNext: () => void;
}

export function CompanyOnboarding({
  step,
  formData,
  onUpdate,
  onNext,
}: CompanyOnboardingProps) {
  return (
    <div className="md:min-w-150 mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col">
      <div className="flex-1">
        {step === 1 && <Step1 data={formData} onUpdate={onUpdate} />}
        {step === 2 && (
          <Step2
            data={formData}
            onUpdate={onUpdate}
            onNext={onNext}
            // onBack={onBack}
          />
        )}
      </div>
    </div>
  );
}
