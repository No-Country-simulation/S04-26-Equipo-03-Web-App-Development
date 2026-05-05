'use client';

import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BlockedCompanyTagProps {
  name: string;
  onRemove: () => void;
}

export const BlockedCompanyTag = ({ name, onRemove }: BlockedCompanyTagProps) => {
  return (
    <Badge
      className="bg-white border-[#e5e7eb] text-[#374151] px-[11.25px] py-[6px] rounded-full flex items-center gap-[6px] font-medium text-[12px] border shadow-none"
    >
      {name}
      <button 
        onClick={onRemove}
        className="text-[#9ca3af] hover:text-[#ef4444] transition-colors"
      >
        <X className="size-[12px]" />
      </button>
    </Badge>
  );
};
