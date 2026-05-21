import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';
import { apiClient } from '@/lib/api/client';
import { isAxiosError } from 'axios';
import { DiagnosticIntro } from '@/components/diagnostic/DiagnosticIntro';

interface MyProfileResponse {
  profile: { id: string; };
  roles: Array<{ role_name: string | null; }>;
}

export default async function DiagnosticPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) redirect('/talent/login');

  let profileId: string | null = null;
  let roleName = '';

  try {
    const { data } = await apiClient.get<MyProfileResponse>('/talent/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    profileId = data.profile?.id ?? null;
    roleName = data.roles?.[0]?.role_name ?? '';
  } catch (err) {
    if (isAxiosError(err)) {
      if (err.response?.status === 401) redirect('/talent/login');
      if (err.response?.status === 404) redirect('/talent/onboarding');
      throw new Error(
        `Error al obtener perfil (${err.response?.status ?? 'red'}): ${err.message}`,
      );
    }
    throw err;
  }

  if (!profileId) redirect('/talent/onboarding');

  return <DiagnosticIntro profileId={ profileId } roleName={ roleName } />;
}
