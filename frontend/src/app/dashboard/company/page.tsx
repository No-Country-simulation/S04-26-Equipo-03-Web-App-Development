'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Star } from 'lucide-react';
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
    skills: ['React', 'TypeScript'],
    pendingSkills: ['Next.js'],
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
    skills: ['Roadmaps', 'Analytics'],
    pendingSkills: ['Jira'],
    status: 'Open to work · Remoto',
    experience: '9 años exp.',
    avatar: 'DA',
  },
];

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'cards' | 'tabla'>('cards');

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Header */}
      <header className="bg-white border-b border-[#e5e5e5]">
        <div className="flex items-center justify-between px-8 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1a1a2e] rounded-sm flex items-center justify-center text-white text-xs font-bold">
              TB
            </div>
            <span className="font-semibold text-[#1a1a2e]">TalentBridge</span>
          </Link>
          <nav className="flex items-center gap-8">
            <button className="text-sm text-[#4f46e5] font-medium">
              Candidatos
            </button>
            <button className="text-sm text-[#1a1a2e]">Mis guardados</button>
            <button className="text-sm text-[#1a1a2e]">Mis posiciones</button>
            <button className="text-sm text-[#1a1a2e]">MR</button>
          </nav>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-[#e5e5e5] p-6">
          <div className="space-y-6">
            {/* Search */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-[#1a1a2e] uppercase">
                  Filtros
                </h3>
                <button className="text-xs text-[#4f46e5] hover:text-[#4f46e5]/80">
                  Limpiar
                </button>
              </div>
              <Input
                placeholder="Nombre, rol, skill..."
                className="h-9 text-sm border-[#e5e5e5]"
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
              <p className="text-xs text-[#999] mt-2">
                Requiero verificado en:
              </p>
              <div className="flex gap-2 mt-2">
                <Badge
                  variant="outline"
                  className="text-xs bg-[#f0f0f0] border-[#e5e5e5]"
                >
                  Figma <span className="ml-1 cursor-pointer">×</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-[#f0f0f0] border-[#e5e5e5]"
                >
                  React <span className="ml-1 cursor-pointer">×</span>
                </Badge>
              </div>
              <button className="text-xs text-[#4f46e5] mt-2">+ skill</button>
            </div>

            {/* Min Rating */}
            <div>
              <h3 className="text-xs font-semibold text-[#1a1a2e] uppercase mb-3">
                Calificación mínima
              </h3>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-[#ffc107] text-[#ffc107]"
                  />
                ))}
              </div>
              <p className="text-xs text-[#999] mt-2">4+ estrellas</p>
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
                  className="text-xs bg-[#f0f0f0] border-[#e5e5e5]"
                >
                  Figma <span className="ml-1 cursor-pointer">×</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-[#f0f0f0] border-[#e5e5e5]"
                >
                  React <span className="ml-1 cursor-pointer">×</span>
                </Badge>
              </div>
              <input
                placeholder="Agregar stack..."
                className="text-xs border border-[#e5e5e5] rounded w-full p-2"
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
                <input
                  type="range"
                  min="0"
                  max="20"
                  defaultValue="5"
                  className="w-full"
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
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">
                Candidatos
              </h1>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#666]">47 candidatos encontrados</p>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setViewMode('cards')}
                    variant={viewMode === 'cards' ? 'default' : 'outline'}
                    size="sm"
                    className={`text-xs ${viewMode === 'cards' ? 'bg-[#1a1a2e] text-white' : ''}`}
                  >
                    Cards
                  </Button>
                  <Button
                    onClick={() => setViewMode('tabla')}
                    variant={viewMode === 'tabla' ? 'default' : 'outline'}
                    size="sm"
                    className={`text-xs ${viewMode === 'tabla' ? 'bg-[#1a1a2e] text-white' : ''}`}
                  >
                    Tabla
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    Más relevantes ↓
                  </Button>
                </div>
              </div>
            </div>

            {/* Candidates Grid */}
            <div className="grid grid-cols-2 gap-6">
              {candidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  className="p-6 border-[#e5e5e5] hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4 mb-4">
                    <Avatar className="w-12 h-12 bg-[#e5e5e5] flex items-center justify-center">
                      <AvatarFallback className="text-sm font-semibold text-[#666]">
                        {candidate.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-[#1a1a2e]">
                            {candidate.name}
                          </h3>
                          <p className="text-sm text-[#666]">
                            {candidate.role}
                          </p>
                        </div>
                        {candidate.verified && (
                          <Badge className="bg-[#1a1a2e] text-white text-xs">
                            100% verificado
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {candidate.rating > 0 && (
                          <>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
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
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-[#4f46e5] text-white text-xs">
                      ✓ {candidate.level}
                    </Badge>
                    {candidate.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-xs border-[#4f46e5] text-[#4f46e5] bg-white"
                      >
                        ✓ {skill}
                      </Badge>
                    ))}
                    {candidate.pendingSkills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-xs border-[#999] text-[#999] bg-white"
                      >
                        {skill}
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
                    <Button className="flex-1 bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-sm h-10">
                      Ver perfil completo
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#666]">
                      <Heart size={18} />
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
