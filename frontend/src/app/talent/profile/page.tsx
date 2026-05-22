'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  // Check,
  MessageCircle,
  Download,
  Upload,
  Eye,
  // AlertCircle,
} from 'lucide-react';
import ProfileHeader from './ProfileHeader';
import CardSection from '@/components/common/CardSection';
import { mockReviews, mockSkills } from './_data';
import SkillBadge from '@/components/common/SkillBadge';
import RatingDisplay from '@/app/talent/profile/RatingDisplay';
import { ReviewCard } from '@/components/talent/profile/ReviewCard';
import RatingStars from '@/components/common/RatingStars';

export default function TalentProfile() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <ProfileHeader />

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">
              70% completado — completa tu perfil para recibir 3+ más visitas
            </span>
            <Button className="bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-sm h-8">
              Continuar
            </Button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#4f46e5] h-2 rounded-full"
              style={{ width: '70%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center text-gray-600 font-bold">
                    MR
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Marcela Rivero
                    </h1>
                    <p className="text-gray-600">
                      Product Designer · Buenos Aires, AR
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-green-500 font-semibold">
                        Open to work · Remoto
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="text-sm">
                    Editar perfil
                  </Button>
                  <Button variant="outline" className="text-sm">
                    Ver como reclutador
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <SkillBadge variant="level">Semi-Senior</SkillBadge>
                <RatingDisplay stars={4.7} />
                <span className="text-sm text-gray-600">4.7 (8)</span>
              </div>

              <p className="text-xs text-gray-500 mt-4 flex justify-between">
                <span className="italic">
                  Basado en tus skills validados, tu perfil corresponde a{' '}
                  <strong>Semi-Senior.</strong>
                </span>
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <span className="flex items-center gap-1 font-bold">
                    <Eye className="w-3.5 h-3.5" />
                    12 reclutadores
                  </span>
                  vieron tu perfil esta semana
                </span>
              </p>
            </div>

            {/* Resumen */}
            <CardSection
              title="Resumen"
              description="12 años diseñando productos digitales para fintech y ecommerce. Especializada en design systems, research y mentoring de equipos junior. Buscando roles senior en producto con foco en impacto."
            />

            {/* Skills */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Skills</h2>
                <a href="#" className="text-sm text-[#4f46e5] font-medium">
                  Validar más skills
                </a>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Validadas en verde. Declaradas pendientes en gris — no afectan
                la visibilidad para muchos reclutadores filtran por
                verificación.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {mockSkills.map((skill) => {
                  if (skill.level === 'pendiente')
                    return (
                      <SkillBadge key={skill.name} variant="pending">
                        {skill.name}
                      </SkillBadge>
                    );
                  return (
                    <SkillBadge key={skill.name} variant="verified">
                      {skill.name} · {skill.level}
                    </SkillBadge>
                  );
                })}
              </div>

              <p className="text-xs text-gray-600 flex items-center gap-1">
                5 de 8 skills validadas. Valida las 3 restantes para desbloquear
                el badge <SkillBadge variant="star">100% verificado</SkillBadge>
              </p>
            </div>

            {/* Reseñas */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Reseñas</h2>
                  <p className="text-xs text-gray-500">habilidades blandas</p>
                </div>
                <a href="#" className="text-sm text-[#4f46e5] font-medium">
                  + Solicitar reseña
                </a>
              </div>

              <div className="flex items-center gap-4 mb-6 mt-6 border-b border-[#E5E7EB] pb-4">
                <div className="text-4xl font-bold text-[#1a1a2e]">4.7</div>
                <RatingDisplay
                  stars={5}
                  label="Promedio sobre 8 reseñas verificadas"
                />
              </div>

              <div className="space-y-4">
                {mockReviews.map((item, i) => (
                  <ReviewCard
                    key={i}
                    name={item.author}
                    rating={item.ratin}
                    text={item.review}
                    source={item.role}
                    company={item.company}
                    status={item.status as 'verified' | 'pending' | 'reported'}
                  />
                ))}
              </div>
            </div>

            {/* Experiencia */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Experiencia</h2>
                <a href="#" className="text-sm text-[#4f46e5] font-medium">
                  + Agregar
                </a>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="font-semibold text-gray-900">
                    Sr Product Designer
                  </p>
                  <p className="text-xs text-gray-500">
                    Empresa A · 2023 – Presente
                  </p>
                  <div className="mt-2 h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Product Designer
                  </p>
                  <p className="text-xs text-gray-500">
                    Empresa B · 2022 – 2023
                  </p>
                  <div className="mt-2 h-2 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">UX Designer</p>
                  <p className="text-xs text-gray-500">
                    Empresa C · 2020 – 2022
                  </p>
                  <div className="mt-2 h-2 bg-gray-200 rounded w-3/5"></div>
                </div>
              </div>
            </div>

            {/* Educación */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Educación</h2>
                <a href="#" className="text-sm text-[#4f46e5] font-medium">
                  + Agregar
                </a>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Lic. en Diseño Gráfico
                </p>
                <p className="text-xs text-gray-500">UBA · 2008</p>
              </div>
            </div>

            {/* Portfolio */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Portfolio
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="aspect-square bg-gray-200 rounded flex items-center justify-center text-gray-500">
                  1
                </div>
                <div className="aspect-square bg-gray-200 rounded flex items-center justify-center text-gray-500">
                  2
                </div>
                <div className="aspect-square bg-gray-200 rounded flex items-center justify-center text-gray-500">
                  3
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Insignia Card */}
              <Card className="bg-gray-900 text-white border-0 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="text-xs font-bold text-yellow-400 uppercase">
                      Insignia verificada
                    </p>
                    <p className="text-sm font-semibold">
                      Valida 3 skills más para desbloquear
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-300 mb-4">
                  &quot;Todas las skills verificadas&quot; aumenta tu
                  visibilidad — los reclutadores pueden filtrar por este badge.
                </p>
                <Button className="w-full bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-sm h-9">
                  Validar skills
                </Button>
              </Card>

              {/* Ruta de Aprendizaje */}
              <Card className="border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-3">
                  TU RUTA DE APRENDIZAJE
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">35%</span>
                      <span className="text-xs text-gray-500">
                        7 de 20 hitos
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#4f46e5] h-2 rounded-full"
                        style={{ width: '35%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900 mb-1">
                      Próximo paso:
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      Design tokens y theming
                    </p>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-sm h-9">
                  Continuar mi ruta →
                </Button>
              </Card>

              {/* CV Adjunto */}
              <Card className="border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-3">
                  CV ADJUNTO
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">marcela_rivero_cv.pdf</span>
                    <span className="text-xs text-gray-500">324 KB</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 text-sm h-8 gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-sm h-8 gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Reemplazar
                    </Button>
                  </div>
                </div>
              </Card>

              {/* IA Feedback */}
              <Card className="border border-blue-200 bg-blue-50 p-4">
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
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
