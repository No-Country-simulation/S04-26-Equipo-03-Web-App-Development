import { StepHeader } from '../shared/StepHeader';
import { AvatarUpload } from '../shared/AvatarUpload';
import { CompanyRestrictions } from '../shared/CompanyRestrictions';
import { PersonalDataFields } from '../shared/PersonalDataFields';
import { AvailabilitySelector } from '../shared/AvailabilitySelector';

interface Step1Props {
  data: any;
  onUpdate: (newData: any) => void;
}

export function Step1({ data, onUpdate }: Step1Props) {
  return (
    <div className="flex flex-col items-start w-full animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <StepHeader 
        badge={{ text: 'Obligatorio', variant: 'obligatorio' }}
        title="Empecemos con lo básico"
        subtitle="Quién sos y dónde estás. Te toma menos de un minuto."
      />

      <AvatarUpload />

      <PersonalDataFields data={data} onUpdate={onUpdate} />

      <AvailabilitySelector 
        selectedId={data.availability} 
        onSelect={(id) => onUpdate({ availability: id })} 
      />

      <CompanyRestrictions />
    </div>
  );
}
