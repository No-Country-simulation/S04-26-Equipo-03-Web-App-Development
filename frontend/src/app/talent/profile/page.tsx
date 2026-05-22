'use client';

import ProfileHeader from './ProfileHeader';
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

export default function TalentProfile() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <ProfileHeader />

      {/* Progress Bar */}
      <ProfileProgressBar />

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
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
              <ProfileInsigniaCard />

              {/* Ruta de Aprendizaje */}
              <ProfileLearningPath />

              {/* CV Adjunto */}
              <ProfileCVAttached />

              {/* IA Feedback */}
              {/* Esto ya no es necesario - por el momento se deja por si las moscas quieren ver */}
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
