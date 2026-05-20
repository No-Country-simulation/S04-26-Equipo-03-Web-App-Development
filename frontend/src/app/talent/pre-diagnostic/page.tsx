import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';
import { apiClient } from '@/lib/api/client';
import { PreDiagnosticView } from '@/components/pre-diagnostic/PreDiagnosticView';

interface MyProfileResponse {
  profile: { id: string; };
}

export default async function SelfEvaluationPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect('/talent/login');
  }

  let profileId: string | null = null;

  try {
    const { data } = await apiClient.get<MyProfileResponse>('/talent/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    profileId = data.profile?.id ?? null;
  } catch {
    // sin perfil → redirigir al onboarding
    redirect('/talent/onboarding');
  }

  if (!profileId) {
    redirect('/talent/onboarding');
  }

  return <PreDiagnosticView profileId={ profileId } />;
}

