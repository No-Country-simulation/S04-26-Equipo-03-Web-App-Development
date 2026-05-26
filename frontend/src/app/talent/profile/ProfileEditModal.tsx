'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { talentApi } from '@/lib/api/talent';
import { getCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';

const AVAILABILITY_OPTIONS = [
  { value: 'ACTIVE_JOB_SEARCH', label: 'Búsqueda activa' },
  { value: 'OPEN_TO_OFFERS', label: 'Abierto a ofertas' },
  { value: 'NOT_LOOKING_ASSESSMENT_ONLY', label: 'No disponible' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  profileId: string;
  initial: {
    bio: string;
    location: string;
    availability: string;
  };
}

export default function ProfileEditModal({ open, onClose, profileId, initial }: Props) {
  const router = useRouter();
  const [bio, setBio] = useState(initial.bio);
  const [location, setLocation] = useState(initial.location);
  const [availability, setAvailability] = useState(initial.availability);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSave() {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      await talentApi.updateProfile(token, profileId, { bio, location, availability });
      router.refresh();
      onClose();
    } catch {
      setError('No se pudo guardar. Intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={ onClose } />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Editar perfil</h2>
          <button type="button" onClick={ onClose } className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input
              type="text"
              value={ location }
              onChange={ (e) => setLocation(e.target.value) }
              placeholder="Ciudad, País"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#4f46e5] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Disponibilidad</label>
            <select
              value={ availability }
              onChange={ (e) => setAvailability(e.target.value) }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#4f46e5] transition-colors bg-white"
            >
              <option value="">Sin especificar</option>
              { AVAILABILITY_OPTIONS.map((opt) => (
                <option key={ opt.value } value={ opt.value }>{ opt.label }</option>
              )) }
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción personal</label>
            <textarea
              value={ bio }
              onChange={ (e) => setBio(e.target.value) }
              rows={ 4 }
              placeholder="Contá quién sos, qué hacés y qué buscás..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#4f46e5] transition-colors resize-none"
            />
          </div>
        </div>

        { error && <p className="text-sm text-red-500 mt-2">{ error }</p> }

        <div className="flex justify-end gap-2 mt-5">
          <Button variant="outline" onClick={ onClose } disabled={ saving }>
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
    </div>
  );
}
