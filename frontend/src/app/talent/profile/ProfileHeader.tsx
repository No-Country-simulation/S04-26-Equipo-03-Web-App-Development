'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const ProfileHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    {
      label: 'Perfil',
      href: '#',
      active: true,
    },
    { label: 'Diagnóstico', href: '#' },
    { label: 'Mi ruta', href: '#' },
    { label: 'Notificaciones', href: '#', badge: 3 },
  ];

  return (
    <header className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded flex items-center justify-center">
            <span className="text-white text-xs sm:text-sm font-bold">TB</span>
          </div>
          <span className="font-bold text-base sm:text-lg">TalentBridge</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
            link.badge ? (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm flex items-center gap-1 ${link.active ? 'font-medium text-[#4f46e5] bg-[#EEF2FF] py-1.5 px-2.5 rounded-md' : 'text-gray-700'}`}
              >
                {link.label}
                <span className="bg-[#4f46e5] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {link.badge}
                </span>
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm ${link.active ? 'font-medium text-[#4f46e5] bg-[#EEF2FF] py-1.5 px-2.5 rounded-md' : 'text-gray-700'}`}
              >
                {link.label}
              </a>
            ),
          )}
          <span className="text-sm font-medium text-gray-700 bg-[#E5E7EB] py-1.5 px-2.5 rounded-full flex items-center justify-center">
            MR
          </span>
        </nav>

        {/* Mobile right section */}
        <div className="flex items-center gap-2 md:hidden">
          <span className="text-sm font-medium text-gray-700 bg-[#E5E7EB] p-1.5 rounded-full size-8 flex items-center justify-center">
            MR
          </span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-gray-700"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="mt-4 md:hidden space-y-2 border-t border-gray-100 pt-4">
          {navLinks.map((link) =>
            link.badge ? (
              <a
                key={link.label}
                href={link.href}
                className={`flex items-center justify-between text-sm py-2 px-2 rounded-md ${link.active ? 'font-medium text-[#4f46e5] bg-[#EEF2FF]' : 'text-gray-700'}`}
              >
                {link.label}
                <span className="bg-[#4f46e5] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {link.badge}
                </span>
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={`block text-sm py-2 px-2 rounded-md ${link.active ? 'font-medium text-[#4f46e5] bg-[#EEF2FF]' : 'text-gray-700'}`}
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
      )}
    </header>
  );
};
export default ProfileHeader;
