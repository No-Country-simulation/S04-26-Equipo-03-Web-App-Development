import { Camera } from 'lucide-react';
import { useState } from 'react';

export const AvatarUpload = () => {
  const [avatar, setAvatar] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-[17.99px] mb-[18px] w-full">
      <div className="size-[96px] bg-[#f3f4f6] rounded-full flex flex-col items-center justify-center border border-[#d1d5db] border-dashed">
        <span className="text-[#6b7280] text-[11px] font-normal font-['Consolas'] leading-[16.5px]">foto</span>
        <span className="text-[#6b7280] text-[11px] font-normal font-['Consolas'] leading-[16.5px]">(opcional)</span>
      </div>
      <div className="flex flex-col gap-[5.115px] items-start">
        <button
          className="bg-white border border-[#d1d5db] px-[12.25px] py-[8.25px] h-auto rounded-[8px] text-[#1f2937] text-[12px] font-medium font-['Inter'] leading-[12px] shadow-none hover:bg-gray-50 transition-colors"
        >
          Subir foto
        </button>
        <p className="text-[#6b7280] text-[12px] font-normal font-['Inter'] leading-[18px]">
          JPG o PNG · Máx. 2MB · podés agregarla después
        </p>
      </div>
    </div>
  );
};
