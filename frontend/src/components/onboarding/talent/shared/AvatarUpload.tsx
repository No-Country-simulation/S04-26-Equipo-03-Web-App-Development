'use client';

import { useRef } from 'react';

interface AvatarUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export const AvatarUpload = ({ file, onFileChange }: AvatarUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = file ? URL.createObjectURL(file) : null;

  return (
    <div className="flex items-center gap-[17.99px] mb-[18px] w-full">
      <div className="size-[96px] bg-[#f3f4f6] rounded-full flex flex-col items-center justify-center border border-[#d1d5db] border-dashed overflow-hidden">
        { previewUrl ? (
          <img src={ previewUrl } alt="Avatar" className="size-full object-cover" />
        ) : (
          <>
            <span className="text-[#6b7280] text-[11px] font-normal font-['Consolas'] leading-[16.5px]">foto</span>
            <span className="text-[#6b7280] text-[11px] font-normal font-['Consolas'] leading-[16.5px]">(opcional)</span>
          </>
        ) }
      </div>
      <div className="flex flex-col gap-[5.115px] items-start">
        <button
          type="button"
          onClick={ () => inputRef.current?.click() }
          className="bg-white border border-[#d1d5db] px-[12.25px] py-[8.25px] h-auto rounded-[8px] text-[#1f2937] text-[12px] font-medium font-['Inter'] leading-[12px] shadow-none hover:bg-gray-50 transition-colors"
        >
          Subir foto
        </button>
        <p className="text-[#6b7280] text-[12px] font-normal font-['Inter'] leading-[18px]">
          JPG o PNG · Máx. 2MB · podés agregarla después
        </p>
      </div>
      <input
        ref={ inputRef }
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={ (e) => {
          const f = e.target.files?.[0];
          if (f) onFileChange(f);
        } }
      />
    </div>
  );
};
