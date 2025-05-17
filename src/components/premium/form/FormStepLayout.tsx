
import React from 'react';
import { Button } from '@/components/ui/button';
import { StepProgressIndicator } from './StepProgressIndicator';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FormStepLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  onNext: () => void;
  onPrevious: () => void;
  stepValidities: Record<number, boolean>;
  stepCompletionStatus?: Record<number, boolean>;
  encouragementMessage?: string;
}

export function FormStepLayout({
  children,
  currentStep,
  totalSteps,
  isStepValid,
  onNext,
  onPrevious,
  stepValidities,
  stepCompletionStatus = {},
  encouragementMessage,
}: FormStepLayoutProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  
  const isSubmitStep = isLastStep;
  const showNextButton = !isSubmitStep;
  
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="mb-8">
        <StepProgressIndicator 
          currentStep={currentStep} 
          totalSteps={totalSteps}
          stepCompletionStatus={stepCompletionStatus}
        />
        
        {encouragementMessage && (
          <p className="text-sm text-muted-foreground text-center mt-2">
            {encouragementMessage}
          </p>
        )}
      </div>
      
      <div className="min-h-[300px]">
        {children}
      </div>
      
      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep}
          className={isFirstStep ? 'invisible' : ''}
          data-testid="previous-step"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {showNextButton ? (
          <Button
            onClick={onNext}
            disabled={!isStepValid}
            className="ml-auto"
            data-testid="next-step"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <div></div> // Empty div to maintain layout
        )}
      </div>
    </div>
  );
}
