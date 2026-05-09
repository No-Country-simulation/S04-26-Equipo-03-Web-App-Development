import { AuthLogo } from './AuthLogo';
import Link from 'next/link';

export const AuthHeader = () => {
  return (
    <header className="w-full bg-white border-b-[1.25px] border-[#e5e7eb] flex flex-col items-start pb-[17.25px] pt-[16px] px-[32px]">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <AuthLogo />
        <Link
          href="/"
          className="text-[#6b7280] text-[12px] font-normal font-['Inter'] leading-[18px] hover:text-[#111827] transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </header>
  );
};
