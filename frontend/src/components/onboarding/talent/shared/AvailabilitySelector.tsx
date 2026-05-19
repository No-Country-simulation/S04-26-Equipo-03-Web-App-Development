'use client';

import { AvailabilityCard } from './AvailabilityCard';

interface AvailabilitySelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export const AvailabilitySelector = ({ selectedId, onSelect }: AvailabilitySelectorProps) => {
  const availabilityOptions = [
    {
      id: 'ACTIVE_JOB_SEARCH',
      title: 'Disponible activamente',
      description: 'Estoy buscando trabajo ahora'
    },
    {
      id: 'OPEN_TO_OFFERS',
      title: 'Trabajando pero abierto/a',
      description: 'Escucharía buenas oportunidades'
    },
    {
      id: 'NOT_LOOKING_ASSESSMENT_ONLY',
      title: 'Por ahora no',
      description: 'Solo quiero medir mi nivel'
    },
  ];

  return (
    <div className="flex flex-col gap-[7.99px] w-full mb-[24px]">
      <label className="text-[#374151] text-[12px] font-medium font-['Inter'] leading-[18px] pb-[0.865px]">
        Disponibilidad
      </label>
      <div className="flex flex-col gap-[8px] w-full">
        { availabilityOptions.map((option) => (
          <AvailabilityCard
            key={ option.id }
            id={ option.id }
            title={ option.title }
            description={ option.description }
            isSelected={ selectedId === option.id }
            onClick={ () => onSelect(option.id) }
          />
        )) }
      </div>
    </div>
  );
};
