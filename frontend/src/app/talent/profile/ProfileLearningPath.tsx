import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { LearningPathSummary } from '@/lib/api/learning-path';

interface ProfileLearningPathProps {
  learningPath: LearningPathSummary | null;
}

const ProfileLearningPath = ({ learningPath }: ProfileLearningPathProps) => {
  if (!learningPath) {
    return (
      <Card className="border border-gray-200 p-4 gap-2">
        <h3 className="font-bold text-gray-900 text-sm mb-2">
          TU RUTA DE APRENDIZAJE
        </h3>
        <p className="text-xs text-gray-500">
          Completá el diagnóstico para generar tu ruta personalizada.
        </p>
        <Link href="/talent/diagnostic">
          <Button className="w-full mt-3 bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-sm h-9">
            Ir al diagnóstico →
          </Button>
        </Link>
      </Card>
    );
  }

  const { progress } = learningPath;
  const percent = progress?.percentage ?? 0;
  const completed = progress?.completed ?? 0;
  const total = progress?.total ?? 0;

  return (
    <Card className="border border-gray-200 p-4 gap-2">
      <h3 className="font-bold text-gray-900 text-sm mb-3">
        TU RUTA DE APRENDIZAJE
      </h3>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-900">{ percent }%</span>
            <span className="text-xs text-gray-500">
              { completed } de { total } hitos
            </span>
          </div>
          <Progress
            value={ percent }
            className="w-full [--primary:#4f46e5] bg-gray-200"
          />
        </div>
      </div>
      <Link href="/talent/learning-path">
        <Button className="w-full mt-4 bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-sm h-9">
          Continuar mi ruta →
        </Button>
      </Link>
    </Card>
  );
};
export default ProfileLearningPath;
