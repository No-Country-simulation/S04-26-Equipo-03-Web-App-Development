'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Upload } from 'lucide-react';
import { getCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';
import { Mascot } from '@/components/common/Mascot';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

interface ProfileCVAttachedProps {
  cvUrl: string | null;
  profileId: string;
}

const MAX_BYTES = 10 * 1024 * 1024; // 10 MiB

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

/** Inserta fl_attachment en URLs de Cloudinary para forzar descarga con extensión correcta. */
function getCloudinaryDownloadUrl(url: string): string {
  if (!url.includes('cloudinary.com')) return url;
  return url.replace(/\/upload\/(?!fl_attachment)/, '/upload/fl_attachment/');
}

const ProfileCVAttached = ({ cvUrl: initialCvUrl, profileId }: ProfileCVAttachedProps) => {
  const [cvUrl, setCvUrl] = useState<string | null>(initialCvUrl);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      // CORS fallback: Cloudinary fl_attachment fuerza Content-Disposition: attachment
      window.open(getCloudinaryDownloadUrl(cvUrl), '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Solo se permiten archivos PDF.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('El archivo supera el máximo de 10 MiB.');
      return;
    }

    setError(null);
    setSuccess(false);
    setUploading(true);

    try {
      const token = getCookie(AUTH_COOKIE_NAME);
      const form = new FormData();
      form.append('cv', file);

      // No usamos apiClient porque su default Content-Type: application/json
      // sobreescribiría el multipart/form-data con boundary que requiere Multer.
      const res = await fetch(`${API_URL}/talent/profile/${profileId}/cv`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token ?? ''}` },
        body: form,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { message?: string; }).message ?? 'Error');
      }

      const data = (await res.json()) as { cv_url: string; };
      setCvUrl(data.cv_url);
      setSuccess(true);
    } catch {
      setError('No se pudo subir el CV. Intentá de nuevo.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const triggerUpload = () => inputRef.current?.click();

  return (
    <Card className="border border-gray-200 p-4 gap-0">
      <h3 className="font-bold text-[#4B5563] text-sm mb-3">CV ADJUNTO</h3>

      <input
        ref={ inputRef }
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={ handleFileChange }
      />

      { cvUrl ? (
        <div className="space-y-2">
          <div className="flex flex-row items-center gap-2">
            <div className="p-4 flex items-center justify-center text-gray-600 font-bold bg-[#F3F4F6] rounded-md">
              <p className="text-xs text-gray-500">PDF</p>
            </div>
            <div className="flex flex-col text-sm gap-1">
              <span className="text-[#111827] font-bold truncate max-w-[160px]">
                { getFileName(cvUrl) }
              </span>
            </div>
          </div>

          <div className="flex gap-2 border-b border-gray-200 pb-4">
            <Button
              variant="outline"
              className="flex-1 text-sm h-8 gap-2"
              onClick={ handleDownload }
              disabled={ downloading }
            >
              <Download className="w-4 h-4" />
              { downloading ? 'Descargando...' : 'Descargar' }
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-sm h-8 gap-2"
              onClick={ triggerUpload }
              disabled={ uploading }
            >
              <Upload className="w-4 h-4" />
              { uploading ? 'Subiendo...' : 'Actualizar' }
            </Button>
          </div>

          { error && <p className="text-xs text-red-600">{ error }</p> }
          { success && <p className="text-xs text-green-600">CV actualizado correctamente.</p> }

          <div className="flex flex-col sm:flex-row gap-4 mt-4 items-center sm:items-start">
            <div className="hidden sm:block">
              <Mascot variant="ready" className="w-24 h-auto" />
            </div>
            <div className="relative w-full sm:w-auto">
              <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-2xl p-4 w-full sm:max-w-sm flex flex-col items-center relative">
                <div className="absolute left-0 top-10 -translate-x-4.5 hidden sm:block" style={ { border: '9px solid transparent', borderRightColor: '#C7D2FE' } } />
                <div className="absolute left-0 top-10 -translate-x-4 translate-y-px hidden sm:block" style={ { border: '8px solid transparent', borderRightColor: '#EEF2FF' } } />
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
      ) : (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-[56px] h-[56px] rounded-full bg-[#F3F4F6] flex items-center justify-center">
            <Upload className="w-6 h-6 text-[#6B7280]" />
          </div>
          <div className="text-center">
            <p className="text-[14px] font-medium text-[#111827] mb-[4px]">
              No tenés CV adjunto
            </p>
            <p className="text-[12px] text-[#6B7280]">
              Subí tu CV en PDF para que los reclutadores puedan verlo.
            </p>
          </div>
          { error && <p className="text-xs text-red-600 text-center">{ error }</p> }
          <Button
            className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm font-semibold gap-2"
            onClick={ triggerUpload }
            disabled={ uploading }
          >
            <Upload className="w-4 h-4" />
            { uploading ? 'Subiendo...' : 'Subir CV (PDF)' }
          </Button>
        </div>
      ) }
    </Card>
  );
};

export default ProfileCVAttached;
