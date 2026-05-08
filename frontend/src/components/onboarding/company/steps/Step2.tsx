'use client';
interface Step2Props {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  onNext: () => void;
  // onBack: () => void;
}

export function Step2({}: Step2Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1a1a2e]">
          Detalles adicionales
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Completá la información restante
        </p>
      </div>

      <div className="space-y-4">
        {/* Campos del paso 2 - por implementar */}
        <p className="text-sm text-gray-400">Campos pendientes...</p>
      </div>

      {/* <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-gray-300 text-[#1a1a2e] text-sm py-2.5 rounded-md hover:bg-gray-50"
        >
          Atrás
        </button>
        <button
          onClick={() => {}}
          className="flex-1 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm py-2.5 rounded-md"
        >
          Finalizar
        </button>
      </div> */}
    </div>
  );
}
