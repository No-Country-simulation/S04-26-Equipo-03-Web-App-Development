'use client';
interface Step1Props {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  onNext: () => void;
}

export function Step1({ onNext }: Step1Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1a1a2e]">
          Información de la empresa
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Completá los datos básicos de tu empresa
        </p>
      </div>

      <div className="space-y-4">
        {/* Campos del paso 1 - por implementar */}
        <p className="text-sm text-gray-400">Campos pendientes...</p>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm py-2.5 rounded-md"
      >
        Siguiente
      </button>
    </div>
  );
}
