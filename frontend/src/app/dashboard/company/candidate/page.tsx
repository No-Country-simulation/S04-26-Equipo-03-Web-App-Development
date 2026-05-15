'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ChevronLeft, Download } from 'lucide-react';
import Link from 'next/link';
import Header from '../common/header';
import { useState } from 'react';
import SkillBadge from '@/components/common/SkillBadge';
import { Badge } from '@/components/ui/badge';
import RatingDisplay from '../common/RatingDisplay';
import { mockExperience, mockReviews, mockSkills } from './_data';
import SkillPill from '@/components/common/SkillPill';
import ReviewCard from '../common/ReviewCard';
import { Skeleton } from '@/components/ui/skeleton';
import CardSection from '@/components/common/CardSection';

export default function CandidateProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-sm text-[#1a1a2e] mb-6 hover:opacity-80"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver al dashboard
        </Link>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Candidate Header */}
            <Card className="p-6 border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-[#1a1a2e] font-bold text-lg">
                  MR
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-[#1a1a2e]">
                    Marcela Rivero
                  </h1>
                  <p className="text-sm text-gray-600">
                    Product Designer · Buenos Aires, AR
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">
                      Open to work · Remoto
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <SkillBadge variant="level">Semi-Senior</SkillBadge>
                    <RatingDisplay stars={4} label="4.7 (8)" />
                    <SkillBadge variant="star">100% verificado</SkillBadge>
                    <Badge className="bg-[#F3F4F6] text-xs text-[#6B7280] mt-2 border border-[#E5E7EB] rounded-full">
                      12 años exp.
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Skills */}
            <CardSection
              title="Skills"
              description="Click en una skill para ver el detalle de la validación."
            >
              <div className="flex flex-wrap gap-2 mt-6">
                {mockSkills.map((skill) => (
                  <SkillPill
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    count={skill.count}
                  />
                ))}
              </div>
            </CardSection>

            {/* Reviews */}
            <CardSection title="Reseñas" description="Reseñas">
              <div className="flex items-baseline gap-4 mb-2 mt-6">
                <div className="text-4xl font-bold text-[#1a1a2e]">4.7</div>
                <RatingDisplay stars={5} label="8 reseñas verificadas" />
              </div>
              <div className="space-y-4">
                {mockReviews.map((item, i) => (
                  <ReviewCard
                    key={i}
                    author={item.author}
                    company={item.company}
                    role={item.role}
                    rating={5}
                    review={item.review}
                  />
                ))}
              </div>
            </CardSection>

            {/* Resume */}
            <CardSection
              title="Resumen"
              description="12 años diseñando productos digitales para fintech y
                  ecommerce. Especializada en design systems, research y
                  mentoring de equipos junior."
            />

            {/* Experience */}
            <CardSection title="Experiencia">
              <div className="space-y-6 mt-6">
                {mockExperience.map((exp, i) => (
                  <div key={i} className="flex gap-3 pb-3 not-last:border-b">
                    <Skeleton className="bg-[#E5E7EB] h-10 w-10 rounded-md" />
                    <div className="w-full">
                      <h3 className="font-semibold text-[#1a1a2e] text-sm">
                        {exp.title}
                      </h3>
                      <p className="text-xs text-gray-600">{exp.company}</p>
                      <div className="space-y-2 mt-4">
                        <Skeleton className="bg-[#E5E7EB] h-3 w-full rounded-full" />
                        <Skeleton className="bg-[#E5E7EB] h-3 w-10/12 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardSection>

            {/* Education */}
            {/*
              OJO: Despues del h2 estaba el siguiente fragmento de codigo, no lo inclui ya que no se necesita para la vista de la compañia
              <a href="#" className="text-xs text-[#4f46e5] font-semibold">
                + Agregar
              </a>
            */}
            <CardSection title="Educación">
              <div className="mt-6">
                <h3 className="font-semibold text-sm text-[#1a1a2e]">
                  Lic. en Diseño Gráfico
                </h3>
                <p className="text-xs text-gray-600">UBA · 2008</p>
              </div>
            </CardSection>

            {/* Portfolio */}
            <CardSection title="Portfolio">
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    className="bg-[#E5E7EB] aspect-square rounded-lg flex items-center justify-center text-gray-500"
                  >
                    {i}
                  </Skeleton>
                ))}
              </div>
            </CardSection>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-1">
            <Card className="p-6 border-gray-200 sticky top-6">
              <Button className="w-full bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white font-semibold mb-4">
                Contactar
              </Button>
              <div className="flex gap-3 mb-6">
                <Button variant="outline" className="flex-1 border-gray-300">
                  <Heart className="w-4 h-4" />
                  Guardar
                </Button>
                <Button variant="outline" className="flex-1 border-gray-300">
                  Calificar
                </Button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-[#1a1a2e] mb-3">
                  PROGRESO EN SU RUTA
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-[#1a1a2e]">
                      35%
                    </span>
                    <span className="text-xs text-gray-600">
                      Está actualizando sus habilidades
                    </span>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#4f46e5] h-full w-[35%]"></div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-[#4f46e5] mb-4"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar CV
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
