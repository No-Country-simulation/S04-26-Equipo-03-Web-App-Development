'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExperienceForm, type WorkExperienceEntry } from '@/components/onboarding/talent/shared/ExperienceForm';
import ProfileExperienceData from './ProfileExperienceData';
import type { WorkExp } from './page';
import { talentApi } from '@/lib/api/talent';
import { getCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';

interface Props {
  experience: WorkExp[];
  profileId: string;
}

/** Convierte WorkExp (display) → WorkExperienceEntry (form) */
function toFormEntry(exp: WorkExp): WorkExperienceEntry {
  return {
    id: exp.id ?? crypto.randomUUID(),
    company: exp.company,
    role: exp.role,
    description: exp.description ?? '',
    start_date: exp.start_date ?? '',
    end_date: exp.end_date ?? '',
    is_current: exp.is_current ?? false,
  };
}

const ProfileExperience = ({ experience, profileId }: Props) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [entries, setEntries] = useState<WorkExperienceEntry[]>(experience.map(toFormEntry));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(updated: WorkExperienceEntry[]) {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      await talentApi.updateProfile(token, profileId, {
        work_experience: updated as unknown as object[],
      });
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
        <h2 className="text-lg font-bold text-gray-900">Experiencia</h2>
        { editing ? (
          <button
            type="button"
            onClick={ () => { setEditing(false); setEntries(experience.map(toFormEntry)); } }
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
            { experience.length === 0 ? '+ Agregar' : 'Editar' }
          </button>
        ) }
      </div>

      { editing ? (
        <div>
          <ExperienceForm value={ entries } onChange={ setEntries } />
          { error && <p className="text-sm text-red-500 mt-2">{ error }</p> }
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={ () => { setEditing(false); setEntries(experience.map(toFormEntry)); } }
              disabled={ saving }
            >
              Cancelar
            </Button>
            <Button
              className="bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white"
              onClick={ () => handleSave(entries) }
              disabled={ saving }
            >
              { saving ? 'Guardando...' : 'Guardar' }
            </Button>
          </div>
        </div>
      ) : (
        <ProfileExperienceData experience={ experience } />
      ) }
    </div>
  );
};

export default ProfileExperience;
