import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';
import Illutration1 from './Illutration1';

interface ProfileCVAttachedProps {
  cvUrl: string;
}

function getFileName(url: string): string {
  try {
    const decoded = decodeURIComponent(url);
    const parts = decoded.split('/');
    const last = parts[parts.length - 1].split('?')[0];
    return last || 'cv.pdf';
  } catch {
    return 'cv.pdf';
  }
}

const ProfileCVAttached = ({ cvUrl }: ProfileCVAttachedProps) => {
  const fileName = getFileName(cvUrl);

  return (
    <Card className="border border-gray-200 p-4 gap-0">
      <h3 className="font-bold text-[#4B5563] text-sm mb-3">CV ADJUNTO</h3>
      <div className="space-y-2">
        <div className="flex flex-row items-center gap-2">
          <div className="p-4 flex items-center justify-center text-gray-600 font-bold bg-[#F3F4F6] rounded-md">
            <p className="text-xs text-gray-500">PDF</p>
          </div>
          <div className="flex flex-col text-sm gap-1">
            <span className="text-[#111827] font-bold truncate max-w-[160px]">{fileName}</span>
          </div>
        </div>
        <div className="flex gap-2 border-b border-gray-200 pb-4">
          <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" className="w-full text-sm h-8 gap-2">
              <Download className="w-4 h-4" />
              Descargar
            </Button>
          </a>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 items-center sm:items-start">
          <div className="hidden sm:block"><Illutration1 /></div>
          <div className="block sm:hidden"><Illutration1 className="w-12 h-auto" /></div>
          <div className="relative w-full sm:w-auto">
            <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-2xl p-4 w-full sm:max-w-sm flex flex-col items-center relative">
              <div className="absolute left-0 top-10 -translate-x-4.5 hidden sm:block" style={{ border: '9px solid transparent', borderRightColor: '#C7D2FE' }} />
              <div className="absolute left-0 top-10 -translate-x-4 translate-y-px hidden sm:block" style={{ border: '8px solid transparent', borderRightColor: '#EEF2FF' }} />
              <p className="text-[#1F2937] text-xs sm:text-sm leading-relaxed mb-4 text-center sm:text-left">
                ¿Querés que revise tu CV para el rol que elegiste? Te marcó lo que se puede mejorar.
              </p>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition w-full sm:w-auto">
                Revisar con Ruty
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProfileCVAttached;
