import Link from 'next/link';

interface AuthRedirectProps {
  type: 'login' | 'signup';
}

const config = {
  login: {
    text: '¿No tienes cuenta? ',
    link: '/signup-company',
    label: 'Registrate',
  },
  signup: {
    text: '¿Ya tenés cuenta? ',
    link: '/login-company',
    label: 'Iniciá sesión',
  },
} as const;

export default function AuthRedirect({ type }: AuthRedirectProps) {
  const { text, link, label } = config[type];
  return (
    <p className="text-sm text-gray-500 text-center mt-4">
      {text}
      <Link href={link} className="text-[#4f46e5] hover:underline font-medium">
        {label}
      </Link>
    </p>
  );
}
