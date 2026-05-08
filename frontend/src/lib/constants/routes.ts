export const PUBLIC_ROUTES = [
  '/',
  '/login-talent',
  '/login-company',
  '/signup-talent',
  '/signup-company',
  '/forgot-password'
];

export const PRIVATE_ROUTES_TALENT = [
  '/onboarding/talent',
  '/dashboard/talent'
];

export const PRIVATE_ROUTES_COMPANY = [
  '/onboarding/company',
  '/dashboard/company'
];

export const PRIVATE_ROUTES_ADMIN = ['*'];

export const AUTH_COOKIE_NAME = 'auth_token';
