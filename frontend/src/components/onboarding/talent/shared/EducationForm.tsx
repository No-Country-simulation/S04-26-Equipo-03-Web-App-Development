'use client';

import { useState } from 'react';
import { AuthInputField } from '@/components/auth/AuthInputField';

export interface EducationEntry {
  id: string;
  institution: string;
  title: string;
  graduation_year: string;
}

interface EducationFormProps {
  value: EducationEntry[];
  onChange: (value: EducationEntry[]) => void;
}

function createEmptyEntry(): EducationEntry {
  return {
    id: crypto.randomUUID(),
    institution: '',
    title: '',
    graduation_year: '',
  };
}

export const EducationForm = ({ value, onChange }: EducationFormProps) => {
  const [entries, setEntries] = useState<EducationEntry[]>(
    value.length > 0 ? value : [createEmptyEntry()],
  );

  const update = (updated: EducationEntry[]) => {
    setEntries(updated);
    onChange(updated);
  };

  const updateEntry = (
    id: string,
    field: keyof EducationEntry,
    val: string,
  ) => {
    update(entries.map((e) => (e.id === id ? { ...e, [field]: val } : e)));
  };

  const addEntry = () => update([...entries, createEmptyEntry()]);

  return (
    <div className="flex flex-col gap-[10px] w-full">
      { entries.map((entry) => (
        <div
          key={ entry.id }
          className="bg-white border border-[#e5e7eb] p-[15.25px] rounded-[8px] flex flex-col gap-[14px]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
            <AuthInputField
              label="Institución"
              placeholder="UBA · FADU"
              value={ entry.institution }
              onChange={ (e) =>
                updateEntry(entry.id, 'institution', e.target.value)
              }
            />
            <AuthInputField
              label="Título"
              placeholder="Diseño Gráfico"
              value={ entry.title }
              onChange={ (e) => updateEntry(entry.id, 'title', e.target.value) }
            />
          </div>
          <div className="w-full sm:w-1/2 sm:pr-[7px]">
            <AuthInputField
              label="Año de graduación"
              placeholder="2014"
              value={ entry.graduation_year }
              onChange={ (e) =>
                updateEntry(entry.id, 'graduation_year', e.target.value)
              }
            />
          </div>
        </div>
      )) }
      <button
        type="button"
        onClick={ addEntry }
        className="flex items-center justify-center h-[28.5px] px-[12.25px] text-[#374151] text-[12px] font-medium hover:bg-white/50 rounded-[8px] transition-colors self-start cursor-pointer"
      >
        + Agregar otra educación
      </button>
    </div>
  );
};
