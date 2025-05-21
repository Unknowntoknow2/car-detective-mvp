
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface VehicleConditionSliderProps {
  value?: number;
  onChange: (value: number, label: string) => void;
  disabled?: boolean;
}

// Define the condition levels and their corresponding value ranges
const conditionRanges = {
  poor: { min: 0, max: 25 },
  fair: { min: 26, max: 50 },
  good: { min: 51, max: 75 },
  excellent: { min: 76, max: 100 }
};

// Define descriptions for each condition
const conditionDescriptions = {
  poor: "Vehicle has significant mechanical and/or cosmetic issues requiring major repairs.",
  fair: "Vehicle has noticeable wear and may need some repairs, but is generally functional.",
  good: "Vehicle is in solid mechanical condition with minimal cosmetic issues.",
  excellent: "Vehicle is in exceptional condition, well-maintained, with minimal wear."
};

// Define colors for each condition
const conditionColors = {
  poor: "bg-red-400",
  fair: "bg-yellow-400",
  good: "bg-green-400",
  excellent: "bg-blue-400",
};

export const VehicleConditionSlider: React.FC<VehicleConditionSliderProps> = ({
  value = 75,
  onChange,
  disabled = false
}) => {
  const [sliderValue, setSliderValue] = useState(value);
  const [currentCondition, setCurrentCondition] = useState<string>('good');
  
  // Function to determine the condition based on slider value
  const getConditionFromValue = (val: number): string => {
    if (val <= conditionRanges.poor.max) return 'poor';
    if (val <= conditionRanges.fair.max) return 'fair';
    if (val <= conditionRanges.good.max) return 'good';
    return 'excellent';
  };
  
  // Function to get the formatted condition label
  const getConditionLabel = (condition: string): string => {
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };
  
  // Update condition whenever slider value changes
  useEffect(() => {
    const condition = getConditionFromValue(sliderValue);
    setCurrentCondition(condition);
    onChange(sliderValue, getConditionLabel(condition));
  }, [sliderValue, onChange]);
  
  // Function to handle slider change
  const handleSliderChange = (newValue: number[]) => {
    setSliderValue(newValue[0]);
  };
  
  // Function to handle clicking on a condition button
  const handleConditionClick = (condition: keyof typeof conditionRanges) => {
    if (disabled) return;
    
    // Set slider to middle value of the condition range
    const range = conditionRanges[condition];
    const midpoint = Math.floor((range.min + range.max) / 2);
    setSliderValue(midpoint);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Label className="text-sm font-medium">Vehicle Condition</Label>
        <span className="text-sm font-semibold">
          {getConditionLabel(currentCondition)}
        </span>
      </div>
      
      <Slider
        value={[sliderValue]}
        min={0}
        max={100}
        step={1}
        onValueChange={handleSliderChange}
        disabled={disabled}
        className="my-6"
      />
      
      <div className="grid grid-cols-4 gap-2">
        {Object.keys(conditionRanges).map((condition) => {
          const isActive = currentCondition === condition;
          // Type assertion to ensure TypeScript knows this is a valid key
          const safeCondition = condition as keyof typeof conditionColors;
          
          return (
            <button
              key={condition}
              type="button"
              className={cn(
                "p-2 rounded text-center text-xs transition-all",
                isActive
                  ? `${conditionColors[safeCondition]} text-white font-medium`
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleConditionClick(safeCondition)}
              disabled={disabled}
            >
              {getConditionLabel(condition)}
            </button>
          );
        })}
      </div>
      
      <div className="mt-2 text-sm text-muted-foreground">
        {/* Use safe indexing with type assertion */}
        {conditionDescriptions[currentCondition as keyof typeof conditionDescriptions]}
      </div>
    </div>
  );
};

export default VehicleConditionSlider;
