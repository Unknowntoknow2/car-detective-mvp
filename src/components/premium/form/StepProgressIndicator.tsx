
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepValidities?: Record<number, boolean>;
  stepCompletionStatus?: Record<number, boolean>;
}

export function StepProgressIndicator({
  currentStep,
  totalSteps,
  stepValidities = {},
  stepCompletionStatus = {}
}: StepProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = Boolean(stepCompletionStatus[step]) || step < currentStep;
        
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all",
                  isActive
                    ? "border-primary text-primary-foreground bg-primary"
                    : isCompleted
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-gray-200 text-gray-400"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step}
              </div>
              <span 
                className={cn(
                  "mt-2 text-xs transition-all",
                  isActive ? "text-primary font-medium" : "text-gray-500"
                )}
              >
                Step {step}
              </span>
            </div>
            
            {step < totalSteps && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-1",
                  step < currentStep || (step === currentStep && isCompleted)
                    ? "bg-green-500"
                    : "bg-gray-200"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
