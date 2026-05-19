'use client';

import { useEffect, useState } from 'react';
import SiteHeader from '../layout/SiteHeader';
import { getCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';

function getDashboardRoute(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload?.user_metadata?.role;
    if (role === 'RECRUITER') return '/dashboard/company';
    return '/talent/learning-path';
  } catch {
    return '/talent/learning-path';
  }
}

export default function Header() {
  const [dashboardHref, setDashboardHref] = useState<string | null>(null);

  useEffect(() => {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (token) setDashboardHref(getDashboardRoute(token));
  }, []);

  if (dashboardHref) {
    return (
      <SiteHeader
        showMobileMenu
        navItems={ [
          { label: 'Ir al dashboard', href: dashboardHref, variant: 'button' },
        ] }
      />
    );
  }

  return (
    <SiteHeader
      showMobileMenu
      navItems={ [
        { label: 'Soy empresa', href: '/login-company' },
        { label: 'Iniciar sesión', href: '/talent/login' },
        { label: 'Crear cuenta', href: '/talent/signup', variant: 'button' },
      ] }
    />
  );
}
