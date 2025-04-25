
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
      {currentStep > 1 ? (
        <Button 
          variant="outline" 
          onClick={goToPreviousStep}
          className="flex items-center gap-1 text-gray-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
      ) : (
        <div></div> // Empty div to maintain spacing
      )}
      
      {currentStep < totalSteps && (
        <Button 
          onClick={goToNextStep}
          disabled={!isStepValid}
          className="bg-navy-600 hover:bg-navy-700 text-white"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      )}
    </div>
  );
}
