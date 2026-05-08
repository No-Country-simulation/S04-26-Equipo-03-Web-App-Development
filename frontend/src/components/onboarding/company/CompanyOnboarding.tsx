'use client';

import { useState } from 'react';
// import { ProgressBar } from './ProgressBar'
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { OnboardingFooter } from './OnboardingFooter';

// const TOTAL_STEPS = 2

interface CompanyOnboardingProps {
  step: number;
  formData: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CompanyOnboarding({
  step,
  formData,
  onUpdate,
  onNext,
  onBack,
}: CompanyOnboardingProps) {
  // const [step, setStep] = useState(1)
  // const [formData, setFormData] = useState<Record<string, unknown>>({})

  // const updateFormData = (data: Record<string, unknown>) => {
  //   setFormData((prev) => ({ ...prev, ...data }))
  // }

  // const nextStep = () => setStep((prev) => Math.min(prev + 1, TOTAL_STEPS))
  // const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col">
      <div className="flex-1">
        {step === 1 && (
          <Step1 data={formData} onUpdate={onUpdate} onNext={onNext} />
        )}
        {step === 2 && (
          <Step2
            data={formData}
            onUpdate={onUpdate}
            onNext={onNext}
            onBack={onBack}
          />
        )}
      </div>

      {/* <OnboardingFooter
        step={step}
        onNext={onNext}
        onBack={onBack}
      /> */}
    </div>
  );
}
