'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '../common/header';
import { useEffect, useState, Suspense } from 'react';
import SkillPill from '@/components/common/SkillPill';
import CardSection from '@/components/common/CardSection';
import CandidateHeader from './_components/CandidateHeader';
import ExperienceItem from './_components/ExperienceItem';
import ProfileSidebar from './_components/ProfileSidebar';
import HeaderNav from '../common/HeaderNav';
import { Skeleton } from '@/components/ui/skeleton';
import { talentApi, TalentProfileDetail } from '@/lib/api/talent';
import { enterprisesApi } from '@/lib/api/enterprises';
import { learningPathApi } from '@/lib/api/learning-path';
import { getCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';
import { useSearchParams } from 'next/navigation';

const AVAILABILITY_LABELS: Record<string, string> = {
  ACTIVE_JOB_SEARCH: 'Búsqueda activa',
  OPEN_TO_OFFERS: 'Abierto a ofertas',
  NOT_LOOKING_ASSESSMENT_ONLY: 'No disponible',
};

function getInitials(firstName?: string | null, lastName?: string | null) {
  const f = firstName?.[0] ?? '';
  const l = lastName?.[0] ?? '';
  return (f + l).toUpperCase() || '?';
}

function CandidateProfileContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<TalentProfileDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  const [learningProgress, setLearningProgress] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const profileId = searchParams.get('id');

  useEffect(() => {
    if (!profileId) return;
    async function load() {
      setLoading(true);
      try {
        const detail = await talentApi.getProfileById(profileId!);
        setData(detail);

        const token = getCookie(AUTH_COOKIE_NAME);
        if (token) {
          try {
            const { favorites } = await enterprisesApi.getFavorites(token);
            setIsSaved(favorites.some((f) => f.id === profileId));
          } catch {
            // sin favoritos disponibles
          }
          try {
            const { learning_paths } = await learningPathApi.findByProfile(token, profileId!);
            const pct = learning_paths[0]?.progress?.percentage ?? null;
            setLearningProgress(pct);
          } catch {
            // sin ruta disponible
          }
        }
      } catch (err) {
        console.error('Error al cargar perfil:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [profileId]);

  async function handleToggleSave() {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (!token || !profileId) return;
    try {
      if (isSaved) {
        await enterprisesApi.removeFavorite(token, profileId);
        setIsSaved(false);
      } else {
        await enterprisesApi.addFavorite(token, profileId);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error al guardar favorito:', err);
    }
  }

  const { profile, user, roles, skills } = data ?? {};
  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    'Candidato';
  const initials = getInitials(user?.first_name, user?.last_name);
  const role = roles?.[0]?.role_name ?? null;
  const cvUrl = roles?.[0]?.cv_url ?? null;
  const status = profile?.availability
    ? (AVAILABILITY_LABELS[profile.availability] ?? profile.availability)
    : null;

  const sortedSkills = skills
    ? [...skills].sort((a, b) => (b.validated ? 1 : 0) - (a.validated ? 1 : 0))
    : [];

  const workExp = Array.isArray(profile?.work_experience)
    ? (profile.work_experience as NonNullable<TalentProfileDetail['profile']['work_experience']>)
    : [];

  const education = Array.isArray(profile?.education)
    ? (profile.education as NonNullable<TalentProfileDetail['profile']['education']>)
    : [];

  return (
    <div className="min-h-screen bg-white">
      <Header sidebarOpen={ sidebarOpen } setSidebarOpen={ setSidebarOpen } />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Link
          href="/dashboard/company"
          className="flex items-center gap-1 text-sm text-[#1a1a2e] mb-4 sm:mb-6 hover:opacity-80"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver al dashboard
        </Link>

        { loading ? (
          <div className="space-y-4">
            <Skeleton className="h-36 w-full rounded-xl bg-[#E5E7EB]" />
            <Skeleton className="h-48 w-full rounded-xl bg-[#E5E7EB]" />
            <Skeleton className="h-32 w-full rounded-xl bg-[#E5E7EB]" />
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <CandidateHeader
                candidate={ {
                  name: fullName,
                  initials,
                  avatarUrl: profile?.avatar_url ?? null,
                  role: role ?? '',
                  location: profile?.location ?? '',
                  status: status ?? '',
                  experience: profile?.experience_years
                    ? `${profile.experience_years} años exp.`
                    : '',
                } }
              />

              { sortedSkills.length > 0 && (
                <CardSection
                  title="Skills"
                  description="Skills del candidato."
                >
                  <div
                    className={ `flex flex-wrap gap-2 mt-6 overflow-hidden transition-all duration-300 ${!skillsExpanded && sortedSkills.length > 6 ? 'max-h-[88px]' : 'max-h-none'
                      }` }
                  >
                    { sortedSkills.map((s) => (
                      <SkillPill
                        key={ s.id }
                        name={ s.Skill?.title ?? '' }
                        level={ s.validated ? 'Validado' : 'Pendiente' }
                      />
                    )) }
                  </div>
                  { sortedSkills.length > 6 && (
                    <button
                      type="button"
                      onClick={ () => setSkillsExpanded((v) => !v) }
                      className="mt-3 text-xs font-semibold text-[#4f46e5] hover:underline cursor-pointer"
                    >
                      { skillsExpanded ? 'Ver menos' : `Ver más (${sortedSkills.length - 6} más)` }
                    </button>
                  ) }
                </CardSection>
              ) }

              { profile?.bio && (
                <CardSection title="Resumen" description={ profile.bio } />
              ) }

              { workExp.length > 0 && (
                <CardSection title="Experiencia">
                  <div className="space-y-6 mt-6">
                    { workExp.map((exp, i) => {
                      const period = [
                        exp.start_date,
                        exp.is_current ? 'Presente' : exp.end_date,
                      ]
                        .filter(Boolean)
                        .join(' – ');
                      return (
                        <ExperienceItem
                          key={ i }
                          title={ exp.role ?? '' }
                          company={
                            [exp.company, period].filter(Boolean).join(' · ')
                          }
                          description={ exp.description }
                        />
                      );
                    }) }
                  </div>
                </CardSection>
              ) }

              { education.length > 0 && (
                <CardSection title="Educación">
                  <div className="space-y-4 mt-6">
                    { education.map((ed, i) => (
                      <div key={ i }>
                        <h3 className="font-semibold text-sm text-[#1a1a2e]">
                          { ed.title }
                        </h3>
                        <p className="text-xs text-gray-600">
                          { [ed.institution, ed.graduation_year]
                            .filter(Boolean)
                            .join(' · ') }
                        </p>
                      </div>
                    )) }
                  </div>
                </CardSection>
              ) }

              { profile?.portfolio_url && (
                <CardSection title="Portfolio">
                  <a
                    href={ profile.portfolio_url }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#4f46e5] hover:underline mt-4 inline-block break-all"
                  >
                    { profile.portfolio_url }
                  </a>
                </CardSection>
              ) }
            </div>

            <div className="hidden lg:block lg:col-span-1">
              <ProfileSidebar
                progress={ learningProgress ?? undefined }
                isSaved={ isSaved }
                onToggleSave={ handleToggleSave }
                cvUrl={ cvUrl }
                email={ user?.email ?? null }
                candidateName={ fullName }
              />
            </div>
          </div>
        ) }

        { sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={ () => setSidebarOpen(false) }
            />
            <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-[#F9FAFB] shadow-xl overflow-y-auto">
              <div className="flex flex-col gap-1 p-4 border-b border-gray-200">
                <HeaderNav />
              </div>
              <ProfileSidebar
                progress={ learningProgress ?? undefined }
                isSaved={ isSaved }
                onToggleSave={ handleToggleSave }
                cvUrl={ cvUrl }
                email={ user?.email ?? null }
                candidateName={ fullName }
              />
            </div>
          </div>
        ) }
      </div>
    </div>
  );
}

export default function CandidateProfile() {
  return (
    <Suspense>
      <CandidateProfileContent />
    </Suspense>
  );
}
