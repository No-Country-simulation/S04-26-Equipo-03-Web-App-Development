'use client';

import { AuthTemplate } from '@/components/layout/auth/AuthTemplate';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';
import { deleteCookie } from '@/lib/utils/cookies';

export default function SelfEvaluation() {
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie(AUTH_COOKIE_NAME);
    router.push('/talent/login');
  };

  return (
    <AuthTemplate>
      <div className="flex flex-col gap-4">
        <p>Auto Evaluacion(En construcción)</p>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-fit"
        >
          Cerrar sesión
        </Button>
      </div>
    </AuthTemplate>
  );
}
