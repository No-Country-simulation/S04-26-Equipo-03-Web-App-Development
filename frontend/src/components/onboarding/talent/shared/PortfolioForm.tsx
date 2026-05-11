import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const PortfolioForm = () => {
  const [portfolioMode, setPortfolioMode] = useState<'pdf' | 'link'>('pdf');

  return (
    <div className="flex flex-col gap-[9.1px] w-full">
      <div className="bg-[#f3f4f6] border border-[#e5e7eb] p-[4.25px] rounded-full self-start flex gap-[4px]">
        <button 
          onClick={() => setPortfolioMode('pdf')}
          className={`px-[14px] py-[6px] rounded-full text-[12px] font-medium transition-all ${
            portfolioMode === 'pdf' ? 'bg-[#111827] text-white' : 'text-[#4b5563] hover:text-[#111827]'
          }`}
        >
          Subir PDF
        </button>
        <button 
          onClick={() => setPortfolioMode('link')}
          className={`px-[14px] py-[6px] rounded-full text-[12px] font-medium transition-all ${
            portfolioMode === 'link' ? 'bg-[#111827] text-white' : 'text-[#4b5563] hover:text-[#111827]'
          }`}
        >
          Pegar link
        </button>
      </div>

      <div className="bg-white border border-[#d1d5db] border-dashed rounded-[12px] p-[33.25px] flex flex-col items-center gap-[3.1px] text-center">
        <div className="size-[40px] bg-[#f3f4f6] rounded-[8px] flex items-center justify-center text-[18px] mb-[6.275px]">📄</div>
        <span className="text-[13px] font-semibold text-[#111827] font-['Inter'] leading-[19.5px]">
          Arrastrá tu portafolio o hacé clic para subirlo
        </span>
        <span className="text-[12px] font-normal text-[#6b7280] font-['Inter'] leading-[18px]">
          Solo PDF · Máx. 10MB
        </span>
        <div className="pt-[8.89px]">
          <Button variant="outline" className="bg-white border-[#d1d5db] px-[12.25px] py-[8.25px] h-auto rounded-[8px] text-[12px] font-medium text-[#1f2937] shadow-none hover:bg-gray-50 transition-colors">
            Elegir archivo
          </Button>
        </div>
      </div>
      <p className="text-[11.5px] text-[#6b7280] font-normal font-['Inter'] leading-[17.25px]">
        Solo una de las dos opciones — si subís PDF, el link queda inactivo, y viceversa.
      </p>
    </div>
  );
};
