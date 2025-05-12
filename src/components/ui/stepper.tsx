
import React from "react";
import { cn } from "@/lib/utils";

interface StepperProps {
  steps: { id: string; label: string }[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <div className="flex w-full justify-between">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isClickable = onStepClick && (isCompleted || index === 0);
        
        return (
          <React.Fragment key={step.id}>
            {/* Step circle with number */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  isActive && "bg-primary text-primary-foreground",
                  isCompleted && "bg-primary/90 text-primary-foreground",
                  !isActive && !isCompleted && "bg-muted text-muted-foreground",
                  isClickable ? "cursor-pointer hover:bg-primary/80" : "cursor-default"
                )}
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
              >
                {index + 1}
              </button>
              
              {/* Step label */}
              <span 
                className={cn(
                  "mt-2 text-xs text-center",
                  (isActive || isCompleted) ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            
            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div className="flex-1 flex items-center">
                <div 
                  className={cn(
                    "h-[2px] w-full",
                    index < currentStep ? "bg-primary" : "bg-muted"
                  )} 
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
