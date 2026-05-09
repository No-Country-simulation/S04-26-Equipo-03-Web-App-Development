import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface StackSelectorProps {
  stack: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export const StackSelector = ({ stack, onAddTag, onRemoveTag }: StackSelectorProps) => {
  const [currentTag, setCurrentTag] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag) {
      onAddTag(currentTag);
      setCurrentTag('');
    }
  };

  return (
    <div className="flex flex-col gap-[20.84px] w-full mb-[32px]">
      <div className="flex flex-col gap-[6px]">
        <label className="text-[#374151] text-[12px] font-medium font-['Inter'] leading-[18px]">
          Stack y herramientas <span className="text-[#ef4444]">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscá: Figma, React, SQL…"
            className="bg-white border-[#d1d5db] h-[43.98px] px-[12px] rounded-[8px] w-full text-[14px] leading-[21px] placeholder:text-[#6b7280] outline-none border-solid focus:border-[#4f46e5]"
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <p className="text-[#111827] text-[14px] font-normal font-['Inter'] leading-[21px]">
          Mínimo 3. Vas a poder modificarlas más adelante.
        </p>
      </div>

      <div className="flex flex-wrap gap-[6px] pt-[2px]">
        {stack.map((tag: string) => (
          <Badge
            key={tag}
            className="bg-[#f3f4f6] border-[#e5e7eb] text-[#374151] px-[11.25px] py-[6.25px] rounded-full flex items-center gap-[6px] font-normal text-[12px] border transition-colors shadow-none"
          >
            {tag}
            <button onClick={() => onRemoveTag(tag)} className="text-[#6b7280] hover:text-[#ef4444]">
              <X className="size-[11px]" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};
