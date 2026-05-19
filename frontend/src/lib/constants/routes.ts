export const PUBLIC_ROUTES = [
  '/',
  '/talent/login',
  '/login-company',
  '/talent/signup',
  '/signup-company',
  '/forgot-password',
  '/onboarding/company', // TODO: move to private routes when implemented
  '/dashboard/company', // TODO: move to private routes when implemented
  '/verification/company', // TODO: move to private routes when implemented
];

export const PRIVATE_ROUTES_TALENT = [
  '/talent/onboarding',
  '/talent/self-evaluation',
  '/talent/learning-path',
  '/talent/notifications',
  '/talent/profile',
  '/talent/dashboard',
];

export const PRIVATE_ROUTES_COMPANY = [
  // '/onboarding/company', // TODO: move to private routes when implemented
  // '/dashboard/company'  // TODO: move to private routes when implemented
];

export const PRIVATE_ROUTES_ADMIN = ['*'];

export const AUTH_COOKIE_NAME = 'auth_token';
