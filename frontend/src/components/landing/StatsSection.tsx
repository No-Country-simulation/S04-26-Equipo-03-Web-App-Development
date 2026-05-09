export default function StatsSection() {
  return (
    <section className="px-4 sm:px-6 py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a2e]">
              12.4k
            </p>
            <p className="text-sm text-gray-500 mt-1">
              profesionales validados
            </p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a2e]">
              430+
            </p>
            <p className="text-sm text-gray-500 mt-1">empresas activas</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1a2e]">
              68%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              de matches reciben respuesta
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
