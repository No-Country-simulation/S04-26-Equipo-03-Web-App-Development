import { AuthInputField } from '@/components/auth/AuthInputField';

export const EducationForm = () => {
  return (
    <div className="flex flex-col gap-[10px] w-full">
      <div className="bg-white border border-[#e5e7eb] p-[15.25px] rounded-[8px] flex flex-col gap-[14px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
          <AuthInputField label="Institución" placeholder="UBA · FADU" />
          <AuthInputField label="Título" placeholder="Diseño Gráfico" />
        </div>
        <div className="w-full sm:w-1/2 sm:pr-[7px]">
          <AuthInputField label="Año de graduación" placeholder="2014" />
        </div>
      </div>
      <button className="flex items-center justify-center h-[28.5px] px-[12.25px] text-[#374151] text-[12px] font-medium hover:bg-white/50 rounded-[8px] transition-colors self-start">
        + Agregar otra educación
      </button>
    </div>
  );
};
