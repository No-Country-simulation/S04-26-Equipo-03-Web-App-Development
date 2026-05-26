import { useState } from 'react';
import { CompanyRestrictionsModal } from './CompanyRestrictionsModal';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { EnterpriseRecord } from '@/lib/api/enterprises';

interface CompanyRestrictionsProps {
  selectedCompanies: EnterpriseRecord[];
  onChange: (companies: EnterpriseRecord[]) => void;
}

export const CompanyRestrictions = ({
  selectedCompanies,
  onChange,
}: CompanyRestrictionsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleCompany = (company: EnterpriseRecord) => {
    const updated = selectedCompanies.some((c) => c.id === company.id)
      ? selectedCompanies.filter((c) => c.id !== company.id)
      : [...selectedCompanies, company];
    onChange(updated);
  };

  return (
    <div className="w-full pt-[15.865px] border-t-[1.25px] border-dashed border-[#d1d5db] flex flex-col gap-[3.48px] items-start mt-[8px]">
      <button
        type="button"
        onClick={ () => setIsModalOpen(true) }
        className="text-[#4f46e5] text-[13px] font-medium font-['Inter'] leading-[19.5px] hover:underline cursor-pointer"
      >
        + Agregar restricción de empresas
      </button>

      { selectedCompanies.length > 0 && (
        <div className="flex flex-wrap gap-[6px] py-[8px]">
          { selectedCompanies.map((company) => (
            <Badge
              key={ company.id }
              className="bg-[#f3f4f6] text-[#374151] px-[8px] py-[2px] rounded-full flex items-center gap-[4px] font-normal text-[11px] border-none"
            >
              { company.name }
              <button type="button" onClick={ () => toggleCompany(company) } className="text-[#9ca3af] hover:text-[#ef4444] cursor-pointer">
                <X className="size-[10px]" />
              </button>
            </Badge>
          )) }
        </div>
      ) }

      <p className="text-[#6b7280] text-[12px] font-normal font-['Inter'] leading-[18px]">
        Si no querés que alguna empresa te vea (ej. tu empleador actual), podés bloquearla.
      </p>

      <CompanyRestrictionsModal
        isOpen={ isModalOpen }
        onClose={ () => setIsModalOpen(false) }
        selectedCompanies={ selectedCompanies }
        onToggleCompany={ toggleCompany }
      />
    </div>
  );
};
