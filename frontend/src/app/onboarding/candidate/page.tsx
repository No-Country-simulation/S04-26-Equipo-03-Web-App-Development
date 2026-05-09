'use client';

import { CandidateOnboarding } from '@/components/onboarding/candidate/CandidateOnboarding';

export default function CandidateOnboardingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <main className="flex-1">
        <CandidateOnboarding />
      </main>
    </div>
  );
}
