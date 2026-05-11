'use client';

import { TalentOnboarding } from '@/components/onboarding/talent/TalentOnboarding';

export default function TalentOnboardingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <main className="flex-1">
        <TalentOnboarding />
      </main>
    </div>
  );
}
