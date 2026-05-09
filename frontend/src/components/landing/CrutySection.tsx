export default function CrutySection() {
  return (
    <section className="px-4 sm:px-6 py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 max-w-2xl mx-auto text-center sm:text-left">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#e8e4ff] rounded-full flex items-center justify-center shrink-0">
            <div className="text-3xl sm:text-4xl">:)</div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
              <span className="font-semibold text-[#1a1a2e]">
                CONOCÉ A CRUTY
              </span>{' '}
              <span className="text-gray-400">(nombre placeholder)</span>
            </p>
            <h3 className="text-base sm:text-lg font-semibold text-[#1a1a2e] mb-2">
              Te acompaña en cada paso del camino.
            </h3>
            <p className="text-sm text-gray-500">
              Te avisa cuando avanzás, te sugiere recursos según tu perfil, y te
              recuerda dónde te quedaste. Adulto y sobrio — no infantil.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
