'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Download, X, Copy, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

function getFileName(url: string): string {
  try {
    const decoded = decodeURIComponent(url);
    const parts = decoded.split('/');
    const last = parts[parts.length - 1].split('?')[0];
    const name = last || 'cv';
    return name.endsWith('.pdf') ? name : `${name}.pdf`;
  } catch {
    return 'cv.pdf';
  }
}

function getCloudinaryDownloadUrl(url: string): string {
  if (!url.includes('cloudinary.com')) return url;
  return url.replace(/\/upload\/(?!fl_attachment)/, '/upload/fl_attachment/');
}

interface ProfileSidebarProps {
  progress?: number;
  isSaved?: boolean;
  onToggleSave?: () => void;
  cvUrl?: string | null;
  email?: string | null;
  candidateName?: string;
}

export default function ProfileSidebar({
  progress = 0,
  isSaved = false,
  onToggleSave,
  cvUrl,
  email,
  candidateName,
}: ProfileSidebarProps) {
  const [downloading, setDownloading] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!email) return;
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = async () => {
    if (!cvUrl) return;
    setDownloading(true);
    const fileName = getFileName(cvUrl);
    try {
      const res = await fetch(cvUrl);
      if (!res.ok) throw new Error('fetch failed');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch {
      window.open(getCloudinaryDownloadUrl(cvUrl), '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Card className="p-6 border-0 shadow-none lg:border lg:border-gray-200 lg:sticky lg:top-6">
        <Button
          className="w-full bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white font-semibold mb-4 cursor-pointer"
          onClick={ () => setContactOpen(true) }
        >
          Contactar
        </Button>
        <div className="flex gap-3 mb-6">
          <Button
            variant="outline"
            className="flex-1 border-gray-300 cursor-pointer"
            onClick={ onToggleSave }
          >
            <Heart
              className={ `w-4 h-4 ${isSaved ? 'fill-red-600 text-red-600' : 'fill-white text-black'}` }
            />
            { isSaved ? 'Guardado' : 'Guardar' }
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
                { progress }%
              </span>
              <span className="text-xs text-gray-600">
                Está actualizando sus habilidades
              </span>
            </div>
            <Progress
              value={ progress }
              className="bg-gray-200 **:data-[slot=progress-indicator]:bg-[#4f46e5]"
            />
          </div>
          { cvUrl ? (
            <Button
              variant="outline"
              className="w-full border-gray-300 text-[#4f46e5] mb-4 cursor-pointer"
              onClick={ handleDownload }
              disabled={ downloading }
            >
              <Download className="w-4 h-4 mr-2" />
              { downloading ? 'Descargando...' : 'Descargar CV' }
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled
              className="w-full border-gray-300 text-[#9CA3AF] mb-4"
            >
              <Download className="w-4 h-4 mr-2" />
              CV no disponible
            </Button>
          ) }
        </div>
      </Card>

      { contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={ () => setContactOpen(false) }
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <button
              type="button"
              onClick={ () => setContactOpen(false) }
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-[16px] font-semibold text-[#1a1a2e] mb-1">
              Contactar candidato
            </h2>
            { candidateName && (
              <p className="text-[13px] text-gray-500 mb-4">{ candidateName }</p>
            ) }

            { email ? (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mt-4">
                <span className="flex-1 text-[14px] text-[#1a1a2e] break-all">
                  { email }
                </span>
                <button
                  type="button"
                  onClick={ handleCopy }
                  className="shrink-0 text-gray-400 hover:text-[#4f46e5] cursor-pointer transition-colors"
                  title="Copiar email"
                >
                  { copied
                    ? <Check className="w-4 h-4 text-green-500" />
                    : <Copy className="w-4 h-4" /> }
                </button>
              </div>
            ) : (
              <p className="text-[14px] text-gray-400 mt-4">
                Este candidato no tiene email registrado.
              </p>
            ) }

            <a
              href={ email ? `mailto:${email}` : undefined }
              className={ `mt-4 flex items-center justify-center w-full bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white text-[14px] font-medium px-4 py-2.5 rounded-lg transition-colors ${!email ? 'opacity-50 pointer-events-none' : ''}` }
            >
              Enviar email
            </a>
          </div>
        </div>
      ) }
    </>
  );
}
