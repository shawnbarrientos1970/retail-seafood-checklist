import React from 'react';
import { Store, Layers, ClipboardCheck, Camera, BarChart3, Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onSelectStep: (step: number) => void;
}

const STEPS = [
  { step: 1, label: 'Store', icon: Store },
  { step: 2, label: 'Cases', icon: Layers },
  { step: 3, label: 'Audit', icon: ClipboardCheck },
  { step: 4, label: 'Photos', icon: Camera },
  { step: 5, label: 'Summary', icon: BarChart3 },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps = 5,
  onSelectStep,
}) => {
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="px-4 pt-1.5 pb-2.5">
      {/* Progress track */}
      <div className="relative flex items-center justify-between mb-2">
        <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-1 bg-blue-950/80 rounded-full z-0">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {STEPS.map((item) => {
          const isCompleted = item.step < currentStep;
          const isCurrent = item.step === currentStep;
          const IconComponent = item.icon;

          return (
            <button
              key={item.step}
              type="button"
              id={`step-indicator-${item.step}`}
              onClick={() => onSelectStep(item.step)}
              className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-hidden"
              title={`Go to step ${item.step}: ${item.label}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                  isCurrent
                    ? 'bg-sky-400 text-slate-950 ring-4 ring-sky-400/30 shadow-md scale-110'
                    : isCompleted
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-[#10243e] text-slate-400 border border-blue-900/60 hover:bg-[#163155]'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span>{item.step}</span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-semibold transition-colors ${
                  isCurrent
                    ? 'text-sky-300 font-bold'
                    : isCompleted
                    ? 'text-blue-300'
                    : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
