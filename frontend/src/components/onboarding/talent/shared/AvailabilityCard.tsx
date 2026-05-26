interface AvailabilityCardProps {
  id: string;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export const AvailabilityCard = ({ id, title, description, isSelected, onClick }: AvailabilityCardProps) => {
  return (
    <button
      onClick={ onClick }
      className={ `flex items-center gap-[11.99px] p-[15.25px] rounded-[10px] border border-solid transition-all text-left cursor-pointer shadow-[0px_1px_1px_rgba(17,24,39,0.06),0px_1px_1.5px_rgba(17,24,39,0.08)] ${isSelected
          ? 'bg-[#eef2ff] border-[#4f46e5]'
          : 'bg-white border-[#e5e7eb] hover:border-[#d1d5db]'
        }` }
    >
      <div className={ `size-[16px] rounded-full border border-solid flex items-center justify-center bg-white ${isSelected ? 'border-[#4f46e5]' : 'border-[#9ca3af]'
        }` }>
        { isSelected && (
          <div className="size-[7.99px] bg-[#4f46e5] rounded-full" />
        ) }
      </div>
      <div className="flex flex-col items-start">
        <span className="text-[#111827] text-[14px] font-semibold font-['Inter'] leading-[21px]">
          { title }
        </span>
        <span className="text-[#6b7280] text-[12px] font-normal font-['Inter'] leading-[18px]">
          { description }
        </span>
      </div>
    </button>
  );
};
