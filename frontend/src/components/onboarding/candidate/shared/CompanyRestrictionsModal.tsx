'use client';

import { useState } from 'react';
import { CompanySearchField } from './CompanySearchField';
import { CompanyResultItem } from './CompanyResultItem';
import { BlockedCompanyTag } from './BlockedCompanyTag';
import { CompanyRestrictionsHeader } from './CompanyRestrictionsHeader';
import { CompanyRestrictionsFooter } from './CompanyRestrictionsFooter';

interface CompanyRestrictionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompanies: string[];
  onToggleCompany: (company: string) => void;
}

export const CompanyRestrictionsModal = ({
  isOpen,
  onClose,
  selectedCompanies,
  onToggleCompany,
}: CompanyRestrictionsModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const companies = ['Mercado Libre', 'Despegar', 'Globant', 'Accenture', 'Google', 'Meta'];

  if (!isOpen) return null;

  const filteredCompanies = companies.filter(c => 
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div 
        className="bg-white w-full max-w-[480px] rounded-[12px] shadow-[0px_10px_25px_rgba(17,24,39,0.1),0px_4px_10px_rgba(17,24,39,0.05)] overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <CompanyRestrictionsHeader onClose={onClose} />

        <div className="px-[20px] pb-[20px] flex flex-col gap-[12px]">
          <CompanySearchField 
            value={searchTerm} 
            onChange={setSearchTerm} 
          />

          <div className="bg-white border border-[#e5e7eb] rounded-[8px] flex flex-col max-h-[160px] overflow-y-auto">
            {filteredCompanies.map((company) => (
              <CompanyResultItem
                key={company}
                name={company}
                onClick={() => onToggleCompany(company)}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-[8px] min-h-[32px]">
            {selectedCompanies.map((company) => (
              <BlockedCompanyTag
                key={company}
                name={company}
                onRemove={() => onToggleCompany(company)}
              />
            ))}
          </div>
        </div>

        <CompanyRestrictionsFooter />
      </div>
    </div>
  );
};
