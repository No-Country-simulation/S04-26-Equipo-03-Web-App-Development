'use client';

import { useState } from 'react';
import { AuthInputField } from '@/components/auth/AuthInputField';
import { Checkbox } from '@/components/ui/checkbox';
import { DateInput } from '@/components/ui/date-input';

export interface WorkExperienceEntry {
  id: string;
  company: string;
  role: string;
  description: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

interface ExperienceFormProps {
  value: WorkExperienceEntry[];
  onChange: (value: WorkExperienceEntry[]) => void;
}

function createEmptyEntry(): WorkExperienceEntry {
  return {
    id: crypto.randomUUID(),
    company: '',
    role: '',
    description: '',
    start_date: '',
    end_date: '',
    is_current: false,
  };
}

export const ExperienceForm = ({ value, onChange }: ExperienceFormProps) => {
  const [entries, setEntries] = useState<WorkExperienceEntry[]>(
    value.length > 0 ? value : [createEmptyEntry()],
  );

  const update = (updated: WorkExperienceEntry[]) => {
    setEntries(updated);
    onChange(updated);
  };

  const updateEntry = (
    id: string,
    field: keyof WorkExperienceEntry,
    val: string | boolean,
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
              label="Empresa"
              placeholder="Acme Studio"
              value={ entry.company }
              onChange={ (e) => updateEntry(entry.id, 'company', e.target.value) }
            />
            <AuthInputField
              label="Rol"
              placeholder="Sr Product Designer"
              value={ entry.role }
              onChange={ (e) => updateEntry(entry.id, 'role', e.target.value) }
            />
          </div>
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#374151] text-[12px] font-medium font-['Inter']">
              Descripción breve
            </label>
            <textarea
              placeholder="2 o 3 líneas sobre qué hiciste ahí."
              value={ entry.description }
              onChange={ (e) =>
                updateEntry(entry.id, 'description', e.target.value)
              }
              className="bg-white border border-[#d1d5db] rounded-[8px] px-[13.25px] py-[11.25px] min-h-[80px] text-[13px] outline-none focus:border-[#4f46e5] transition-colors placeholder:text-[#9ca3af]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
            <DateInput
              label="Desde"
              type="month"
              placeholder="MM/YYYY"
              value={ entry.start_date }
              onChange={ (e) =>
                updateEntry(entry.id, 'start_date', e.target.value)
              }
            />
            <div className="flex flex-col gap-[8px]">
              <div
                className={ entry.is_current ? 'opacity-40 pointer-events-none' : '' }
              >
                <DateInput
                  label="Hasta"
                  type="month"
                  placeholder="MM/YYYY"
                  value={ entry.is_current ? '' : entry.end_date }
                  onChange={ (e) =>
                    updateEntry(entry.id, 'end_date', e.target.value)
                  }
                />
              </div>
              <div className="flex items-center gap-[7.99px] pt-[2px]">
                <Checkbox
                  id={ `current-job-${entry.id}` }
                  checked={ entry.is_current }
                  onCheckedChange={ (checked) =>
                    updateEntry(entry.id, 'is_current', !!checked)
                  }
                  className="size-[13px] rounded-[2.5px] border-[#767676]"
                />
                <label
                  htmlFor={ `current-job-${entry.id}` }
                  className="text-[12px] font-medium text-[#374151]"
                >
                  Trabajo acá actualmente
                </label>
              </div>
            </div>
          </div>
        </div>
      )) }
      <button
        type="button"
        onClick={ addEntry }
        className="flex items-center justify-center h-[28.5px] px-[12.25px] text-[#374151] text-[12px] font-medium hover:bg-white/50 rounded-[8px] transition-colors self-start"
      >
        + Agregar otra experiencia
      </button>
    </div>
  );
};
