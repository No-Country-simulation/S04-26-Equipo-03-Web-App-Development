import { ReactNode } from 'react';
import { AuthHeader } from '../auth/AuthHeader';
import { BackLink } from '../../auth/BackLink';

interface AuthTemplateProps {
  children: ReactNode;
}

export const AuthTemplate = ({ children }: AuthTemplateProps) => {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col overflow-x-hidden">
      <AuthHeader />
      <main className="flex-1 flex flex-col items-center justify-start pt-[32px] pb-[64px] px-[24px] relative">
        <div className="w-full max-w-[420px] relative">
          <div className="absolute left-0 top-[-28px] hidden lg:block">
            <BackLink />
          </div>
          {/* Mobile Back Link */}
          <div className="mb-4 lg:hidden">
            <BackLink />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};
