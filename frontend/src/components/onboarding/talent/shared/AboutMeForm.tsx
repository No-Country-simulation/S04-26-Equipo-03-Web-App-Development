interface AboutMeFormProps {
  value: string;
  onChange: (value: string) => void;
}

export const AboutMeForm = ({ value, onChange }: AboutMeFormProps) => {
  return (
    <div className="flex flex-col gap-[8px] w-full">
      <label className="text-[#374151] text-[12px] font-medium font-['Inter']">Sobre mí</label>
      <textarea
        placeholder="Diseñadora con foco en producto y sistemas. Me interesa…"
        value={ value }
        onChange={ (e) => onChange(e.target.value) }
        className="bg-white border border-[#d1d5db] rounded-[8px] px-[13.25px] py-[11.25px] min-h-[120px] text-[13px] outline-none focus:border-[#4f46e5] transition-colors placeholder:text-[#9ca3af]"
      />
    </div>
  );
};
