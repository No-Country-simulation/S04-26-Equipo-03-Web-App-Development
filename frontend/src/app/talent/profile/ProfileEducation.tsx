'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { EducationForm, type EducationEntry as FormEntry } from '@/components/onboarding/talent/shared/EducationForm';
import type { EduEntry } from './page';
import { talentApi } from '@/lib/api/talent';
import { getCookie } from '@/lib/utils/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/constants/routes';

interface ProfileEducationProps {
  education: EduEntry[];
  profileId: string;
}

function toFormEntry(edu: EduEntry): FormEntry {
  return {
    id: edu.id ?? crypto.randomUUID(),
    institution: edu.institution,
    title: edu.title,
    graduation_year: edu.graduation_year ?? '',
  };
}

const ProfileEducation = ({ education, profileId }: ProfileEducationProps) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [entries, setEntries] = useState<FormEntry[]>(education.map(toFormEntry));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(updated: FormEntry[]) {
    const token = getCookie(AUTH_COOKIE_NAME);
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      await talentApi.updateProfile(token, profileId, {
        education: updated as unknown as object[],
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
        <h2 className="text-lg font-bold text-gray-900">Educación</h2>
        { editing ? (
          <button
            type="button"
            onClick={ () => { setEditing(false); setEntries(education.map(toFormEntry)); } }
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
            { education.length === 0 ? '+ Agregar' : 'Editar' }
          </button>
        ) }
      </div>

      { editing ? (
        <div>
          <EducationForm value={ entries } onChange={ setEntries } />
          { error && <p className="text-sm text-red-500 mt-2">{ error }</p> }
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={ () => { setEditing(false); setEntries(education.map(toFormEntry)); } }
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
        education.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no agregaste educación.</p>
        ) : (
          <div className="space-y-4">
            { education.map((edu, i) => (
              <div key={ edu.id ?? i } className="flex items-start gap-4">
                <div>
                  <Skeleton className="h-10 w-10 bg-gray-300" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{ edu.title }</p>
                  <p className="text-xs text-gray-500">
                    { edu.institution }{ edu.graduation_year ? ` · ${edu.graduation_year}` : '' }
                  </p>
                </div>
              </div>
            )) }
          </div>
        )
      ) }
    </div>
  );
};
export default ProfileEducation;
