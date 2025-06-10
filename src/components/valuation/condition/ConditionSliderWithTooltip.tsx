
import React from 'react';
import { Slider } from '@/components/ui/slider';

export interface ConditionSliderWithTooltipProps {
  value: number;
  onValueChange: (value: number) => void;
  // Add missing score prop
  score?: number;
  onScoreChange?: (score: any) => void;
}

export const ConditionSliderWithTooltip: React.FC<ConditionSliderWithTooltipProps> = ({
  value,
  onValueChange,
  score,
  onScoreChange,
}) => {
  const handleChange = (values: number[]) => {
    onValueChange(values[0]);
    if (onScoreChange) {
      onScoreChange(values[0]);
    }
  };

  const displayValue = score !== undefined ? score : value;

  return (
    <div className="space-y-2">
      <Slider
        value={[displayValue]}
        onValueChange={handleChange}
        max={100}
        min={0}
        step={1}
        className="w-full"
      />
      <div className="text-sm text-muted-foreground text-center">
        Condition Score: {displayValue}%
      </div>
    </div>
  );
};

export default ConditionSliderWithTooltip;
