import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Diamond } from 'lucide-react';

interface ProfileInsigniaCardProps {
  skillCount: number;
  validatedCount: number;
}

const VERIFIED_THRESHOLD = 5;

const ProfileInsigniaCard = ({ skillCount, validatedCount }: ProfileInsigniaCardProps) => {
  const remaining = Math.max(0, VERIFIED_THRESHOLD - validatedCount);
  const unlocked = validatedCount >= VERIFIED_THRESHOLD;

  return (
    <Card className="bg-gray-900 text-white border-0 p-6 gap-2">
      <p className="text-xs font-bold text-yellow-400 uppercase flex items-center gap-1 mb-1">
        <Diamond className="w-3 h-3 fill-yellow-400" />
        Insignia verificada
      </p>
      <div>
        { unlocked ? (
          <>
            <p className="text-sm font-semibold mb-2">Insignia desbloqueada</p>
            <p className="text-xs text-gray-300">
              { validatedCount } de { skillCount } skills validadas. Sos más visible para los reclutadores.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold mb-2">
              Validá { remaining } { remaining === 1 ? 'skill más' : 'skills más' } para desbloquear
            </p>
            <p className="text-xs text-gray-300">
              { validatedCount } de { skillCount } skills validadas. Hacé el diagnóstico de validación para cada skill.
            </p>
          </>
        ) }
      </div>
      <Link href="/talent/diagnostic">
        <Button className="w-full bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-sm h-9">
          { unlocked ? 'Ver skills' : 'Validar skills →' }
        </Button>
      </Link>
    </Card>
  );
};
export default ProfileInsigniaCard;
