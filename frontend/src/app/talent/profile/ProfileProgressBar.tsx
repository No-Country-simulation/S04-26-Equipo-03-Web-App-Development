import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

interface ProfileProgressBarProps {
  completionPercent: number;
}

const ProfileProgressBar = ({ completionPercent }: ProfileProgressBarProps) => {
  const label =
    completionPercent >= 100
      ? '¡Perfil completo! Tu visibilidad es máxima.'
      : `${completionPercent}% completado — completá tu perfil para recibir más visitas`;

  return (
    <div className="bg-white mt-4 sm:mt-6">
      <div className="max-w-7xl mx-auto border border-gray-200 px-4 sm:px-6 py-4 rounded-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2">
          <div className="w-full flex flex-col gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-900">
              { label }
            </span>
            <Progress
              value={ completionPercent }
              className="w-full [--primary:#4f46e5] bg-gray-200"
            />
          </div>
          { completionPercent < 100 && (
            <Link href="/talent/onboarding">
              <Button className="bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-xs sm:text-sm h-8 w-full sm:w-auto shrink-0">
                Continuar
              </Button>
            </Link>
          ) }
        </div>
      </div>
    </div>
  );
};

export default ProfileProgressBar;
