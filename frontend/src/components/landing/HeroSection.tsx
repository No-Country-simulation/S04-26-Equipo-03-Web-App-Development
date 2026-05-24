import { Check, Heart, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Mascot } from '../common/Mascot';

export default function HeroSection() {
  return (
    <section className="flex-1 px-4 sm:px-6 max-w-7xl mx-auto w-full flex items-center">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 py-8 lg:py-16 w-full">
        <div className="space-y-5 sm:space-y-6">
          <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
            PARA PROFESIONALES 35–54
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a2e] leading-tight">
            Tu experiencia tiene un nivel.
            <br />
            Te ayudamos a demostrarlo.
          </h1>
          <p className="text-gray-600 text-base max-w-md">
            Diagnóstico de habilidades por IA, ruta personalizada y matches con
            empresas que buscan talento senior real.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button className="bg-[#1a1a2e] hover:bg-[#1a1a2e]/90 text-white px-6 py-2.5 h-auto rounded-md">
              Busco trabajo
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 text-[#1a1a2e] px-6 py-2.5 h-auto rounded-md hover:bg-gray-50"
            >
              Busco talento
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-gray-500 pt-2">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Sin spam de reclutadores</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Tu teléfono nunca se publica</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Gratis para postulantes</span>
            </div>
          </div>
        </div>

        {/* Profile Card */ }
        <div className="flex justify-center lg:justify-end relative">
          <Card className="w-full max-w-sm p-5 shadow-lg border border-gray-100 rounded-xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 shrink-0">
                MR
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-[#1a1a2e]">Marcela R.</h3>
                <p className="text-sm text-gray-500 truncate">
                  Product Designer · Buenos Aires
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 bg-[#4f46e5] text-white text-xs px-2.5 py-1 rounded-full">
                <Check className="w-3 h-3" />
                Semi-Senior
              </span>
              <div className="flex items-center gap-0.5">
                { [...Array(5)].map((_, i) => (
                  <Star
                    key={ i }
                    className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                  />
                )) }
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center gap-1 border border-[#4f46e5] text-[#4f46e5] text-xs px-2.5 py-1 rounded-full">
                <Check className="w-3 h-3" />
                Figma
              </span>
              <span className="inline-flex items-center gap-1 border border-[#4f46e5] text-[#4f46e5] text-xs px-2.5 py-1 rounded-full">
                <Check className="w-3 h-3" />
                Research
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                Design Systems
              </span>
              <span className="text-xs text-gray-400">pendiente</span>
            </div>

            <div className="space-y-1 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full shrink-0"></span>
                <span className="text-sm text-gray-600">
                  Open to work · Remoto
                </span>
              </div>
              <p className="text-sm text-gray-500">
                12 años exp. · Último: Sr Designer en —
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button className="flex-1 bg-[#1a1a2e] hover:bg-[#1a1a2e]/90 text-white text-sm py-2.5 h-auto rounded-md">
                Ver perfil completo
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-200 h-10 w-10 rounded-md"
              >
                <Heart className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </Card>
          <Mascot variant="idle" className="absolute bottom-0 -right-20 w-50 h-auto hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
