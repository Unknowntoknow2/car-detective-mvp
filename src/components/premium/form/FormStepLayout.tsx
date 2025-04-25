
import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { ProgressIndicator } from './ProgressIndicator';
import { FormSteps } from './FormSteps';
import { FormStepNavigation } from './FormStepNavigation';

interface FormStepLayoutProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  onNext: () => void;
  onPrevious: () => void;
  children: ReactNode;
}

export function FormStepLayout({
  currentStep,
  totalSteps,
  isStepValid,
  onNext,
  onPrevious,
  children
}: FormStepLayoutProps) {
  return (
    <div className="space-y-6">
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      
      <Card className="overflow-hidden border-2 border-gray-200 shadow-lg">
        <div className="p-6">
          <FormSteps currentStep={currentStep}>
            {children}
          </FormSteps>
          
          <FormStepNavigation 
            currentStep={currentStep}
            totalSteps={totalSteps}
            goToNextStep={onNext}
            goToPreviousStep={onPrevious}
            isStepValid={isStepValid}
          />
        </div>
      </Card>
    </div>
  );
}
