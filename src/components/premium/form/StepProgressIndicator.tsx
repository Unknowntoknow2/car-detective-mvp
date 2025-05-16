
import React from 'react';
import { Check, Car, FileText, Image, Star, Shield, AlertTriangle, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepCompletionStatus: Record<number, boolean>;
  stepValidities?: Record<number, boolean>; // Add this prop
}

export function StepProgressIndicator({ 
  currentStep, 
  totalSteps, 
  stepCompletionStatus,
  stepValidities 
}: StepProgressIndicatorProps) {
  // Define steps with icons and labels
  const steps = [
    { icon: Car, label: 'Identify' },
    { icon: FileText, label: 'Details' },
    { icon: AlertTriangle, label: 'Accidents' },
    { icon: Star, label: 'Features' },
    { icon: Activity, label: 'Condition' },
    { icon: Image, label: 'Photos' },
    { icon: Shield, label: 'Driving' },
    { icon: Check, label: 'Review' }
  ];

  return (
    <div className="hidden md:block mb-6">
      <div className="flex justify-between relative">
        {/* Progress Bar */}
        <div className="absolute top-5 left-0 h-1 bg-gray-200 w-full">
          <div 
            className="h-full bg-primary transition-all"
            style={{ width: `${Math.max(0, (currentStep - 1) / (totalSteps - 1) * 100)}%` }}
          />
        </div>
        
        {/* Step Indicators */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const StepIcon = step.icon;
          const isActive = currentStep === stepNumber;
          const isCompleted = stepCompletionStatus[stepNumber];
          
          return (
            <div 
              key={stepNumber}
              className="flex flex-col items-center relative z-10"
            >
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  isActive 
                    ? "bg-primary text-white"
                    : isCompleted
                      ? "bg-primary/20 text-primary"
                      : "bg-gray-200 text-gray-500"
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
              </div>
              <span 
                className={cn(
                  "text-xs mt-2 font-medium",
                  isActive ? "text-primary" : "text-gray-500"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
