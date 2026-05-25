import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface OnboardingFooterProps {
  step: number;
  onNext: () => void;
  onBack?: () => void;
  backHref?: string;
  nextLabel?: string;
  loading?: boolean;
}

export function OnboardingFooter({
  step,
  onNext,
  onBack,
  backHref = '/',
  nextLabel = 'Guardar y continuar',
  loading = false,
}: OnboardingFooterProps) {
  return (
    <div className="flex items-center justify-between content-center px-8 py-4 border-t border-gray-100">
      {/* Atrás */ }
      <div>
        { step === 1 ? (
          <Link
            href={ backHref }
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a1a2e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </Link>
        ) : (
          <button
            onClick={ onBack }
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a1a2e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </button>
        ) }
      </div>

      {/* Guardar y continuar */ }
      <Button
        onClick={ onNext }
        disabled={ loading }
        className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm px-6 py-2.5 h-auto rounded-md flex items-center gap-2"
      >
        { loading ? 'Guardando...' : nextLabel }
        { !loading && <ArrowRight className="w-4 h-4" /> }
      </Button>
    </div>
  );
}
