
import { useEffect, useState } from 'react';

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

  // Determine color based on accuracy percentage
  const getColorClass = () => {
    if (accuracy >= 80) return 'bg-green-500';
    if (accuracy >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">Valuation Accuracy</span>
        <span className="font-semibold">{accuracy}%</span>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out ${getColorClass()}`}
          style={{ width: `${accuracy}%` }}
          role="progressbar"
          aria-valuenow={accuracy}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
