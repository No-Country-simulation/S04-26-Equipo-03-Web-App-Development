import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { TalentAppHeader } from '@/components/layout/TalentAppHeader';
import { apiClient } from '@/lib/api/client';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';
import CardSection from '@/components/common/CardSection';
import ProfileExperience from './ProfileExperience';
import ProfileProgressBar from './ProfileProgressBar';
import ProfileDataBase from './ProfileDataBase';
import ProfileSkills from './ProfileSkills';
import ProfileReviews from './ProfileReviews';
import ProfileEducation from './ProfileEducation';
import ProfilePortfolio from './ProfilePortfolio';
import ProfileInsigniaCard from './ProfileInsigniaCard';
import ProfileLearningPath from './ProfileLearningPath';
import ProfileCVAttached from './ProfileCVAttached';
import type { LearningPathSummary } from '@/lib/api/learning-path';

export interface SkillItem {
  skill_id: string;
  self_rating: string | null;
  validated: boolean | null;
  validated_at: string | null;
  Skill: { id: string; title: string; type: string; } | null;
}

export interface WorkExp {
  id?: string;
  company: string;
  role: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
}

export interface EduEntry {
  id?: string;
  institution: string;
  title: string;
  graduation_year?: string;
}

interface TalentMeResponse {
  profile: {
    id: string;
    location: string | null;
    availability: string | null;
    bio: string | null;
    portfolio_url: string | null;
    avatar_url: string | null;
    experience_years: string | null;
    work_experience: unknown;
    education: unknown;
  };
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
  roles: Array<{ role_name: string | null; cv_url: string | null; }>;
  skills: SkillItem[];
}

export default async function TalentProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) redirect('/talent/login');

  let me: TalentMeResponse;
  try {
    const { data } = await apiClient.get<TalentMeResponse>('/talent/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    me = data;
  } catch (err) {
    if (isAxiosError(err)) {
      if (err.response?.status === 401) redirect('/talent/login');
      if (err.response?.status === 404) redirect('/talent/onboarding');
    }
    redirect('/talent/login');
  }
  console.log(me);

  let activePath: LearningPathSummary | null = null;
  try {
    const { data } = await apiClient.get<{ learning_paths: LearningPathSummary[]; }>(
      '/learning-path/me',
      { headers: { Authorization: `Bearer ${token}` } },
    );
    activePath = data.learning_paths?.[0] ?? null;
  } catch {
    // Sin ruta aún
  }

  const { profile, user, roles, skills } = me;
  const firstName = user?.first_name ?? '';
  const lastName = user?.last_name ?? '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Talento';
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase() || 'T';
  const roleName = roles[0]?.role_name ?? '';
  const cvUrl = roles[0]?.cv_url ?? null;

  const workExp = Array.isArray(profile.work_experience) ? profile.work_experience as WorkExp[] : [];
  const education = Array.isArray(profile.education) ? profile.education as EduEntry[] : [];

  // Completitud del perfil (6 campos clave)
  const filled = [
    !!fullName && fullName !== 'Talento',
    !!roleName,
    !!profile.bio,
    skills.length > 0,
    workExp.length > 0,
    education.length > 0,
  ].filter(Boolean).length;
  const completionPercent = Math.round((filled / 6) * 100);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */ }
      <TalentAppHeader activeTab="profile" />

      {/* Progress Bar */ }
      <ProfileProgressBar completionPercent={ completionPercent } />

      {/* Main Content */ }
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Main Content */ }
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Profile Header */ }
            <ProfileDataBase
              fullName={ fullName }
              initials={ initials }
              roleName={ roleName }
              location={ profile.location }
              availability={ profile.availability }
              avatarUrl={ profile.avatar_url }
            />

            {/* Resumen */ }
            { profile.bio && (
              <CardSection title="Resumen" description={ profile.bio } />
            ) }

            {/* Skills */ }
            <ProfileSkills skills={ skills } />

            {/* Reseñas */ }
            <ProfileReviews />

            {/* Experiencia */ }
            <ProfileExperience experience={ workExp } />

            {/* Educación */ }
            <ProfileEducation education={ education } />

            {/* Portfolio */ }
            <ProfilePortfolio portfolioUrl={ profile.portfolio_url } />
          </div>

          {/* Right Column - Sidebar */ }
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Insignia Card */ }
              <ProfileInsigniaCard
                skillCount={ skills.length }
                validatedCount={ skills.filter((s) => s.validated === true).length }
              />

              {/* Ruta de Aprendizaje */ }
              <ProfileLearningPath learningPath={ activePath } />

              {/* CV Adjunto */ }
              <ProfileCVAttached cvUrl={ cvUrl } profileId={ profile.id } />

              {/* IA Feedback */ }
              {/* Esto ya no es necesario - por el momento se deja por si las moscas quieren ver */ }
              {/* <Card className="border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 mb-2">
                      ¿Cuería que revise tu CV para el rol que elegiste?
                    </p>
                    <p className="text-xs text-gray-600 mb-3">
                      Te marco lo que se puede mejorar.
                    </p>
                    <Button className="w-full bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-sm h-8">
                      Revisar con IA
                    </Button>
                  </div>
                </div>
              </Card> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
