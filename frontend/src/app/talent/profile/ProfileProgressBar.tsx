import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const ProfileProgressBar = () => {
  return (
    <div className="bg-white mt-4 sm:mt-6">
      <div className="max-w-7xl mx-auto border border-gray-200 px-4 sm:px-6 py-4 rounded-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2">
          <div className="w-full flex flex-col gap-2">
            <span className="text-xs sm:text-sm font-medium text-gray-900">
              70% completado — completa tu perfil para recibir 3+ más visitas
            </span>
            <Progress
              value={70}
              className="w-full [--primary:#4f46e5] bg-gray-200"
            />
          </div>
          <Button className="bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-xs sm:text-sm h-8 w-full sm:w-auto shrink-0">
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileProgressBar;
