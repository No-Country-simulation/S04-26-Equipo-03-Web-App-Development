'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface PortfolioFormProps {
  portfolioFile: File | null;
  portfolioUrl: string;
  onFileChange: (file: File | null) => void;
  onUrlChange: (url: string) => void;
}

export const PortfolioForm = ({
  portfolioFile,
  portfolioUrl,
  onFileChange,
  onUrlChange,
}: PortfolioFormProps) => {
  const [portfolioMode, setPortfolioMode] = useState<'pdf' | 'link'>('pdf');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-[9.1px] w-full">
      <div className="bg-[#f3f4f6] border border-[#e5e7eb] p-[4.25px] rounded-full self-start flex gap-[4px]">
        <button
          type="button"
          onClick={ () => {
            setPortfolioMode('pdf');
            onUrlChange('');
          } }
          className={ `px-[14px] py-[6px] rounded-full text-[12px] font-medium transition-all ${portfolioMode === 'pdf'
              ? 'bg-[#111827] text-white'
              : 'text-[#4b5563] hover:text-[#111827]'
            }` }
        >
          Subir PDF
        </button>
        <button
          type="button"
          onClick={ () => {
            setPortfolioMode('link');
            onFileChange(null);
          } }
          className={ `px-[14px] py-[6px] rounded-full text-[12px] font-medium transition-all ${portfolioMode === 'link'
              ? 'bg-[#111827] text-white'
              : 'text-[#4b5563] hover:text-[#111827]'
            }` }
        >
          Pegar link
        </button>
      </div>

      { portfolioMode === 'pdf' ? (
        <>
          <div
            onClick={ () => inputRef.current?.click() }
            className="bg-white border border-[#d1d5db] border-dashed rounded-[12px] p-[33.25px] flex flex-col items-center gap-[3.1px] text-center cursor-pointer hover:border-[#4f46e5] hover:bg-[#f9fafb] transition-colors"
          >
            <div className="size-[40px] bg-[#f3f4f6] rounded-[8px] flex items-center justify-center text-[18px] mb-[6.275px]">
              📄
            </div>
            <span className="text-[13px] font-semibold text-[#111827] font-['Inter'] leading-[19.5px]">
              { portfolioFile
                ? portfolioFile.name
                : 'Arrastrá tu portafolio o hacé clic para subirlo' }
            </span>
            <span className="text-[12px] font-normal text-[#6b7280] font-['Inter'] leading-[18px]">
              Solo PDF · Máx. 10MB
            </span>
            { !portfolioFile && (
              <div className="pt-[8.89px]">
                <Button
                  variant="outline"
                  type="button"
                  className="bg-white border-[#d1d5db] px-[12.25px] py-[8.25px] h-auto rounded-[8px] text-[12px] font-medium text-[#1f2937] shadow-none hover:bg-gray-50 transition-colors"
                >
                  Elegir archivo
                </Button>
              </div>
            ) }
          </div>
          <input
            ref={ inputRef }
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={ (e) => {
              const f = e.target.files?.[0];
              if (f) onFileChange(f);
            } }
          />
        </>
      ) : (
        <input
          type="url"
          placeholder="https://tu-portfolio.com"
          value={ portfolioUrl }
          onChange={ (e) => onUrlChange(e.target.value) }
          className="bg-white border border-[#d1d5db] rounded-[8px] px-[12px] h-[43.98px] w-full text-[13px] outline-none focus:border-[#4f46e5] transition-colors placeholder:text-[#9ca3af]"
        />
      ) }

      <p className="text-[11.5px] text-[#6b7280] font-normal font-['Inter'] leading-[17.25px]">
        Solo una de las dos opciones — si subís PDF, el link queda inactivo, y viceversa.
      </p>
    </div>
  );
};
