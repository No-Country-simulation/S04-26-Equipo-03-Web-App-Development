'use client';

import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { label: 'Perfil', href: '#' },
  { label: 'Diagnóstico', href: '#' },
  { label: 'Mi ruta', href: '#' },
  { label: 'Notificaciones', href: '#', active: true, badge: 3 },
];

const NotificationsHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-[#e5e7eb] bg-white px-4 sm:px-6 py-3 sm:py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-[#1a1a2e] text-sm font-bold text-white">
            T
          </div>
          <span className="text-base font-bold text-[#1a1a2e] sm:text-lg">
            TalentBridge
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) =>
            link.badge ? (
              <a
                key={link.label}
                href={link.href}
                className={`flex items-center gap-2 rounded-md p-2 text-sm ${
                  link.active
                    ? 'bg-[#EEF2FF] font-medium text-[#4F46E5]'
                    : 'text-[#1a1a2e] hover:text-[#1a1a2e]/80'
                }`}
              >
                {link.label}
                <span className="flex h-5 w-6 items-center justify-center rounded-full bg-[#4F46E5] text-xs font-bold text-white">
                  {link.badge}
                </span>
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={`rounded-md p-2 text-sm ${
                  link.active
                    ? 'bg-[#EEF2FF] font-medium text-[#4F46E5]'
                    : 'text-[#1a1a2e] hover:text-[#1a1a2e]/80'
                }`}
              >
                {link.label}
              </a>
            ),
          )}
          <span className="flex items-center justify-center rounded-full bg-[#E5E7EB] p-2 text-sm font-bold text-[#374151]">
            MR
          </span>
        </nav>

        {/* Mobile right section */}
        <div className="flex items-center gap-2 md:hidden">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#E5E7EB] p-1.5 text-sm font-medium text-gray-700">
            MR
          </span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-gray-700"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="mt-4 space-y-2 border-t border-gray-100 pt-4 md:hidden">
          {navLinks.map((link) =>
            link.badge ? (
              <a
                key={link.label}
                href={link.href}
                className={`flex items-center justify-between rounded-md px-2 py-2 text-sm ${
                  link.active
                    ? 'bg-[#EEF2FF] font-medium text-[#4f46e5]'
                    : 'text-gray-700'
                }`}
              >
                {link.label}
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4f46e5] text-xs text-white">
                  {link.badge}
                </span>
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={`block rounded-md px-2 py-2 text-sm ${
                  link.active
                    ? 'bg-[#EEF2FF] font-medium text-[#4f46e5]'
                    : 'text-gray-700'
                }`}
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

export default NotificationsHeader;
