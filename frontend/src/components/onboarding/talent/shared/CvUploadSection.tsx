'use client';

import { FileText } from 'lucide-react';
import { Mascot } from '@/components/common/Mascot';
import { useRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface CvUploadSectionProps {
  file: File | null;
  skipCv: boolean;
  onFileChange: (file: File | null) => void;
  onSkipChange: (skip: boolean) => void;
}

export const CvUploadSection = ({
  file,
  skipCv,
  onFileChange,
  onSkipChange,
}: CvUploadSectionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') onFileChange(dropped);
  };

  return (
    <div className="flex flex-col gap-[8px] w-full mb-[32px]">
      <label className="text-[#374151] text-[12px] font-medium font-['Inter'] leading-[18px]">
        CV{ ' ' }
        <span className="bg-[#f3f4f6] text-[#374151] px-[6px] py-[2px] rounded-[4px] text-[10px] font-medium ml-1">
          Opcional
        </span>
      </label>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[12px]">
        {/* Ruty callout */ }
        <div className="bg-[#eef2ff] border border-[#c7d2fe] rounded-[10px] p-[13.25px] flex items-start gap-[11px]">
          <div className="size-[36px] rounded-full bg-white flex items-center justify-center shrink-0 border border-[#c7d2fe]">
            <Mascot variant="idle" className="w-[22px] h-[22px]" />
          </div>
          <p className="text-[#1f2937] text-[13px] leading-[19.5px] font-['Inter']">
            ¿Querés que revise tu CV para el rol que elegiste? Te marco lo que
            se puede mejorar.
          </p>
        </div>

        {/* Upload area */ }
        <div
          onDragOver={ (e) => e.preventDefault() }
          onDrop={ handleDrop }
          onClick={ () => !skipCv && inputRef.current?.click() }
          className={ `bg-white border border-dashed border-[#d1d5db] rounded-[10px] p-[20px] flex flex-col items-center justify-center gap-[6px] text-center transition-colors ${!skipCv
            ? 'cursor-pointer hover:border-[#4f46e5] hover:bg-[#f9fafb]'
            : 'opacity-40 pointer-events-none'
            }` }
        >
          <FileText className="size-[28px] text-[#9ca3af]" />
          <span className="text-[13px] font-medium text-[#111827] font-['Inter']">
            { file ? file.name : 'Arrastrá tu CV o elegí un archivo' }
          </span>
          <span className="text-[11px] text-[#6b7280] font-['Inter']">
            PDF · Max. 10MB
          </span>
        </div>
      </div>

      <div className="flex items-center gap-[8px]">
        <Checkbox
          id="skip-cv"
          checked={ skipCv }
          onCheckedChange={ (checked) => {
            onSkipChange(!!checked);
            if (checked) onFileChange(null);
          } }
          className="size-[13px] rounded-[2.5px] border-[#767676]"
        />
        <label
          htmlFor="skip-cv"
          className="text-[12px] text-[#374151] font-medium font-['Inter']"
        >
          Lo subo después
        </label>
      </div>

      <input
        ref={ inputRef }
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={ (e) => {
          const f = e.target.files?.[0];
          if (f) onFileChange(f);
        } }
      />
    </div>
  );
};
