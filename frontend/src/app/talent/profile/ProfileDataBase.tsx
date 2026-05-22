import SkillBadge from '@/components/common/SkillBadge';
import { Button } from '@/components/ui/button';
import RatingDisplay from './RatingDisplay';
import { Eye } from 'lucide-react';

const ProfileDataBase = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center text-gray-600 font-bold">
            MR
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marcela Rivero</h1>
            <p className="text-gray-600">Product Designer · Buenos Aires, AR</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm text-green-500 font-semibold">
                Open to work · Remoto
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-sm">
            Editar perfil
          </Button>
          <Button variant="outline" className="text-sm">
            Ver como reclutador
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <SkillBadge variant="level">Semi-Senior</SkillBadge>
        <RatingDisplay stars={4.7} />
        <span className="text-sm text-gray-600">4.7 (8)</span>
      </div>

      <p className="text-xs text-gray-500 mt-4 flex justify-between">
        <span className="italic">
          Basado en tus skills validados, tu perfil corresponde a{' '}
          <strong>Semi-Senior.</strong>
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <span className="flex items-center gap-1 font-bold">
            <Eye className="w-3.5 h-3.5" />
            12 reclutadores
          </span>
          vieron tu perfil esta semana
        </span>
      </p>
    </div>
  );
};

export default ProfileDataBase;
