export default function HowItWorks() {
  return (
    <section className="bg-[#f8f8f8] px-4 sm:px-6 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a2e] mb-2">
            Cómo funciona
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            Dos caminos simétricos, una sola plataforma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          {/* Si buscás trabajo */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4 sm:mb-6">
              SI BUSCÁS TRABAJO
            </h3>
            <div className="space-y-4">
              {[
                'Creá tu perfil en 4 pasos',
                'Hacé el diagnóstico (15 min)',
                'Recibí tu nivel validado y tu ruta',
                'Postulate o esperá matches',
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-7 h-7 bg-[#1a1a2e] rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-[#1a1a2e] text-sm sm:text-base">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Si buscás talento */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4 sm:mb-6">
              SI BUSCÁS TALENTO
            </h3>
            <div className="space-y-4">
              {[
                'Registrá tu empresa',
                'Definí roles y stacks habituales',
                'Filtrá candidatos con nivel validado',
                'Contactá por email cuando quieras',
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-7 h-7 bg-[#1a1a2e] rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-[#1a1a2e] text-sm sm:text-base">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
