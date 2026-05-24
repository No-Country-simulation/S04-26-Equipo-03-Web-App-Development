import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose';
import { AUTH_COOKIE_NAME } from './lib/constants/routes';
import {
  isPublicRoute,
  getRouteType,
  handleUnauthenticated,
  handleAuthenticatedRedirect,
  handleRoleProtection,
  UserRole,
} from './lib/auth/middleware-utils';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicRoute = isPublicRoute(pathname);
  const { isTalent, isCompany } = getRouteType(pathname);
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token && !publicRoute) {
    return handleUnauthenticated(request, isCompany);
  }

  if (token) {
    try {
      const payload = decodeJwt(token) as {
        exp?: number;
        user_metadata?: { role?: UserRole };
      };

      // Si el token ya expiró, borrar la cookie y redirigir al login
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        const response = handleUnauthenticated(request, isCompany);
        response.cookies.delete(AUTH_COOKIE_NAME);
        return response;
      }

      const userRole = payload?.user_metadata?.role as UserRole;

      const authRedirect = handleAuthenticatedRedirect(
        userRole,
        pathname,
        request
      );
      if (authRedirect) return authRedirect;

      const roleRedirect = handleRoleProtection(
        userRole,
        isTalent,
        isCompany,
        request
      );
      if (roleRedirect) return roleRedirect;
    } catch (error) {
      console.error('Proxy JWT Decode Error:', error);
      if (!publicRoute) {
        return handleUnauthenticated(request, isCompany);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
