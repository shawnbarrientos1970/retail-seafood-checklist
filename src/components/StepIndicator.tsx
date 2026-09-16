import React from 'react';
import { Building2, ClipboardCheck, ShieldCheck, Camera, FileText } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onSelectStep?: (step: number) => void;
}

const stepsMeta = [
  { step: 1, title: 'Store Info', icon: Building2 },
  { step: 2, title: 'Case & Dept', icon: ClipboardCheck },
  { step: 3, title: 'Compliance', icon: ShieldCheck },
  { step: 4, title: 'Photos & Notes', icon: Camera },
  { step: 5, title: 'Summary & PDF', icon: FileText },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps, onSelectStep }) => {
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div id="step-indicator-container" className="w-full bg-[#0b203e] border-b border-blue-950/80 px-4 pt-3 pb-3 text-white">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-300">
            Step {currentStep} of {totalSteps}
          </span>
          <h2 className="text-base font-bold text-white leading-tight">
            {stepsMeta[currentStep - 1]?.title || ''}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-blue-200/80 font-medium">
            {progressPercent}% Done
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-blue-950/80 rounded-full h-1.5 overflow-hidden mb-3">
        <div
          className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 h-1.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Pills */}
      <div className="grid grid-cols-5 gap-1">
        {stepsMeta.map((item) => {
          const Icon = item.icon;
          const isActive = item.step === currentStep;
          const isCompleted = item.step < currentStep;

          return (
            <button
              key={item.step}
              type="button"
              id={`step-pill-${item.step}`}
              onClick={() => onSelectStep && onSelectStep(item.step)}
              className={`min-h-[44px] flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-colors text-center cursor-pointer ${
                isActive
                  ? 'bg-[#153a6e] text-white ring-1 ring-sky-400/60 shadow-xs'
                  : isCompleted
                  ? 'text-blue-200 hover:bg-[#153a6e]/50 active:bg-[#153a6e]/70'
                  : 'text-blue-300/40 hover:text-blue-200 active:bg-blue-900/30'
              }`}
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full mb-0.5">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-300' : isCompleted ? 'text-sky-400' : 'text-blue-400/40'}`} />
              </div>
              <span className="text-[10px] font-medium truncate max-w-full leading-none">
                {item.title.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
