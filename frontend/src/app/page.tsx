'use client';
import CrutySection from '@/components/landing/CrutySection';
import CtaSection from '@/components/landing/CtaSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import StatsSection from '@/components/landing/StatsSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-dvh flex flex-col">
        <Header />
        <HeroSection />
      </div>

      <HowItWorks />
      <StatsSection />
      <FeaturesSection />
      <CrutySection />
      <CtaSection />
      <Footer />
    </div>
  );
}
