
import { Progress } from '@/components/ui/progress';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  
  return (
    <div className="space-y-2 sticky top-0 bg-white z-10 py-3 px-1 border-b border-gray-100 shadow-sm">
      <div className="flex justify-between items-center">
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
    </div>
  );
}
