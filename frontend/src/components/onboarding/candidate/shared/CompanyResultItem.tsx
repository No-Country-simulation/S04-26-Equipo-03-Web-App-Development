'use client';

interface CompanyResultItemProps {
  name: string;
  onClick: () => void;
}

export const CompanyResultItem = ({ name, onClick }: CompanyResultItemProps) => {
  return (
    <button
      onClick={onClick}
      className="px-[13.25px] py-[11px] text-left text-[14px] font-medium text-[#374151] hover:bg-[#f9fafb] border-b border-[#f3f4f6] last:border-none transition-colors w-full"
    >
      {name}
    </button>
  );
};
