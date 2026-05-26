'use client';

import { X } from 'lucide-react';

interface CompanyRestrictionsHeaderProps {
  onClose: () => void;
}

export const CompanyRestrictionsHeader = ({ onClose }: CompanyRestrictionsHeaderProps) => {
  return (
    <div className="p-[20px] pb-[12px] flex flex-col gap-[4px] relative">
      <button
        onClick={ onClose }
        className="absolute right-[16px] top-[16px] text-[#9ca3af] hover:text-[#111827] transition-colors cursor-pointer"
      >
        <X className="size-[18px]" />
      </button>
      <h2 className="text-[#111827] text-[16px] font-bold font-['Inter'] leading-[24px]">
        ¿Querés que alguna empresa no te vea?
      </h2>
      <p className="text-[#6b7280] text-[13px] font-normal font-['Inter'] leading-[19.5px]">
        Tu perfil no aparecerá en las búsquedas de esa empresa. Es opcional y podés cambiarlo cuando quieras.
      </p>
    </div>
  );
};
