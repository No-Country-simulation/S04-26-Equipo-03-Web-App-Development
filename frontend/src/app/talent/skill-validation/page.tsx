import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { apiClient } from '@/lib/api/client';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';
import { SkillValidationIntro } from '@/components/skill-validation/SkillValidationIntro';

interface TalentSkill {
  skill_id: string;
  validated: boolean | null;
  Skill: { id: string; title: string; type: string; } | null;
}

interface TalentMeResponse {
  profile: { id: string; };
  skills: TalentSkill[];
}

export default async function SkillValidationPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) redirect('/talent/login');

  let profileId = '';
  let skills: TalentSkill[] = [];

  try {
    const { data } = await apiClient.get<TalentMeResponse>('/talent/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    profileId = data.profile?.id ?? '';
    skills = data.skills ?? [];
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

  return <SkillValidationIntro profileId={ profileId } skills={ skills } />;
}
