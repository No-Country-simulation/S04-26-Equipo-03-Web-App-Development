interface ExperienceYearsSelectorProps {
  value: string | null;
  onChange: (value: string) => void;
}

const OPTIONS = [
  { label: 'Menos de 2 años' },
  { label: '2 a 5 años' },
  { label: '5 a 10 años' },
  { label: 'Más de 10 años' },
];

export const ExperienceYearsSelector = ({
  value,
  onChange,
}: ExperienceYearsSelectorProps) => {
  return (
    <div className="flex flex-col gap-[6px] w-full mb-[32px]">
      <div className="flex items-baseline gap-[6px]">
        <label className="text-[#374151] text-[12px] font-medium font-['Inter'] leading-[18px]">
          ¿Hace cuánto trabajás en este rol?
        </label>
        <span className="text-[#6b7280] text-[12px] font-normal font-['Inter']">
          Una sola opción
        </span>
      </div>
      <div className="flex flex-wrap gap-[8px]">
        { OPTIONS.map((option) => (
          <button
            key={ option.label }
            type="button"
            onClick={ () => onChange(option.label) }
            className={ `px-[16px] py-[8px] rounded-full text-[13px] font-medium font-['Inter'] border transition-all ${value === option.label
              ? 'bg-[#111827] text-white border-[#111827]'
              : 'bg-white text-[#374151] border-[#d1d5db] hover:border-[#9ca3af]'
              }` }
          >
            { option.label }
          </button>
        )) }
      </div>
    </div>
  );
};
