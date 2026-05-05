'use client';

import { Search } from 'lucide-react';

interface CompanySearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const CompanySearchField = ({ value, onChange, placeholder = "Buscar empresa..." }: CompanySearchFieldProps) => {
  return (
    <div className="relative">
      <div className="absolute left-[13.25px] top-[13px] text-[#4f46e5]">
        <Search className="size-[18px]" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-[#d1d5db] h-[43.98px] pl-[40px] pr-[13.25px] rounded-[8px] w-full text-[14px] leading-[21px] placeholder:text-[#9ca3af] outline-none border-solid focus:border-[#4f46e5] transition-colors shadow-none"
      />
    </div>
  );
};
