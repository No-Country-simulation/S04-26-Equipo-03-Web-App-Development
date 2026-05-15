'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '../common/header';
import { useState } from 'react';
import {
  mockExperience,
  mockProfileCandidate,
  mockReviews,
  mockSkills,
} from './_data';
import SkillPill from '@/components/common/SkillPill';
import ReviewCard from '../common/ReviewCard';
import CardSection from '@/components/common/CardSection';
import CandidateHeader from './_components/CandidateHeader';
import ExperienceItem from './_components/ExperienceItem';
import ProfileSidebar from './_components/ProfileSidebar';
import RatingDisplay from '../common/RatingDisplay';
import { Skeleton } from '@/components/ui/skeleton';

export default function CandidateProfile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-sm text-[#1a1a2e] mb-4 sm:mb-6 hover:opacity-80"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver al dashboard
        </Link>

        <div className="lg:grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Header */}
            <CandidateHeader candidate={mockProfileCandidate} />

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
                  <ExperienceItem
                    key={i}
                    title={exp.title}
                    company={exp.company}
                  />
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

          {/* Right Sidebar — Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <ProfileSidebar />
          </div>
        </div>

        {/* Mobile Drawer — Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
              <ProfileSidebar />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
