'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { talentApi } from '@/lib/api/talent';
import { getCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';

interface ProfilePortfolioProps {
  portfolioUrl: string | null;
  profileId: string;
}

const ProfilePortfolio = ({ portfolioUrl, profileId }: ProfilePortfolioProps) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [url, setUrl] = useState(portfolioUrl ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      await talentApi.updateProfile(token, profileId, { portfolio_url: url });
      router.refresh();
      setEditing(false);
    } catch {
      setError('No se pudo guardar. Intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Portfolio</h2>
        { editing ? (
          <button
            type="button"
            onClick={ () => { setEditing(false); setUrl(portfolioUrl ?? ''); } }
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={ () => setEditing(true) }
            className="text-sm text-[#4f46e5] font-medium hover:underline"
          >
            { portfolioUrl ? <Pencil className="w-4 h-4 inline mr-1" /> : null }
            { portfolioUrl ? 'Editar' : '+ Agregar enlace' }
          </button>
        ) }
      </div>

      { editing ? (
        <div className="space-y-3">
          <input
            type="url"
            value={ url }
            onChange={ (e) => setUrl(e.target.value) }
            placeholder="https://mi-portfolio.com"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#4f46e5] transition-colors"
          />
          { error && <p className="text-sm text-red-500">{ error }</p> }
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={ () => { setEditing(false); setUrl(portfolioUrl ?? ''); } }
              disabled={ saving }
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white"
              onClick={ handleSave }
              disabled={ saving }
            >
              { saving ? 'Guardando...' : 'Guardar' }
            </Button>
          </div>
        </div>
      ) : (
        portfolioUrl ? (
          <a
            href={ portfolioUrl }
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#4f46e5] font-medium break-all hover:underline"
          >
            { portfolioUrl }
          </a>
        ) : (
          <p className="text-sm text-gray-500">Aún no agregaste un portfolio.</p>
        )
      ) }
    </div>
  );
};

export default ProfilePortfolio;
