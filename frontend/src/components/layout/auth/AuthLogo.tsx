import Link from 'next/link';

interface AuthLogoProps {
  className?: string;
}

export const AuthLogo = ({ className }: AuthLogoProps) => {
  return (
    <Link href="/" className={`inline-flex items-center gap-[7.99px] ${className}`}>
      <div className="bg-[#111827] flex flex-col items-start justify-center px-[5px] relative rounded-[5px] shrink-0 size-[21.99px]">
        <div className="border-white border-l-[1.25px] border-solid border-t-[1.25px] h-[11.99px] relative rounded-[2px] shrink-0 w-full" />
      </div>
      <span className="font-bold text-[#111827] text-[15px] leading-[22.5px] font-['Inter']">
        TalentBridge
      </span>
    </Link>
  );
};
