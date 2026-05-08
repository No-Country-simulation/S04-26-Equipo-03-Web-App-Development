import { useState } from 'react';
import { OnboardingHeader } from './OnboardingHeader';
import { OnboardingFooter } from './OnboardingFooter';
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';

export function TalentOnboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    location: '',
    availability: '',
    role: '',
    stack: [],
    experience: [],
    education: [],
  });

  const totalSteps = 3;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else console.log('Finished!', formData);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <OnboardingHeader step={step} totalSteps={totalSteps} />
      
      <div className="flex-1 flex flex-col items-center justify-start pt-[31.99px] max-w-full overflow-y-auto">
        <main className="w-full max-w-[592.03px] px-[24px] md:px-0">
          {step === 1 && <Step1 data={formData} onUpdate={updateFormData} />}
          {step === 2 && <Step2 data={formData} onUpdate={updateFormData} />}
          {step === 3 && <Step3 data={formData} onUpdate={updateFormData} />}
        </main>
      </div>

      <OnboardingFooter 
        step={step} 
        onNext={nextStep} 
        onBack={prevStep} 
        isLastStep={step === totalSteps} 
      />
    </div>
  );
}
