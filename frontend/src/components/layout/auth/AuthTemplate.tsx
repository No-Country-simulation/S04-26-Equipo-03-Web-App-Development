import { ReactNode } from 'react';
import { AuthHeader } from './AuthHeader';
import { BackLink } from '../../auth/BackLink';

interface AuthTemplateProps {
  children: ReactNode;
  showBackLink?: boolean;
}

export const AuthTemplate = ({ children, showBackLink = true }: AuthTemplateProps) => {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex flex-col overflow-x-hidden">
      <AuthHeader />
      <main className="flex-1 flex flex-col items-center justify-start pt-[32px] pb-[64px] px-[24px] relative">
        <div className="w-full max-w-[420px] relative">
          {showBackLink && (
            <>
              <div className="absolute left-[12px] top-[-28px] hidden lg:block">
                <BackLink />
              </div>
              {/* Mobile Back Link */}
              <div className="mb-4 lg:hidden">
                <BackLink />
              </div>
            </>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};
