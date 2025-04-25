
import { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AccuracyMeterProps {
  stepValidities: Record<number, boolean>;
  totalSteps: number;
}

export function AccuracyMeter({ stepValidities, totalSteps }: AccuracyMeterProps) {
  const [accuracy, setAccuracy] = useState<number>(0);

  useEffect(() => {
    // Calculate accuracy based on valid steps
    const validStepsCount = Object.values(stepValidities).filter(Boolean).length;
    const calculatedAccuracy = Math.round((validStepsCount / totalSteps) * 100);
    setAccuracy(calculatedAccuracy);
  }, [stepValidities, totalSteps]);

  // Determine color and icon based on accuracy percentage
  const getColorClass = () => {
    if (accuracy >= 80) return 'bg-green-500';
    if (accuracy >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getStatusIcon = () => {
    if (accuracy >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (accuracy >= 50) return <Info className="h-4 w-4 text-amber-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const getStatusMessage = () => {
    if (accuracy === 100) return "All required information provided!";
    if (accuracy >= 80) return "Almost there! Just a few more fields to complete.";
    if (accuracy >= 50) return "Making good progress. Continue filling in details.";
    return "Please complete more fields for an accurate valuation.";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">Valuation Accuracy</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p>Higher accuracy leads to more precise valuation estimates. Complete all steps for the best results.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-1.5">
          {getStatusIcon()}
          <span className="font-semibold">{accuracy}%</span>
        </div>
      </div>
      
      <div className="relative h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-700 ease-out ${getColorClass()}`}
          style={{ width: `${accuracy}%` }}
          role="progressbar"
          aria-valuenow={accuracy}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      
      <p className="text-xs text-gray-600 italic">
        {getStatusMessage()}
      </p>
    </div>
  );
}
