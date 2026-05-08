export const PUBLIC_ROUTES = [
  '/',
  '/talent/login',
  '/login-company',
  '/talent/signup',
  '/signup-company',
  '/forgot-password'
];

export const PRIVATE_ROUTES_TALENT = [
  '/talent/onboarding',
  '/talent/self-evaluation',
  '/talent/notifications',
  '/talent/profile',
  '/talent/dashboard'
];

export const PRIVATE_ROUTES_COMPANY = [
  '/onboarding/company',
  '/dashboard/company'
];

export const PRIVATE_ROUTES_ADMIN = ['*'];

export const AUTH_COOKIE_NAME = 'auth_token';
