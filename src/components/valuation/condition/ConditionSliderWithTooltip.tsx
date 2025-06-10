
import React from 'react';
import { Slider } from '@/components/ui/slider';

export interface ConditionSliderWithTooltipProps {
  value: number;
  onValueChange: (value: number) => void;
}

export const ConditionSliderWithTooltip: React.FC<ConditionSliderWithTooltipProps> = ({
  value,
  onValueChange,
}) => {
  const handleChange = (values: number[]) => {
    onValueChange(values[0]);
  };

  return (
    <div className="space-y-2">
      <Slider
        value={[value]}
        onValueChange={handleChange}
        max={100}
        min={0}
        step={1}
        className="w-full"
      />
      <div className="text-sm text-muted-foreground text-center">
        Condition Score: {value}%
      </div>
    </div>
  );
};

export default ConditionSliderWithTooltip;
