import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Download } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';

interface ProfileSidebarProps {
  progress?: number;
}

export default function ProfileSidebar({ progress = 35 }: ProfileSidebarProps) {
  const [save, setSave] = useState(false);
  const saveCandidate = () => {
    setSave((s) => !s);
  };
  return (
    <Card className="p-6 border-gray-200 sticky top-6">
      <Button className="w-full bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white font-semibold mb-4 cursor-pointer">
        Contactar
      </Button>
      <div className="flex gap-3 mb-6">
        <Button
          variant="outline"
          className="flex-1 border-gray-300 cursor-pointer"
          onClick={saveCandidate}
        >
          {/*
            - fill-red-600 / fill-white → color de relleno
            - text-red-600 / text-black → color del borde (Lucide usa stroke="currentColor")
          */}
          <Heart
            className={`w-4 h-4 ${save ? 'fill-red-600 text-red-600' : 'fill-white text-black'}`}
          />
          Guardar
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-gray-300 cursor-pointer"
        >
          Calificar
        </Button>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-semibold text-[#1a1a2e] mb-3">
          PROGRESO EN SU RUTA
        </h3>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold text-[#1a1a2e]">
              {progress}%
            </span>
            <span className="text-xs text-gray-600">
              Está actualizando sus habilidades
            </span>
          </div>
          <Progress
            value={progress}
            className="bg-gray-200 **:data-[slot=progress-indicator]:bg-[#4f46e5]"
          />
        </div>
        <Button
          variant="outline"
          className="w-full border-gray-300 text-[#4f46e5] mb-4 cursor-pointer"
        >
          <Download className="w-4 h-4 mr-2" />
          Descargar CV
        </Button>
      </div>
    </Card>
  );
}
