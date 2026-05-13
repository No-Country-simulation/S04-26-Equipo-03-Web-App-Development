'use client';

import Link from 'next/link';
import { Heart, Menu, MoveDown, Plus, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import SkillBadge from '@/components/common/SkillBadge';
import RatingStars from '@/components/common/RatingStars';
import CheckboxGroup from '@/components/common/CheckboxGroup';
import SidebarSection from '@/components/layout/SidebarSection';
import RadioGroup from '@/components/common/RadioGroup';
import { useState } from 'react';
import {
  mockAvailability,
  mockCandidates,
  mockLevel,
  mockModality,
} from './_data';
import Header from './common/header';

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<'cards' | 'tabla'>('cards');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {/* <header className="bg-white border-b border-[#e5e5e5]">
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1a1a2e] rounded-sm flex items-center justify-center text-white text-xs font-bold">
              TB
            </div>
            <span className="hidden sm:inline font-semibold text-[#1a1a2e]">
              TalentBridge
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Button className="text-sm text-[#4f46e5] bg-[#EEF2FF] font-normal px-4 py-2 rounded-md">
              Candidatos
            </Button>
            <Button className="text-sm text-[#1a1a2e] bg-white font-normal px-4 py-2 rounded-md">
              Mis guardados
            </Button>
            <Button className="text-sm text-[#1a1a2e] bg-white font-normal px-4 py-2 rounded-md">
              Mis posiciones
            </Button>
            <Button className="hidden sm:inline-flex text-sm text-[#1a1a2e] bg-[#E5E7EB] rounded-full p-2">
              MR
            </Button>
          </nav>
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-[#1a1a2e]"
            aria-label="Abrir filtros"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header> */}

      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-col lg:flex-row relative">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
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
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-[#6B7280]"
              aria-label="Cerrar filtros"
            >
              <X size={20} />
            </button>
          </div>
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
            <SidebarSection title="Verificación">
              <label className="flex items-center gap-2 text-sm text-[#1a1a2e]">
                <Checkbox />
                Solo 100% verificados
              </label>
              <div className="p-2 border border-dashed rounded-md bg-white mt-2">
                <p className="text-xs text-[#999] mt-2">
                  Requiero verificado en:
                </p>
                <div className="flex gap-2 mt-2">
                  <SkillBadge
                    variant="filter"
                    onRemove={() => console.log('remover')}
                  >
                    Figma
                  </SkillBadge>
                  <SkillBadge
                    variant="filter"
                    onRemove={() => console.log('remover')}
                  >
                    React
                  </SkillBadge>
                </div>
                <Button
                  variant="outline"
                  className="bg-[#F3F4F6] text-xs text-[#6B7280] mt-2 border border-[#E5E7EB] rounded-full cursor-pointer"
                >
                  <Plus size={16} /> skill
                </Button>
              </div>
            </SidebarSection>

            {/* Min Rating */}
            <SidebarSection title="Calificación mínima">
              {/*
                  ESTOS VALORES DEFINIRSE COMO ESTADO LOCAL O GLOBAL E IMPLEMENTAR EN RatingStars
                  value={minRating}
                  onChange={setMinRating}
                */}
              <RatingStars />
              <p className="text-xs text-[#999]">
                No excluye candidatos sin reseñas.
              </p>
            </SidebarSection>

            {/* Stack */}
            <SidebarSection title="Calificación mínima">
              <div className="flex gap-2 mb-2">
                <SkillBadge
                  variant="filter"
                  onRemove={() => console.log('remover')}
                >
                  Figma
                </SkillBadge>
                <SkillBadge
                  variant="filter"
                  onRemove={() => console.log('remover')}
                >
                  React
                </SkillBadge>
              </div>
              <input
                placeholder="Agregar stack..."
                className="text-xs border-b-2 border-b-transparent rounded w-full p-2 focus:border-b-[#e5e5e5] focus:outline-none"
              />
            </SidebarSection>

            {/* Level */}
            <SidebarSection title="Nivel validado">
              <CheckboxGroup
                options={mockLevel.level}
                defaultSelected={mockLevel.defaultSelected}
              />
            </SidebarSection>

            {/* Availability */}
            <SidebarSection title="Disponibilidad">
              <RadioGroup
                name="availability"
                options={mockAvailability.options}
                defaultValue={mockAvailability.defaultValue}
              />
            </SidebarSection>

            {/* Modality */}
            <SidebarSection title="Modalidad">
              <CheckboxGroup
                options={mockModality.modality}
                defaultSelected={mockModality.defaultSelected}
              />
            </SidebarSection>

            {/* Experience */}
            <SidebarSection title="Años de experiencia">
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
            </SidebarSection>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-xs border border-[#D1D5DB] text-[#4B5563] bg-white px-3 py-1.5 rounded-md"
                >
                  <Menu size={14} className="mr-1" /> Filtrar
                </Button>
                <h1 className="text-2xl font-bold text-[#1a1a2e]">
                  Candidatos
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-[#666]">47 candidatos encontrados</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#F3F4F6] rounded-full p-1 gap-1 border border-[#E5E7EB]">
                    <Button
                      onClick={() => setViewMode('cards')}
                      // variant={viewMode === 'cards' ? 'default' : 'outline'}
                      // size="sm"
                      // className={`text-xs ${viewMode === 'cards' ? 'bg-[#1a1a2e] text-white' : ''}`}
                      className={`px-5 py-1 h-8 text-xs rounded-full cursor-pointer transition-all ${
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
                      className={`px-5 py-1 h-8 text-xs rounded-full cursor-pointer transition-all ${
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {mockCandidates.map((candidate) => (
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
                              <SkillBadge variant="star">
                                100% verificado
                              </SkillBadge>
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
                          <span className="text-xs text-[#6B7280] italic">
                            Sin reseñas aún
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <SkillBadge variant="level">{candidate.level}</SkillBadge>
                    {candidate.skills.map((skill) => (
                      <SkillBadge key={skill} variant="verified">
                        {skill}
                      </SkillBadge>
                    ))}
                    {candidate.pendingSkills.map((skill) => (
                      <SkillBadge key={skill} variant="pending">
                        {skill}
                      </SkillBadge>
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
                      <span className="hidden sm:inline">Guardar</span>
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
