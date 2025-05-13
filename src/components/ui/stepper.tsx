
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step circle with number or check */}
            <div className="relative">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-colors",
                  index < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : index === currentStep
                    ? "border-primary text-primary"
                    : "border-muted-foreground/25 text-muted-foreground/50"
                )}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              
              {/* Step label */}
              <span
                className={cn(
                  "absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap",
                  index <= currentStep
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
            
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2",
                  index < currentStep
                    ? "bg-primary"
                    : "bg-muted-foreground/25"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
