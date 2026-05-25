'use client';

import { Heart, Menu, MoveDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import SkillBadge from '@/components/common/SkillBadge';
import SidebarSection from '@/components/layout/SidebarSection';
import RadioGroup from '@/components/common/RadioGroup';
import { useEffect, useMemo, useState } from 'react';
import {
  mockAvailability,
} from './_data';
import Header from './common/header';
import HeaderNav from './common/HeaderNav';
import { talentApi, TalentProfileListItem } from '@/lib/api/talent';
import { enterprisesApi } from '@/lib/api/enterprises';
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

export default function Dashboard() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'cards' | 'tabla'>('cards');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profiles, setProfiles] = useState<TalentProfileListItem[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState('Cualquiera');
  const [experienceRange, setExperienceRange] = useState<[number, number]>([0, 30]);
  const [skillsFilter, setSkillsFilter] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [skillDropdownOpen, setSkillDropdownOpen] = useState(false);

  const suggestedSkills = useMemo(() => {
    const all = new Set<string>();
    profiles.forEach((p) => {
      (p.Talent_skill ?? []).forEach((ts) => {
        if (ts.Skill?.title) all.add(ts.Skill.title);
      });
    });
    const q = skillInput.toLowerCase().trim();
    return Array.from(all)
      .filter(
        (t) =>
          !skillsFilter.some((s) => s.toLowerCase() === t.toLowerCase()) &&
          (q === '' || t.toLowerCase().includes(q))
      )
      .sort();
  }, [profiles, skillInput, skillsFilter]);

  const AVAILABILITY_MAP: Record<string, string> = {
    'Disponible activamente': 'ACTIVE_JOB_SEARCH',
    'Abierto a oportunidades': 'OPEN_TO_OFFERS',
  };

  const filteredProfiles = profiles.filter((profile) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const name = getDisplayName(profile).toLowerCase();
      const role = (profile.Talent_Role?.[0]?.role_name ?? '').toLowerCase();
      const location = (profile.location ?? '').toLowerCase();
      if (!name.includes(q) && !role.includes(q) && !location.includes(q)) return false;
    }

    if (availability !== 'Cualquiera') {
      const expected = AVAILABILITY_MAP[availability];
      if (profile.availability !== expected) return false;
    }

    const exp = parseFloat(profile.experience_years ?? '');
    if (!isNaN(exp)) {
      if (exp < experienceRange[0] || exp > experienceRange[1]) return false;
    }

    if (skillsFilter.length > 0) {
      const profileSkills = (profile.Talent_skill ?? []).map(
        (ts) => ts.Skill?.title?.toLowerCase() ?? ''
      );
      const allMatch = skillsFilter.every((s) =>
        profileSkills.includes(s.toLowerCase())
      );
      if (!allMatch) return false;
    }

    return true;
  });

  function clearFilters() {
    setSearch('');
    setAvailability('Cualquiera');
    setExperienceRange([0, 30]);
    setSkillsFilter([]);
    setSkillInput('');
    setSkillDropdownOpen(false);
  }

  function addSkillFilter(skill: string) {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (skillsFilter.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
    setSkillsFilter((prev) => [...prev, trimmed]);
    setSkillInput('');
  }

  function removeSkillFilter(skill: string) {
    setSkillsFilter((prev) => prev.filter((s) => s !== skill));
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { profiles: data } = await talentApi.listProfiles();
        setProfiles(data);

        const token = getCookie(AUTH_COOKIE_NAME);
        if (token) {
          try {
            const { favorites } = await enterprisesApi.getFavorites(token);
            setSavedIds(new Set(favorites.map((f) => f.id)));
          } catch {
            // Si falla la carga de favoritos, ignorar
          }
        }
      } catch (err) {
        console.error('Error al cargar candidatos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function toggleFavorite(profileId: string) {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (!token) return;
    try {
      if (savedIds.has(profileId)) {
        await enterprisesApi.removeFavorite(token, profileId);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(profileId);
          return next;
        });
      } else {
        await enterprisesApi.addFavorite(token, profileId);
        setSavedIds((prev) => new Set(prev).add(profileId));
      }
    } catch (err) {
      console.error('Error al guardar favorito:', err);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */ }
      <Header sidebarOpen={ sidebarOpen } setSidebarOpen={ setSidebarOpen } />

      <div className="flex flex-col lg:flex-row relative">
        {/* Mobile backdrop */ }
        { sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={ () => setSidebarOpen(false) }
          />
        ) }

        {/* Sidebar */ }
        <aside
          className={ `
            fixed inset-y-0 left-0 z-40 w-72 bg-[#F9FAFB] border-r border-[#e5e5e5] p-6
            overflow-y-auto transform transition-transform duration-200
            lg:static lg:inset-auto lg:z-auto lg:w-2xs lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <span className="text-sm font-semibold text-[#1a1a2e]">
              Filtros
            </span>
            <button
              onClick={ () => setSidebarOpen(false) }
              className="p-1 text-[#6B7280]"
              aria-label="Cerrar filtros"
            >
              <X size={ 20 } />
            </button>
          </div>
          <div className="flex flex-col gap-1 mb-6 lg:hidden">
            <HeaderNav />
          </div>
          <div className="space-y-6">
            {/* Search */ }
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-[#1a1a2e] uppercase">
                  Filtros
                </h3>
                <button
                  onClick={ clearFilters }
                  className="text-xs text-[#374151] hover:text-[#4f46e5]/80 cursor-pointer"
                >
                  Limpiar
                </button>
              </div>
              <Input
                placeholder="Nombre, rol, ubicación..."
                value={ search }
                onChange={ (e) => setSearch(e.target.value) }
                className="p-3 text-sm rounded-md border-[#D1D5DB] bg-white"
              />
            </div>

            {/* Stack */ }
            <SidebarSection title="Stack">
              <div className="flex flex-wrap gap-2 mb-2">
                { skillsFilter.map((skill) => (
                  <SkillBadge
                    key={ skill }
                    variant="filter"
                    onRemove={ () => removeSkillFilter(skill) }
                  >
                    { skill }
                  </SkillBadge>
                )) }
              </div>
              <div className="relative">
                <input
                  value={ skillInput }
                  onChange={ (e) => { setSkillInput(e.target.value); setSkillDropdownOpen(true); } }
                  onFocus={ () => setSkillDropdownOpen(true) }
                  onBlur={ () => setTimeout(() => setSkillDropdownOpen(false), 150) }
                  onKeyDown={ (e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (suggestedSkills[0]) addSkillFilter(suggestedSkills[0]);
                      else addSkillFilter(skillInput);
                      setSkillDropdownOpen(false);
                    }
                    if (e.key === 'Escape') setSkillDropdownOpen(false);
                  } }
                  placeholder="Buscar skill..."
                  className="text-xs border-b-2 border-b-[#e5e5e5] rounded w-full p-2 focus:border-b-[#4f46e5] focus:outline-none bg-transparent"
                />
                { skillDropdownOpen && suggestedSkills.length > 0 && (
                  <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-md shadow-md max-h-48 overflow-y-auto">
                    { suggestedSkills.map((skill) => (
                      <li
                        key={ skill }
                        className="px-3 py-2 text-xs text-[#1a1a2e] cursor-pointer hover:bg-[#EEF2FF] hover:text-[#4f46e5]"
                        onMouseDown={ (e) => {
                          e.preventDefault();
                          addSkillFilter(skill);
                          setSkillDropdownOpen(false);
                        } }
                      >
                        { skill }
                      </li>
                    )) }
                  </ul>
                ) }
              </div>
            </SidebarSection>

            {/* Availability */ }
            <SidebarSection title="Disponibilidad">
              <RadioGroup
                name="availability"
                options={ mockAvailability.options }
                value={ availability }
                onChange={ setAvailability }
              />
            </SidebarSection>

            {/* Experience */ }
            <SidebarSection title="Años de experiencia">
              <div className="space-y-2">
                <div className="flex justify-between text-[#4B5563] text-xs">
                  <span>{ experienceRange[0] }</span>
                  <span>{ experienceRange[1] >= 30 ? '30+' : experienceRange[1] }</span>
                </div>
                <Slider
                  value={ experienceRange }
                  onValueChange={ (v) => setExperienceRange(v as [number, number]) }
                  min={ 0 }
                  max={ 30 }
                  step={ 1 }
                  className="max-auto w-full max-w-xs **:data-[slot=slider-range]:bg-[#4F46E5] **:data-[slot=slider-track]:bg-[#E5E7EB]"
                />
                <p className="text-xs text-[#999]">
                  { experienceRange[0] } – { experienceRange[1] >= 30 ? '30+' : experienceRange[1] } años
                </p>
              </div>
            </SidebarSection>
          </div>
        </aside>

        {/* Main Content */ }
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="space-y-6">
            {/* Header Section */ }
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <Button
                  onClick={ () => setSidebarOpen(true) }
                  className="lg:hidden text-xs border border-[#D1D5DB] text-[#4B5563] bg-white px-3 py-1.5 rounded-md"
                >
                  <Menu size={ 14 } className="mr-1" /> Filtrar
                </Button>
                <h1 className="text-2xl font-bold text-[#1a1a2e]">
                  Candidatos
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-[#666]">
                  { filteredProfiles.length } candidato{ filteredProfiles.length !== 1 ? 's' : '' } encontrado{ filteredProfiles.length !== 1 ? 's' : '' }
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#F3F4F6] rounded-full p-1 gap-1 border border-[#E5E7EB]">
                    <Button
                      onClick={ () => setViewMode('cards') }
                      // variant={viewMode === 'cards' ? 'default' : 'outline'}
                      // size="sm"
                      // className={`text-xs ${viewMode === 'cards' ? 'bg-[#1a1a2e] text-white' : ''}`}
                      className={ `px-5 py-1 h-8 text-xs rounded-full cursor-pointer transition-all ${viewMode === 'cards'
                        ? 'bg-[#111827] text-white font-medium hover:bg-[#111827]'
                        : 'bg-transparent text-[#4B5563] hover:text-gray-700 hover:bg-transparent'
                        }` }
                    >
                      Cards
                    </Button>
                    <Button
                      onClick={ () => setViewMode('tabla') }
                      // variant={viewMode === 'tabla' ? 'default' : 'outline'}
                      // size="sm"
                      // className={`text-xs ${viewMode === 'tabla' ? 'bg-[#1a1a2e] text-white' : ''}`}
                      className={ `px-5 py-1 h-8 text-xs rounded-full cursor-pointer transition-all ${viewMode === 'tabla'
                        ? 'bg-[#111827] text-white font-medium hover:bg-[#111827]'
                        : 'bg-transparent text-[#4B5563] hover:text-gray-700 hover:bg-transparent'
                        }` }
                    >
                      Tabla
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-0 bg-transparent shadow-none cursor-pointer"
                  >
                    Más relevantes <MoveDown />
                  </Button>
                </div>
              </div>
            </div>

            {/* Candidates Grid */ }
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              { loading && (
                <p className="text-sm text-[#666] col-span-2">Cargando candidatos...</p>
              ) }
              { !loading && filteredProfiles.length === 0 && (
                <p className="text-sm text-[#666] col-span-2">
                  { profiles.length === 0 ? 'No hay candidatos disponibles.' : 'Ningún candidato coincide con los filtros.' }
                </p>
              ) }
              { filteredProfiles.map((profile) => {
                const name = getDisplayName(profile);
                const initials = getInitials(profile.User?.first_name, profile.User?.last_name);
                const role = profile.Talent_Role?.[0]?.role_name ?? null;
                const availability = profile.availability
                  ? AVAILABILITY_LABELS[profile.availability] ?? profile.availability
                  : null;
                const isSaved = savedIds.has(profile.id);
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
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-[#1a1a2e]">{ name }</h3>
                            { role && <p className="text-sm text-[#666]">{ role }</p> }
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs text-[#6B7280] italic">
                            Sin reseñas aún
                          </span>
                        </div>
                      </div>
                    </div>

                    { profile.experience_years && (
                      <p className="text-xs text-[#666] mb-3">
                        { profile.experience_years } años de experiencia
                      </p>
                    ) }
                    { profile.location && (
                      <p className="text-xs text-[#999] mb-3">{ profile.location }</p>
                    ) }

                    { availability && (
                      <div className="flex items-center gap-1 text-sm text-[#00aa44] font-medium mb-4">
                        <div className="w-2 h-2 bg-[#00aa44] rounded-full"></div>
                        { availability }
                      </div>
                    ) }

                    <div className="flex gap-2">
                      <Button
                        onClick={ () => router.push(`/dashboard/company/candidate?id=${profile.id}`) }
                        className="flex-1 bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-sm h-8"
                      >
                        Ver perfil completo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={ `h-8 w-30 ${isSaved ? 'text-[#4f46e5] border-[#4f46e5]' : 'text-black'}` }
                        onClick={ () => toggleFavorite(profile.id) }
                      >
                        <Heart size={ 18 } className={ isSaved ? 'fill-[#4f46e5]' : '' } />
                        <span className="hidden sm:inline">
                          { isSaved ? 'Guardado' : 'Guardar' }
                        </span>
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
