'use client';
import CrutySection from '@/components/landing/CrutySection';
import CtaSection from '@/components/landing/CtaSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import HowItWorks from '@/components/landing/HowItWorks';
import StatsSection from '@/components/landing/StatsSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Viewport Container */}
      {<Header />}

      {/* Cómo funciona */}
      {<HowItWorks />}

      {/* Stats */}
      {<StatsSection />}

      {/* Qué nos hace distintos */}
      {<FeaturesSection />}

      {/* Conocé a Cruty */}
      {<CrutySection />}

      {/* CTA Section */}
      {<CtaSection />}

      {/* Footer */}
      {<Footer />}
    </div>
  );
}
