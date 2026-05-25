'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCookie, deleteCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';

function getInitialsFromToken(): string {
  const token = getCookie(AUTH_COOKIE_NAME);
  if (!token) return 'ME';
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    const first: string = payload?.user_metadata?.first_name?.[0] ?? '';
    const last: string = payload?.user_metadata?.last_name?.[0] ?? '';
    return (first + last).toUpperCase() || 'ME';
  } catch {
    return 'ME';
  }
}

export default function HeaderNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [initials, setInitials] = useState('...');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInitials(getInitialsFromToken());
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    deleteCookie(AUTH_COOKIE_NAME);
    router.push('/login-company');
  };

  const navItems = [
    { label: 'Candidatos', href: '/dashboard/company' },
    { label: 'Mis guardados', href: '/dashboard/company/saved' },
  ];

  return (
    <>
      { navItems.map(({ label, href }) => {
        const isActive = pathname === href;
        return (
          <Link key={ href } href={ href }>
            <Button
              className={ `text-sm font-normal px-4 py-2 rounded-md ${isActive
                ? 'text-[#4f46e5] bg-[#EEF2FF] hover:bg-[#EEF2FF]'
                : 'text-[#1a1a2e] bg-white hover:bg-[#F3F4F6]'
                }` }
            >
              { label }
            </Button>
          </Link>
        );
      }) }
      <div ref={ menuRef } className="relative hidden sm:block">
        <Button
          onClick={ () => setMenuOpen((prev) => !prev) }
          className="text-sm text-[#1a1a2e] bg-[#E5E7EB] hover:bg-[#D1D5DB] rounded-full p-0 h-9 w-9"
        >
          { initials }
        </Button>
        { menuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50">
            <button
              onClick={ handleLogout }
              className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-[#FEF2F2] rounded-lg transition-colors"
            >
              <LogOut size={ 14 } />
              Cerrar sesión
            </button>
          </div>
        ) }
      </div>
    </>
  );
}
