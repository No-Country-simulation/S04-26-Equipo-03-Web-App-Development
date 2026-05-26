import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingHeader } from './OnboardingHeader';
import { OnboardingFooter } from './OnboardingFooter';
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';
import type { WorkExperienceEntry } from './shared/ExperienceForm';
import type { EducationEntry } from './shared/EducationForm';
import { talentApi, type SkillRecord } from '@/lib/api/talent';
import type { EnterpriseRecord } from '@/lib/api/enterprises';
import { getCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';

interface FormData {
  // Step 1
  name: string;
  surname: string;
  location: string;
  availability: string;
  avatar: File | null;
  blocked_enterprises: EnterpriseRecord[];
  // Step 2
  role: string;
  experience_years: string | null;
  stack: SkillRecord[];
  cv: File | null;
  skip_cv: boolean;
  // Step 3
  work_experience: WorkExperienceEntry[];
  education: EducationEntry[];
  bio: string;
  portfolio_url: string;
  portfolio_file: File | null;
}

export function TalentOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
      if (!formData.surname.trim()) newErrors.surname = 'El apellido es obligatorio';
    }
    if (currentStep === 2) {
      if (!formData.role.trim()) newErrors.role = 'El rol es obligatorio';
      if (formData.stack.length < 3) newErrors.stack = 'Seleccioná al menos 3 tecnologías';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    location: '',
    availability: '',
    avatar: null,
    blocked_enterprises: [],
    role: '',
    experience_years: null,
    stack: [],
    cv: null,
    skip_cv: false,
    work_experience: [],
    education: [],
    bio: '',
    portfolio_url: '',
    portfolio_file: null,
  });

  const totalSteps = 3;

  const handleFinish = async () => {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (!token) {
      setSubmitError('No estás autenticado. Iniciá sesión nuevamente.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Step 1 — crear perfil
      const registerResult = await talentApi.register(token, {
        first_name: formData.name,
        last_name: formData.surname,
        location: formData.location || undefined,
        availability: formData.availability || undefined,
        blocked_enterprise_ids: formData.blocked_enterprises.map((e) => e.id),
        avatar: formData.avatar,
      });

      const profileId = registerResult.profile_id;

      // Step 2 — rol + skills + CV
      if (formData.role) {
        await talentApi.updateRoleSkills(token, profileId, {
          role_name: formData.role,
          skill_ids: formData.stack.map((s) => s.id),
          cv: formData.skip_cv ? null : formData.cv,
        });
      }

      // Step 3 — perfil extendido
      await talentApi.updateProfile(token, profileId, {
        bio: formData.bio || undefined,
        portfolio_url: formData.portfolio_url || undefined,
        experience_years: formData.experience_years,
        work_experience: formData.work_experience,
        education: formData.education,
      });

      // Portfolio PDF (si se subió)
      if (formData.portfolio_file) {
        await talentApi.uploadPortfolioPdf(token, profileId, formData.portfolio_file);
      }

      router.push('/talent/pre-diagnostic');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Ocurrió un error al guardar tu perfil.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    if (step < totalSteps) setStep(step + 1);
    else handleFinish();
  };

  const skipToDiagnosis = () => {
    if (step === 2 && !validateStep(2)) return;
    handleFinish();
  };

  const prevStep = () => {
    if (step > 1) {
      setErrors({});
      setStep(step - 1);
    }
  };

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <OnboardingHeader step={ step } totalSteps={ totalSteps } />

      <div className="flex-1 flex flex-col items-center justify-start pt-[31.99px] max-w-full overflow-y-auto">
        <main className="w-full max-w-[592.03px] px-[24px] md:px-0">
          { step === 1 && <Step1 data={ formData } onUpdate={ updateFormData } errors={ errors } /> }
          { step === 2 && <Step2 data={ formData } onUpdate={ updateFormData } errors={ errors } /> }
          { step === 3 && <Step3 data={ formData } onUpdate={ updateFormData } /> }
          { submitError && (
            <p className="mt-4 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-[12px] py-[10px]">
              { submitError }
            </p>
          ) }
        </main>
      </div>

      <OnboardingFooter
        step={ step }
        onNext={ nextStep }
        onBack={ prevStep }
        onSkip={ skipToDiagnosis }
        isLastStep={ step === totalSteps }
        isSubmitting={ isSubmitting }
      />
    </div>
  );
}
