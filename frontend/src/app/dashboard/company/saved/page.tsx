'use client';

import { Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import Header from '../common/header';
import HeaderNav from '../common/HeaderNav';
import { enterprisesApi } from '@/lib/api/enterprises';
import { TalentProfileListItem } from '@/lib/api/talent';
import { getCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';
import { useRouter } from 'next/navigation';

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

function getDisplayName(profile: TalentProfileListItem) {
  const first = profile.User?.first_name ?? '';
  const last = profile.User?.last_name ?? '';
  if (!first && !last) return 'Candidato';
  if (!last) return first;
  return `${first} ${last[0]}.`;
}

export default function SavedCandidates() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState<TalentProfileListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      const token = getCookie(AUTH_COOKIE_NAME);
      if (!token) {
        router.push('/login-company');
        return;
      }
      setLoading(true);
      try {
        const { favorites: data } = await enterprisesApi.getFavorites(token);
        setFavorites(data);
      } catch (err) {
        console.error('Error al cargar guardados:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, [router]);

  async function removeFromSaved(profileId: string) {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (!token) return;
    try {
      await enterprisesApi.removeFavorite(token, profileId);
      setFavorites((prev) => prev.filter((f) => f.id !== profileId));
    } catch (err) {
      console.error('Error al quitar guardado:', err);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header sidebarOpen={ sidebarOpen } setSidebarOpen={ setSidebarOpen } />

      <div className="flex flex-col lg:flex-row relative">
        { sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={ () => setSidebarOpen(false) }
          />
        ) }

        {/* Mobile nav sidebar */ }
        <aside
          className={ `
            fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#e5e5e5] p-6
            transform transition-transform duration-200
            lg:hidden
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-semibold text-[#1a1a2e]">Menú</span>
            <button
              onClick={ () => setSidebarOpen(false) }
              className="p-1 text-[#6B7280]"
              aria-label="Cerrar menú"
            >
              <X size={ 20 } />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <HeaderNav />
          </div>
        </aside>

        {/* Main Content */ }
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <Button
                  onClick={ () => setSidebarOpen(true) }
                  className="lg:hidden text-xs border border-[#D1D5DB] text-[#4B5563] bg-white px-3 py-1.5 rounded-md"
                >
                  <Menu size={ 14 } className="mr-1" /> Menú
                </Button>
                <h1 className="text-2xl font-bold text-[#1a1a2e]">
                  Mis guardados
                </h1>
              </div>
              { !loading && (
                <p className="text-sm text-[#666]">
                  { favorites.length } candidato{ favorites.length !== 1 ? 's' : '' } guardado
                  { favorites.length !== 1 ? 's' : '' }
                </p>
              ) }
            </div>

            { loading && (
              <p className="text-sm text-[#666]">Cargando guardados...</p>
            ) }
            { !loading && favorites.length === 0 && (
              <div className="text-center py-16">
                <p className="text-[#9CA3AF] text-base mb-2">
                  Aún no guardaste ningún candidato.
                </p>
                <Button
                  onClick={ () => router.push('/dashboard/company') }
                  className="mt-4 bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white"
                >
                  Explorar candidatos
                </Button>
              </div>
            ) }

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              { favorites.map((profile) => {
                const name = getDisplayName(profile);
                const initials = getInitials(
                  profile.User?.first_name,
                  profile.User?.last_name
                );
                const role = profile.Talent_Role?.[0]?.role_name ?? null;
                const availability = profile.availability
                  ? AVAILABILITY_LABELS[profile.availability] ??
                  profile.availability
                  : null;

                return (
                  <Card
                    key={ profile.id }
                    className="p-6 border-[#e5e5e5] hover:shadow-lg transition-shadow gap-0"
                  >
                    <div className="flex gap-4 mb-4 items-center">
                      <Avatar className="w-14 h-14 bg-[#e5e5e5] flex items-center justify-center">
                        { profile.avatar_url && (
                          <AvatarImage src={ profile.avatar_url } alt={ name } />
                        ) }
                        <AvatarFallback className="text-sm font-semibold text-[#666]">
                          { initials }
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#1a1a2e]">{ name }</h3>
                        { role && <p className="text-sm text-[#666]">{ role }</p> }
                        <span className="text-xs text-[#6B7280] italic mt-1 block">
                          Sin reseñas aún
                        </span>
                      </div>
                    </div>

                    { profile.experience_years && (
                      <p className="text-xs text-[#666] mb-3">
                        { profile.experience_years } años de experiencia
                      </p>
                    ) }
                    { profile.location && (
                      <p className="text-xs text-[#999] mb-3">
                        { profile.location }
                      </p>
                    ) }

                    { availability && (
                      <div className="flex items-center gap-1 text-sm text-[#00aa44] font-medium mb-4">
                        <div className="w-2 h-2 bg-[#00aa44] rounded-full"></div>
                        { availability }
                      </div>
                    ) }

                    <div className="flex gap-2">
                      <Button
                        onClick={ () =>
                          router.push(
                            `/dashboard/company/candidate?id=${profile.id}`
                          )
                        }
                        className="flex-1 bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-sm h-8"
                      >
                        Ver perfil completo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-30 text-[#4f46e5] border-[#4f46e5]"
                        onClick={ () => removeFromSaved(profile.id) }
                      >
                        <Heart size={ 18 } className="fill-[#4f46e5]" />
                        <span className="hidden sm:inline">Quitar</span>
                      </Button>
                    </div>
                  </Card>
                );
              }) }
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
