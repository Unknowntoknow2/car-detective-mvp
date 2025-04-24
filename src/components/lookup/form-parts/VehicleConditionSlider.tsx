
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Tooltip } from '@/components/ui/tooltip';
import { 
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface VehicleConditionSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const conditionDescriptions = {
  poor: "Mechanical faults, accident history, interior damage",
  fair: "Noticeable wear, faded paint, high mileage, noisy engine",
  good: "Minor wear, no major defects, regular maintenance",
  excellent: "No scratches, no mechanical issues, full service records"
};

export const VehicleConditionSlider = ({ 
  value, 
  onChange,
  disabled = false 
}: VehicleConditionSliderProps) => {
  const getConditionLabel = (val: number): string => {
    if (val <= 25) return 'poor';
    if (val <= 50) return 'fair';
    if (val <= 75) return 'good';
    return 'excellent';
  };

  const currentCondition = getConditionLabel(value);

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Vehicle Condition</label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-sm font-semibold capitalize">{currentCondition}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{conditionDescriptions[currentCondition]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Slider
        value={[value]}
        min={25}
        max={90}
        step={1}
        onValueChange={([newValue]) => onChange(newValue)}
        disabled={disabled}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Poor</span>
        <span>Fair</span>
        <span>Good</span>
        <span>Excellent</span>
      </div>
    </div>
  );
};
