
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';
import { cva } from 'class-variance-authority';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepCompletionStatus: Record<number, boolean>;
}

const stepTextVariants = cva("flex items-center justify-center rounded-full text-xs font-medium", {
  variants: {
    status: {
      active: "bg-navy-600 text-white h-6 w-6",
      completed: "bg-green-100 text-green-700 h-5 w-5",
      upcoming: "bg-gray-200 text-gray-600 h-5 w-5",
    }
  }
});

export function ProgressIndicator({ 
  currentStep, 
  totalSteps,
  stepCompletionStatus 
}: ProgressIndicatorProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  
  // Generate array of step numbers
  const stepNumbers = Array.from({ length: totalSteps }, (_, i) => i + 1);

  const getStepStatus = (step: number) => {
    if (step === currentStep) return 'active';
    if (stepCompletionStatus[step]) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="space-y-2 sticky top-0 bg-white z-10 py-3 px-1 border-b border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {percentage}% Complete
        </span>
      </div>
      
      <Progress 
        value={percentage} 
        className="h-2 transition-all duration-300 ease-out"
        aria-label="Form progress"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      
      <div className="hidden sm:flex items-center justify-between mt-2">
        {stepNumbers.map((step) => {
          const status = getStepStatus(step);
          return (
            <div key={step} className="flex flex-col items-center">
              <div className="relative">
                {status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <div className={stepTextVariants({ status })}>
                    {step}
                  </div>
                )}
              </div>
              <span className={`text-xs mt-1 ${step === currentStep ? 'font-medium text-navy-700' : 'text-gray-500'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
