import { NextRequest, NextResponse } from 'next/server';
import { 
  PUBLIC_ROUTES, 
  PRIVATE_ROUTES_TALENT, 
  PRIVATE_ROUTES_COMPANY 
} from '../constants/routes';

export type UserRole = 'TALENT' | 'RECRUITER' | 'ADMIN';

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function getRouteType(pathname: string) {
  const isTalent = PRIVATE_ROUTES_TALENT.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  const isCompany = PRIVATE_ROUTES_COMPANY.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  return { isTalent, isCompany };
}

export function handleUnauthenticated(request: NextRequest, isCompanyRoute: boolean) {
  const loginPath = isCompanyRoute ? '/login-company' : '/login-talent';
  const loginUrl = new URL(loginPath, request.url);
  loginUrl.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export function handleAuthenticatedRedirect(userRole: UserRole, pathname: string, request: NextRequest) {
  if (isPublicRoute(pathname) && pathname !== '/') {
    const dashboardRoute = userRole === 'RECRUITER' ? PRIVATE_ROUTES_COMPANY[0] : PRIVATE_ROUTES_TALENT[0];
    return NextResponse.redirect(new URL(dashboardRoute, request.url));
  }
  return null;
}

export function handleRoleProtection(userRole: UserRole, isTalentRoute: boolean, isCompanyRoute: boolean, request: NextRequest) {
  if (userRole === 'ADMIN') return null;

  if (userRole === 'TALENT' && isCompanyRoute) {
    return NextResponse.redirect(new URL(PRIVATE_ROUTES_TALENT[0], request.url));
  }

  if (userRole === 'RECRUITER' && isTalentRoute) {
    return NextResponse.redirect(new URL(PRIVATE_ROUTES_COMPANY[0], request.url));
  }

  return null;
}
