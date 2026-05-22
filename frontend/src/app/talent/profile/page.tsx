'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageCircle, Download, Upload } from 'lucide-react';
import ProfileHeader from './ProfileHeader';
import CardSection from '@/components/common/CardSection';
import ProfileExperience from './ProfileExperience';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileProgressBar from './ProfileProgressBar';
import ProfileDataBase from './ProfileDataBase';
import ProfileSkills from './ProfileSkills';
import ProfileReviews from './ProfileReviews';
import ProfileEducation from './ProfileEducation';
import ProfilePortfolio from './ProfilePortfolio';

export default function TalentProfile() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <ProfileHeader />

      {/* Progress Bar */}
      <ProfileProgressBar />

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <ProfileDataBase />

            {/* Resumen */}
            <CardSection
              title="Resumen"
              description="12 años diseñando productos digitales para fintech y ecommerce. Especializada en design systems, research y mentoring de equipos junior. Buscando roles senior en producto con foco en impacto."
            />

            {/* Skills */}
            <ProfileSkills />

            {/* Reseñas */}
            <ProfileReviews />

            {/* Experiencia */}
            <ProfileExperience />

            {/* Educación */}
            <ProfileEducation />

            {/* Portfolio */}
            <ProfilePortfolio />
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
