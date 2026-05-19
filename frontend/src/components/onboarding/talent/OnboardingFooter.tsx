import { Button } from '@/components/ui/button';

interface OnboardingFooterProps {
  step: number;
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;
}

export const OnboardingFooter = ({ step, onNext, onBack, onSkip, isLastStep, isSubmitting }: OnboardingFooterProps) => {
  return (
    <footer className="w-full bg-white border-t-[1.25px] border-[#e5e7eb] mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto px-[16px] md:px-[31.99px] pt-[15.25px] pb-[14px] gap-4 md:gap-0">
        <button
          onClick={ onBack }
          disabled={ step === 1 }
          className={ `text-[#374151] text-[13px] font-medium font-['Inter'] leading-[13px] hover:text-[#111827] transition-colors flex items-center ${step === 1 ? 'opacity-0 pointer-events-none' : ''
            } self-start md:self-center` }
        >
          ← Atrás
        </button>

        <div className="flex flex-col sm:flex-row gap-[7.99px] items-center w-full md:w-auto">
          { (step === 2 || step === 3) && (
            <Button
              variant="outline"
              onClick={ onSkip }
              className="bg-white border-[#d1d5db] px-[17.25px] py-[11.25px] h-auto rounded-[8px] text-[13px] font-medium text-[#1f2937] shadow-none hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              { step === 2 ? 'Saltear y empezar el diagnóstico' : 'Completar después' }
            </Button>
          ) }
          <Button
            onClick={ onNext }
            disabled={ isSubmitting }
            className="bg-[#4f46e5] text-white text-[13px] font-medium font-['Inter'] h-auto px-[17.25px] py-[11.25px] rounded-[8px] hover:bg-[#4338ca] transition-colors shadow-none w-full sm:w-auto disabled:opacity-60"
          >
            { isSubmitting ? 'Guardando…' : isLastStep ? 'Guardar y empezar el diagnóstico →' : 'Guardar y continuar →' }
          </Button>
        </div>
      </div>
    </footer>
  );
};
