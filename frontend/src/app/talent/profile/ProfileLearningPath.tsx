import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const ProfileLearningPath = () => {
  return (
    <Card className="border border-gray-200 p-4 gap-2">
      <h3 className="font-bold text-gray-900 text-sm mb-3">
        TU RUTA DE APRENDIZAJE
      </h3>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-900">35%</span>
            <span className="text-xs text-gray-500">7 de 20 hitos</span>
          </div>
          <Progress
            value={35}
            className="w-full [--primary:#4f46e5] bg-gray-200"
          />
        </div>
        <div>
          <p className="text-xs font-medium text-[#6B7280] mb-1">
            Próximo paso:
          </p>
          <p className="text-sm font-semibold text-gray-900">
            Design tokens y theming
          </p>
        </div>
      </div>
      <Button className="w-full mt-4 bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-sm h-9">
        Continuar mi ruta →
      </Button>
    </Card>
  );
};
export default ProfileLearningPath;
