import { StepHeader } from '../shared/StepHeader';
import { AvatarUpload } from '../shared/AvatarUpload';
import { CompanyRestrictions } from '../shared/CompanyRestrictions';
import { PersonalDataFields } from '../shared/PersonalDataFields';
import { AvailabilitySelector } from '../shared/AvailabilitySelector';

interface Step1Props {
  data: any;
  onUpdate: (newData: any) => void;
  errors?: Record<string, string>;
}

export function Step1({ data, onUpdate, errors = {} }: Step1Props) {
  return (
    <div className="flex flex-col items-start w-full animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <StepHeader
        badge={ { text: 'Obligatorio', variant: 'obligatorio' } }
        title="Empecemos con lo básico"
        subtitle="Quién sos y dónde estás. Te toma menos de un minuto."
      />

      <AvatarUpload
        file={ data.avatar }
        onFileChange={ (file) => onUpdate({ avatar: file }) }
      />

      <PersonalDataFields
        data={ data }
        onUpdate={ onUpdate }
        errors={ { name: errors.name, surname: errors.surname } }
      />

      <AvailabilitySelector
        selectedId={ data.availability }
        onSelect={ (id) => onUpdate({ availability: id }) }
      />

      <CompanyRestrictions
        selectedCompanies={ data.blocked_enterprises }
        onChange={ (companies) => onUpdate({ blocked_enterprises: companies }) }
      />
    </div>
  );
}
