import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  label: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

export default function ProgressSteps({
  steps,
  currentStep
}: ProgressStepsProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Connection Lines */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-indigo-500 -translate-y-1/2 z-0 transition-all duration-500 ease-in-out" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        {steps.map((step, idx) => {
          const isComplete = idx < currentStep;
          const isActive = idx === currentStep;

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300
                  ${isComplete ? 'bg-emerald-500 border-emerald-50 text-white' : 
                    isActive ? 'bg-indigo-600 border-indigo-50 text-white scale-110 shadow-lg shadow-indigo-200' : 
                    'bg-white border-slate-50 text-slate-300'}
                `}
              >
                {isComplete ? (
                  <Check size={18} strokeWidth={3} />
                ) : (
                  <span className="text-sm font-bold">{idx + 1}</span>
                )}
              </div>
              <span className={`
                text-[10px] uppercase tracking-widest font-bold whitespace-nowrap
                ${isActive ? 'text-indigo-600' : isComplete ? 'text-emerald-600' : 'text-slate-400'}
              `}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
