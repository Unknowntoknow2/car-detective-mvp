
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

interface VehicleConditionSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const CONDITIONS = [
  { value: 25, label: 'Poor', color: 'bg-red-500' },
  { value: 50, label: 'Fair', color: 'bg-yellow-500' },
  { value: 75, label: 'Good', color: 'bg-green-500' },
  { value: 90, label: 'Excellent', color: 'bg-emerald-500' }
];

const getConditionFromValue = (value: number) => {
  return CONDITIONS.reduce((prev, curr) => {
    return Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev;
  });
};

export const VehicleConditionSlider = ({ 
  value, 
  onChange,
  disabled = false 
}: VehicleConditionSliderProps) => {
  const currentCondition = getConditionFromValue(value);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Vehicle Condition
        </label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="w-80">
              <h4 className="font-semibold mb-2">{currentCondition.label} Condition</h4>
              <p className="text-sm">
                {currentCondition.label === 'Poor' && 'Vehicle has mechanical faults, accident history, or interior damage'}
                {currentCondition.label === 'Fair' && 'Vehicle shows noticeable wear, faded paint, or high mileage'}
                {currentCondition.label === 'Good' && 'Vehicle has minor wear, no major defects, with regular maintenance'}
                {currentCondition.label === 'Excellent' && 'Vehicle is like new with no scratches and full service records'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="pt-2">
        <Slider
          defaultValue={[value]}
          max={90}
          min={25}
          step={1}
          disabled={disabled}
          onValueChange={([newValue]) => onChange(newValue)}
          className="w-full"
        />
        <div className="flex justify-between mt-2">
          {CONDITIONS.map((condition) => (
            <div 
              key={condition.value} 
              className="flex flex-col items-center"
            >
              <div className={`w-2 h-2 rounded-full ${condition.value === value ? condition.color : 'bg-gray-300'}`} />
              <span className="text-xs mt-1">{condition.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
