import { AuthLogo } from './AuthLogo';
import Link from 'next/link';

export const AuthHeader = () => {
  return (
    <header className="flex items-center justify-between px-[31.99px] py-[18px] w-full max-w-7xl mx-auto">
      <AuthLogo />
      <Link
        href="/"
        className="text-[#6b7280] text-[12px] font-normal font-['Inter'] leading-[18px] hover:text-[#111827] transition-colors"
      >
        Volver al inicio
      </Link>
    </header>
  );
};
