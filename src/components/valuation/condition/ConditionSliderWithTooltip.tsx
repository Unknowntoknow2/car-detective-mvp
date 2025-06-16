
import React from 'react';
import { Slider } from '@/components/ui/slider';

export interface ConditionSliderWithTooltipProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export const ConditionSliderWithTooltip: React.FC<ConditionSliderWithTooltipProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className = ''
}) => {
  const handleValueChange = (values: number[]) => {
    onValueChange(values[0]);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Slider
        value={[value]}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>Poor</span>
        <span>Fair</span>
        <span>Good</span>
        <span>Excellent</span>
      </div>
    </div>
  );
};

export default ConditionSliderWithTooltip;
