import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const ProfileProgressBar = () => {
  return (
    <div className="bg-white mt-6">
      <div className="max-w-7xl mx-auto border border-gray-200 px-6 py-4 rounded-md">
        <div className="flex items-center gap-2">
          <div className="w-full flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-900">
              70% completado — completa tu perfil para recibir 3+ más visitas
            </span>
            <Progress
              value={70}
              className="w-full [--primary:#4f46e5] bg-gray-200"
            />
          </div>
          <Button className="bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-sm h-8">
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileProgressBar;
