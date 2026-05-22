import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Diamond } from 'lucide-react';

const ProfileInsigniaCard = () => {
  return (
    <Card className="bg-gray-900 text-white border-0 p-6 gap-2">
      <p className="text-xs font-bold text-yellow-400 uppercase flex items-center gap-1 mb-1">
        <Diamond className="w-3 h-3 fill-yellow-400" />
        Insignia verificada
      </p>
      <div>
        <p className="text-sm font-semibold mb-2">
          Valida 3 skills más para desbloquear
        </p>
        <p className="text-xs text-gray-300">
          &quot;Todas las skills verificadas&quot; aumenta tu visibilidad — los
          reclutadores pueden filtrar por este badge.
        </p>
      </div>
      <Button className="w-full bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-sm h-9">
        Validar skills
      </Button>
    </Card>
  );
};
export default ProfileInsigniaCard;
