import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import HeroSection from './HeroSection';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#1a1a2e] rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="font-semibold text-[#1a1a2e]">TalentBridge</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#"
            className="text-sm text-[#1a1a2e] hover:text-[#1a1a2e]/80"
          >
            Soy empresa
          </a>
          <Link
            href="/login"
            className="text-sm text-[#1a1a2e] hover:text-[#1a1a2e]/80"
          >
            Iniciar sesión
          </Link>
          <Button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm px-4 py-2 h-auto rounded-md">
            Crear cuenta
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-[#1a1a2e]"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden px-4 sm:px-6 pb-4 space-y-3">
          <a href="#" className="block text-sm text-[#1a1a2e] py-2">
            Soy empresa
          </a>
          <a href="#" className="block text-sm text-[#1a1a2e] py-2">
            Iniciar sesión
          </a>
          <Button className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm py-2.5 h-auto rounded-md">
            Crear cuenta
          </Button>
        </nav>
      )}

      {/* Hero Section */}
      {<HeroSection />}
    </div>
  );
}
