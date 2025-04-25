
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepCompletionStatus: Record<number, boolean>;
}

export function ProgressIndicator({ 
  currentStep, 
  totalSteps,
  stepCompletionStatus 
}: ProgressIndicatorProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  
  return (
    <div className="sticky top-0 bg-white z-10 py-3 px-1 border-b border-gray-100">
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
      />
      
      <div className="hidden sm:flex items-center justify-between mt-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div 
              className={`flex items-center justify-center h-6 w-6 rounded-full 
                ${step === currentStep ? 'bg-navy-600 text-white' : 
                  stepCompletionStatus[step] ? 'bg-green-100 text-green-700' : 
                  'bg-gray-200 text-gray-600'}`}
            >
              {stepCompletionStatus[step] ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                step
              )}
            </div>
            <span className={`text-xs mt-1 ${
              step === currentStep ? 'font-medium text-navy-700' : 'text-gray-500'
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
