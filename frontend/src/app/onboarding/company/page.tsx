'use client';

import SiteHeader from '@/components/layout/SiteHeader';
import { CompanyOnboarding } from '@/components/onboarding/company/CompanyOnboarding';
import { OnboardingFooter } from '@/components/onboarding/company/OnboardingFooter';
import { ProgressBar } from '@/components/onboarding/company/ProgressBar';
import { useState } from 'react';

const TOTAL_STEPS = 2;

export default function CompanyOnboardingPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const updateFormData = (data: Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <div className="border-b-[1.25px] border-b-[#E5E7EB]">
        <SiteHeader
          rightContent={
            <span className="text-sm text-gray-500">
              Podés completarlo después
            </span>
          }
          progressBar={
            <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />
          }
        />
      </div>
      <CompanyOnboarding
        step={step}
        formData={formData}
        onUpdate={updateFormData}
        onNext={nextStep}
      />
      <OnboardingFooter step={step} onNext={nextStep} onBack={prevStep} />
    </div>
  );
}
