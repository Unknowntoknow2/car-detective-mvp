
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

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
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step) => {
        const isCurrentStep = step === currentStep;
        const isPastStep = step < currentStep;
        const isCompleted = stepCompletionStatus[step] === true;
        const isValid = stepValidities[step] === true;
        
        return (
          <React.Fragment key={step}>
            {/* Step circle */}
            <div className="relative flex items-center justify-center">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all",
                  isCurrentStep && "border-primary bg-primary text-white",
                  isPastStep && isValid && "border-primary bg-primary/10 text-primary",
                  isPastStep && !isValid && "border-amber-500 bg-amber-50 text-amber-600",
                  !isPastStep && !isCurrentStep && "border-gray-200 text-gray-400"
                )}
              >
                {isPastStep && isValid ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  step
                )}
              </div>
              
              {/* Label below step */}
              <span className={cn(
                "absolute -bottom-6 text-xs whitespace-nowrap",
                isCurrentStep && "font-medium text-primary",
                isPastStep && "text-gray-600",
                !isPastStep && !isCurrentStep && "text-gray-400"
              )}>
                Step {step}
              </span>
            </div>
            
            {/* Connector line between steps */}
            {step < totalSteps && (
              <div className={cn(
                "flex-1 h-0.5",
                currentStep > step ? "bg-primary" : "bg-gray-200"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
