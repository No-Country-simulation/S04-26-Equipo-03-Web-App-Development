'use client';

import SiteHeader from '@/components/layout/SiteHeader';
import { CompanyOnboarding } from '@/components/onboarding/company/CompanyOnboarding';

export default function CompanyOnboardingPage() {
  return (
    <div className="min-h-dvh bg-white">
      <div className="border-b-[1.25px] border-b-[#E5E7EB]">
        <SiteHeader
          rightContent={
            <span className="text-sm text-gray-500">
              Podés completarlo después
            </span>
          }
        />
      </div>
      <CompanyOnboarding />
    </div>
  );
}
