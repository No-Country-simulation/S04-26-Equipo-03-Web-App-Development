import { Card } from '../ui/card';

export default function FeaturesSection() {
  return (
    <section className="bg-[#f8f8f8] px-4 sm:px-6 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a2e] text-center mb-8 lg:mb-12">
          Qué nos hace distintos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
            <div className="w-10 h-10 bg-[#1a1a2e] rounded-lg mb-4"></div>
            <h3 className="font-semibold text-[#1a1a2e] mb-2">
              Validación por skill
            </h3>
            <p className="text-sm text-gray-500">
              Cada habilidad se valida por separado. Tu seniority se deriva — no
              es el input.
            </p>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
            <div className="w-10 h-10 bg-[#1a1a2e] rounded-lg mb-4"></div>
            <h3 className="font-semibold text-[#1a1a2e] mb-2">
              Ruta personalizada
            </h3>
            <p className="text-sm text-gray-500">
              No te decimos lo que te falta. Te mostramos tu próximo paso.
            </p>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
            <div className="w-10 h-10 bg-[#1a1a2e] rounded-lg mb-4"></div>
            <h3 className="font-semibold text-[#1a1a2e] mb-2">
              Privacidad por diseño
            </h3>
            <p className="text-sm text-gray-500">
              Tu teléfono nunca aparece. Toggle de visibilidad para
              activar/pausar tu perfil.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
