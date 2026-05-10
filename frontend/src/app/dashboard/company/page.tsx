'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import {
  Astroid,
  Check,
  Diamond,
  Heart,
  MoveDown,
  Plus,
  Star,
  X,
} from 'lucide-react';
import { useState } from 'react';

const candidates = [
  {
    id: 1,
    name: 'Marcela R.',
    role: 'Product Designer',
    rating: 4.7,
    level: 'Semi-Senior',
    skills: ['Figma', 'Research'],
    pendingSkills: ['Design Sys'],
    status: 'Open to work · Remoto',
    experience: '12 años exp. · Último: Sr Designer en —',
    avatar: 'MR',
  },
  {
    id: 2,
    name: 'Hernán T.',
    role: 'Frontend Engineer',
    rating: 4.9,
    level: 'Senior',
    verified: true,
    skills: ['React', 'TypeScript', 'Next.js'],
    pendingSkills: [],
    status: 'Open to work · Remoto',
    experience: '14 años exp. · Último: Tech Lead en —',
    avatar: 'HT',
  },
  {
    id: 3,
    name: 'Lucia F.',
    role: 'UX Researcher',
    rating: 4.5,
    level: 'Senior',
    skills: ['Mixed methods', 'Figma'],
    pendingSkills: ['SQL'],
    status: 'Open to work · Remoto',
    experience: '10 años exp.',
    avatar: 'LF',
  },
  {
    id: 4,
    name: 'Diego A.',
    role: 'Product Manager',
    rating: 0,
    level: 'Semi-Senior',
    skills: ['Roadmaps'],
    pendingSkills: ['Analytics', 'Jira'],
    status: 'Open to work · Remoto',
    experience: '9 años exp.',
    avatar: 'DA',
  },
];

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'cards' | 'tabla'>('cards');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[#e5e5e5]">
        <div className="flex items-center justify-between px-8 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1a1a2e] rounded-sm flex items-center justify-center text-white text-xs font-bold">
              TB
            </div>
            <span className="font-semibold text-[#1a1a2e]">TalentBridge</span>
          </Link>
          <nav className="flex items-center gap-1">
            <button className="text-sm text-[#4f46e5] bg-[#EEF2FF] font-normal px-4 py-2 rounded-md">
              Candidatos
            </button>
            <button className="text-sm text-[#1a1a2e] font-normal px-4 py-2 rounded-md">
              Mis guardados
            </button>
            <button className="text-sm text-[#1a1a2e] font-normal px-4 py-2 rounded-md">
              Mis posiciones
            </button>
            <button className="text-sm text-[#1a1a2e] bg-[#E5E7EB] rounded-full p-2">
              MR
            </button>
          </nav>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-2xs bg-[#F9FAFB] border-r border-[#e5e5e5] p-6">
          <div className="space-y-6">
            {/* Search */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-[#1a1a2e] uppercase">
                  Filtros
                </h3>
                <button className="text-xs text-[#374151] hover:text-[#4f46e5]/80 cursor-pointer">
                  Limpiar
                </button>
              </div>
              <Input
                placeholder="Nombre, rol, skill..."
                className="p-3 text-sm rounded-md border-[#D1D5DB] bg-white"
              />
            </div>

            {/* Verification */}
            <div>
              <h3 className="text-xs font-semibold text-[#1a1a2e] uppercase mb-3">
                Verificación
              </h3>
              <label className="flex items-center gap-2 text-sm text-[#1a1a2e]">
                <Checkbox />
                Solo 100% verificados
              </label>
              <div className="p-2 border border-dashed rounded-md bg-white mt-2">
                <p className="text-xs text-[#999] mt-2">
                  Requiero verificado en:
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className="text-xs bg-[#EEF2FF] border-[#C7D2FE] text-[#4F46E5] p-2"
                  >
                    Figma{' '}
                    <X className="color-[#6B7280] cursor-pointer" size={16} />
                    {/* <span className="ml-1 cursor-pointer">×</span> */}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs bg-[#EEF2FF] border-[#C7D2FE] text-[#4F46E5] p-2"
                  >
                    React{' '}
                    <X className="color-[#6B7280] cursor-pointer" size={16} />
                    {/* <span className="ml-1 cursor-pointer">×</span> */}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  className="bg-[#F3F4F6] text-xs text-[#6B7280] mt-2 border border-[#E5E7EB] rounded-full cursor-pointer"
                >
                  <Plus size={16} /> skill
                </Button>
              </div>
            </div>

            {/* Min Rating */}
            <div>
              <h3 className="text-xs font-semibold text-[#1a1a2e] uppercase mb-3">
                Calificación mínima
              </h3>
              <div className="flex items-center gap-1">
                {[...Array(4)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-[#ffc107] text-[#ffc107]"
                  />
                ))}
                {[...Array(1)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-white text-[#D1D5DB] hover:fill-[#D1D5DB]"
                  />
                ))}
                <p className="text-xs text-[#999] ml-2">4+ estrellas</p>
              </div>
              <p className="text-xs text-[#999]">
                No excluye candidatos sin reseñas.
              </p>
            </div>

            {/* Stack */}
            <div>
              <h3 className="text-xs font-semibold text-[#1a1a2e] uppercase mb-3">
                Stack
              </h3>
              <div className="flex gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="text-xs bg-[#EEF2FF] border-[#C7D2FE] text-[#4F46E5] p-2"
                >
                  Figma{' '}
                  <X className="color-[#6B7280] cursor-pointer" size={16} />
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-[#EEF2FF] border-[#C7D2FE] text-[#4F46E5] p-2"
                >
                  React{' '}
                  <X className="color-[#6B7280] cursor-pointer" size={16} />
                </Badge>
              </div>
              <input
                placeholder="Agregar stack..."
                className="text-xs border-b-2 border-b-transparent rounded w-full p-2 focus:border-b-[#e5e5e5] focus:outline-none"
              />
            </div>

            {/* Level */}
            <div>
              <h3 className="text-xs font-semibold text-[#1a1a2e] uppercase mb-3">
                Nivel validado
              </h3>
              <div className="space-y-2">
                {['Trainee', 'Junior', 'Semi-Senior', 'Senior', 'Lead'].map(
                  (level) => (
                    <label
                      key={level}
                      className="flex items-center gap-2 text-sm text-[#1a1a2e]"
                    >
                      <Checkbox
                        className="data-[state=checked]:bg-[#4f46e5] data-[state=checked]:border-[#4f46e5]"
                        defaultChecked={[
                          'Semi-Senior',
                          'Senior',
                          'Lead',
                        ].includes(level)}
                      />
                      {level}
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-xs font-semibold text-[#1a1a2e] uppercase mb-3">
                Disponibilidad
              </h3>
              <div className="space-y-2">
                {[
                  'Cualquiera',
                  'Disponible activamente',
                  'Abierto a oportunidades',
                ].map((avail) => (
                  <label
                    key={avail}
                    className="flex items-center gap-2 text-sm text-[#1a1a2e]"
                  >
                    <input
                      type="radio"
                      name="availability"
                      defaultChecked={avail === 'Disponible activamente'}
                      className="accent-[#4F46E5]"
                    />
                    {avail}
                  </label>
                ))}
              </div>
            </div>

            {/* Modality */}
            <div>
              <h3 className="text-xs font-semibold text-[#1a1a2e] uppercase mb-3">
                Modalidad
              </h3>
              <div className="space-y-2">
                {['Remoto', 'Híbrido', 'Presencial'].map((mode) => (
                  <label
                    key={mode}
                    className="flex items-center gap-2 text-sm text-[#1a1a2e]"
                  >
                    <Checkbox
                      className="data-[state=checked]:bg-[#4f46e5] data-[state=checked]:border-[#4f46e5]"
                      defaultChecked={['Remoto', 'Híbrido'].includes(mode)}
                    />
                    {mode}
                  </label>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-xs font-semibold text-[#1a1a2e] uppercase mb-3">
                Años de experiencia
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[#4B5563] text-xs">
                  <span>5</span>
                  <span>20+</span>
                </div>
                <Slider
                  defaultValue={[5, 20]}
                  min={0}
                  max={30}
                  step={1}
                  className="max-auto w-full max-w-xs **:data-[slot=slider-range]:bg-[#4F46E5] **:data-[slot=slider-track]:bg-[#E5E7EB]"
                  // para cambiar la perilla usar -> [&_[data-slot=slider-thumb]]:border-[#4F46E5]
                />
                <p className="text-xs text-[#999]">9 – 16 años</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">
                Candidatos
              </h1>
              <div className="flex gap-5 items-center justify-between">
                <p className="text-sm text-[#666]">47 candidatos encontrados</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#F3F4F6] rounded-full p-1 gap-1 border border-[#E5E7EB]">
                    <Button
                      onClick={() => setViewMode('cards')}
                      // variant={viewMode === 'cards' ? 'default' : 'outline'}
                      // size="sm"
                      // className={`text-xs ${viewMode === 'cards' ? 'bg-[#1a1a2e] text-white' : ''}`}
                      className={`px-5 py-1 text-xs rounded-full cursor-pointer transition-all ${
                        viewMode === 'cards'
                          ? 'bg-[#111827] text-white font-medium hover:bg-[#111827]'
                          : 'bg-transparent text-[#4B5563] hover:text-gray-700 hover:bg-transparent'
                      }`}
                    >
                      Cards
                    </Button>
                    <Button
                      onClick={() => setViewMode('tabla')}
                      // variant={viewMode === 'tabla' ? 'default' : 'outline'}
                      // size="sm"
                      // className={`text-xs ${viewMode === 'tabla' ? 'bg-[#1a1a2e] text-white' : ''}`}
                      className={`px-5 py-1 text-xs rounded-full cursor-pointer transition-all ${
                        viewMode === 'tabla'
                          ? 'bg-[#111827] text-white font-medium hover:bg-[#111827]'
                          : 'bg-transparent text-[#4B5563] hover:text-gray-700 hover:bg-transparent'
                      }`}
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

            {/* Candidates Grid */}
            <div className="grid grid-cols-2 gap-6">
              {candidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  className="p-6 border-[#e5e5e5] hover:shadow-lg transition-shadow gap-0"
                >
                  <div className="flex gap-4 mb-4 items-center">
                    <Avatar className="w-14 h-14 bg-[#e5e5e5] flex items-center justify-center">
                      <AvatarFallback className="text-sm font-semibold text-[#666]">
                        {candidate.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-[#1a1a2e]">
                            {candidate.name}
                            {candidate.verified && (
                              <Badge className="bg-[#1a1a2e] text-white text-xs ml-2 rounded-md">
                                <Astroid
                                  size={16}
                                  className="fill-[#FBBF24] text-[#FBBF24]"
                                />
                                100% verificado
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-[#666]">
                            {candidate.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {candidate.rating > 0 ? (
                          <>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={
                                  i < Math.ceil(candidate.rating)
                                    ? 'fill-[#ffc107] text-[#ffc107]'
                                    : 'text-[#ddd]'
                                }
                              />
                            ))}
                            <span className="text-xs text-[#666] ml-1">
                              {candidate.rating}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-[#6B7280]">
                            Sin reseñas aún
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-[#4f46e5] text-white text-xs py-2 rounded-md">
                      <Check className="text-white" /> {candidate.level}
                    </Badge>
                    {candidate.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-xs border-[#A7F3D0] text-[#065F46] bg-white"
                      >
                        <Check className="text-[#10B981]" /> {skill}
                      </Badge>
                    ))}
                    {candidate.pendingSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-xs text-[#4B5563] bg-white border-dashed border-[#D1D5DB]"
                      >
                        {skill}
                        <span className="ml-1 text-xs text-[#6B7280]">
                          pendiente
                        </span>
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-sm text-[#00aa44] font-medium mb-3">
                    <div className="w-2 h-2 bg-[#00aa44] rounded-full"></div>
                    {candidate.status}
                  </div>

                  <p className="text-xs text-[#666] mb-4">
                    {candidate.experience}
                  </p>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-sm h-8">
                      Ver perfil completo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-black h-8 w-30"
                    >
                      <Heart size={18} />
                      Guardar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
