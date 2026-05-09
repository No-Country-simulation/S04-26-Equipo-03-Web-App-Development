import { AuthInputField } from '@/components/auth/AuthInputField';
import { Checkbox } from '@/components/ui/checkbox';

export const ExperienceForm = () => {
  return (
    <div className="flex flex-col gap-[10px] w-full">
      <div className="bg-white border border-[#e5e7eb] p-[15.25px] rounded-[8px] flex flex-col gap-[14px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
          <AuthInputField label="Empresa" placeholder="Acme Studio" />
          <AuthInputField label="Rol" placeholder="Sr Product Designer" />
        </div>
        <div className="flex flex-col gap-[8px]">
          <label className="text-[#374151] text-[12px] font-medium font-['Inter']">Descripción breve</label>
          <textarea 
            placeholder="2 o 3 líneas sobre qué hiciste ahí."
            className="bg-white border border-[#d1d5db] rounded-[8px] px-[13.25px] py-[11.25px] min-h-[80px] text-[13px] outline-none focus:border-[#4f46e5] transition-colors placeholder:text-[#9ca3af]"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] items-end">
          <AuthInputField label="Desde" placeholder="03 / 2020" />
          <div className="flex flex-col gap-[8px]">
            <AuthInputField label="Hasta" placeholder="12 / 2023" />
            <div className="flex items-center gap-[7.99px] pt-[8px]">
              <Checkbox id="current-job" className="size-[13px] rounded-[2.5px] border-[#767676]" />
              <label htmlFor="current-job" className="text-[12px] font-medium text-[#374151]">Trabajo acá actualmente</label>
            </div>
          </div>
        </div>
      </div>
      <button className="flex items-center justify-center h-[28.5px] px-[12.25px] text-[#374151] text-[12px] font-medium hover:bg-white/50 rounded-[8px] transition-colors self-start">
        + Agregar otra experiencia
      </button>
    </div>
  );
};
