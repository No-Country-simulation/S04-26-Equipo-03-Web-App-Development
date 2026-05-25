'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteHeader from '@/components/layout/SiteHeader';
import { CompanyOnboarding } from '@/components/onboarding/company/CompanyOnboarding';
import { OnboardingFooter } from '@/components/onboarding/company/OnboardingFooter';
import { enterprisesApi } from '@/lib/api/enterprises';
import { getCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateFormData = (data: Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleFinish = async () => {
    setError('');
    const { firstName, lastName, companyName, website, industry, size } =
      formData as {
        firstName?: string;
        lastName?: string;
        companyName?: string;
        website?: string;
        industry?: string;
        size?: string;
      };

    if (!firstName || !lastName || !companyName) {
      setError('Completá tu nombre, apellido y nombre de empresa.');
      return;
    }

    const token = getCookie(AUTH_COOKIE_NAME);
    if (!token) {
      router.push('/login-company');
      return;
    }

    setLoading(true);
    try {
      await enterprisesApi.completeOnboarding(
        {
          first_name: firstName,
          last_name: lastName,
          company_name: companyName,
          website_url: website || undefined,
          industry: industry || undefined,
          size: size || undefined,
        },
        token
      );
      router.push('/dashboard/company');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error al guardar los datos.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <div className="border-b-[1.25px] border-b-[#E5E7EB]">
        <SiteHeader
          rightContent={
            <span className="text-sm text-gray-500">
              Podés completarlo después
            </span>
          }
        />
      </div>
      <CompanyOnboarding
        step={ 1 }
        formData={ formData }
        onUpdate={ updateFormData }
        onNext={ handleFinish }
      />
      { error && (
        <p className="text-sm text-red-500 text-center px-8 pb-2">{ error }</p>
      ) }
      <OnboardingFooter
        step={ 1 }
        onNext={ handleFinish }
        nextLabel="Finalizar"
        loading={ loading }
      />
    </div>
  );
}
