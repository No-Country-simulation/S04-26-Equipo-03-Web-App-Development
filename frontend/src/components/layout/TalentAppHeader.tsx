'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCookie, deleteCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';

export type TalentTab = 'profile' | 'diagnostic' | 'learning-path' | 'notifications';

interface TalentAppHeaderProps {
  activeTab?: TalentTab;
}

const NAV_LINKS: { tab: TalentTab; label: string; href: string; }[] = [
  { tab: 'profile', label: 'Perfil', href: '/talent/profile' },
  { tab: 'diagnostic', label: 'Diagnóstico', href: '/talent/diagnostic' },
  { tab: 'learning-path', label: 'Mi ruta', href: '/talent/learning-path' },
  { tab: 'notifications', label: 'Notificaciones', href: '/talent/notifications' },
];

function getInitialsFromToken(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const first: string = payload?.user_metadata?.first_name?.[0]?.toUpperCase() ?? '';
    const last: string = payload?.user_metadata?.last_name?.[0]?.toUpperCase() ?? '';
    if (first || last) return `${first}${last}`;
    const email: string = payload?.user_metadata?.email ?? payload?.email ?? '';
    return email[0]?.toUpperCase() ?? 'T';
  } catch {
    return 'T';
  }
}

export function TalentAppHeader({ activeTab }: TalentAppHeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [initials, setInitials] = useState('T');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (token) setInitials(getInitialsFromToken(token));
  }, []);

  // Cerrar el menú al hacer click fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleLogout = () => {
    deleteCookie(AUTH_COOKIE_NAME);
    router.replace('/talent/login');
  };

  return (
    <header className="shrink-0 border-b border-[#e5e7eb] px-[24px] py-[14px] bg-white">
      <div className="max-w-[860px] mx-auto flex items-center justify-between">
        {/* Logo */ }
        <Link href="/" className="flex items-center gap-[8px]">
          <div className="w-[28px] h-[28px] bg-[#1a1a2e] rounded-[6px] flex items-center justify-center">
            <span className="text-white text-[11px] font-bold">T</span>
          </div>
          <span className="font-semibold text-[#1a1a2e] text-[15px]">TalentBridge</span>
        </Link>

        <div className="flex items-center gap-[28px]">
          {/* Nav — oculto en mobile */ }
          <nav className="hidden sm:flex items-center gap-[28px]">
            { NAV_LINKS.map(({ tab, label, href }) =>
              tab === activeTab ? (
                <Link
                  key={ tab }
                  href={ href }
                  className="text-[14px] text-[#4f46e5] font-medium border-b-[2px] border-[#4f46e5] pb-[2px]"
                >
                  { label }
                </Link>
              ) : (
                <Link
                  key={ tab }
                  href={ href }
                  className="text-[14px] text-[#6b7280] hover:text-[#111827] transition-colors"
                >
                  { label }
                </Link>
              ),
            ) }
          </nav>

          {/* Avatar + dropdown */ }
          <div className="relative" ref={ menuRef }>
            <button
              onClick={ () => setOpen((p) => !p) }
              className="w-[34px] h-[34px] rounded-full bg-[#4f46e5] flex items-center justify-center cursor-pointer hover:bg-[#4338ca] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5] focus-visible:ring-offset-1"
              aria-label="Menú de usuario"
              aria-expanded={ open }
            >
              <span className="text-white text-[13px] font-semibold select-none leading-none">
                { initials }
              </span>
            </button>

            { open && (
              <div className="absolute right-0 mt-[8px] w-[180px] rounded-[10px] border border-[#e5e7eb] bg-white shadow-lg py-[6px] z-50">
                <button
                  onClick={ handleLogout }
                  className="w-full flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-[#374151] hover:bg-[#f9fafb] transition-colors cursor-pointer text-left"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-[15px] h-[15px] text-[#6b7280]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={ 2 }
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
                    />
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            ) }
          </div>
        </div>
      </div>
    </header>
  );
}
