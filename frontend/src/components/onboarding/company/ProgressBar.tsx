interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-[#1a1a2e] shrink-0">
        Paso {currentStep} de {totalSteps}
      </span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#4f46e5] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm text-[#1a1a2e] shrink-0">
        {Math.round(progress)}%
      </span>
    </div>
  )
}
