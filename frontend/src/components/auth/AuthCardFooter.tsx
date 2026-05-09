import Link from 'next/link';

interface AuthCardFooterProps {
  text: string;
  linkText: string;
  href: string;
}

export const AuthCardFooter = ({ text, linkText, href }: AuthCardFooterProps) => {
  return (
    <div className="flex justify-center pt-[7.515px] w-full">
      <p className="text-[13px] font-normal font-['Inter'] leading-[19.5px] text-[#4b5563]">
        {text}{' '}
        <Link
          href={href}
          className="text-[#4f46e5] font-medium hover:underline"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
};
