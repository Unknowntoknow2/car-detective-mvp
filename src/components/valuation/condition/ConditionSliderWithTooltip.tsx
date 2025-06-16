
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export interface ConditionSliderWithTooltipProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

export const ConditionSliderWithTooltip: React.FC<ConditionSliderWithTooltipProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label = "Condition",
  className
}) => {
  const handleValueChange = (values: number[]) => {
    onValueChange(values[0]);
  };

  const getConditionLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    if (score >= 50) return "Poor";
    return "Very Poor";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm text-muted-foreground">
          {value} - {getConditionLabel(value)}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
};

export default ConditionSliderWithTooltip;
