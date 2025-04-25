
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface FormStepNavigationProps {
  currentStep: number;
  totalSteps: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  isStepValid: boolean;
}

export function FormStepNavigation({
  currentStep,
  totalSteps,
  goToNextStep,
  goToPreviousStep,
  isStepValid
}: FormStepNavigationProps) {
  return (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={goToPreviousStep}
        disabled={currentStep === 1}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </Button>

      {currentStep < totalSteps && (
        <Button
          onClick={goToNextStep}
          disabled={!isStepValid}
          className="flex items-center gap-2"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
