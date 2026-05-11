import { AuthInputField } from '@/components/auth/AuthInputField';

interface PersonalDataFieldsProps {
  data: any;
  onUpdate: (newData: any) => void;
}

export const PersonalDataFields = ({ data, onUpdate }: PersonalDataFieldsProps) => {
  return (
    <div className="flex flex-col gap-[20.84px] w-full mb-[24px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] w-full">
        <div className="relative">
          <AuthInputField
            label="Nombre"
            placeholder="Marcela"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
          {data.name && (
            <div className="absolute right-[13.25px] top-[43px] text-[#10b981] text-[13px]">✓</div>
          )}
        </div>
        <AuthInputField
          label="Apellido"
          placeholder="R."
          value={data.surname}
          onChange={(e) => onUpdate({ surname: e.target.value })}
        />
      </div>
      
      <div className="flex flex-col gap-[6px]">
        <AuthInputField
          label="Ubicación"
          placeholder="Buenos Aires, Argentina"
          value={data.location}
          onChange={(e) => onUpdate({ location: e.target.value })}
        />
        <p className="text-[#6b7280] text-[12px] font-normal font-['Inter'] leading-[18px]">
          Solo se usa para mostrar matches relevantes
        </p>
      </div>
    </div>
  );
};
