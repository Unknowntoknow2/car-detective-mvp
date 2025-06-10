
import React from "react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConditionSliderWithTooltipProps {
  value: number;
  onChange: (value: number[]) => void;
  disabled?: boolean;
}

export function ConditionSliderWithTooltip({
  value,
  onChange,
  disabled = false,
}: ConditionSliderWithTooltipProps) {
  const getConditionText = (value: number) => {
    if (value <= 20) return "Poor";
    if (value <= 40) return "Fair";
    if (value <= 60) return "Good";
    if (value <= 80) return "Very Good";
    return "Excellent";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            <Slider
              value={[value]}
              onValueChange={onChange}
              max={100}
              min={0}
              step={1}
              disabled={disabled}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div>
            <p className="font-medium">{getConditionText(value)}</p>
            <p className="text-sm">Current value: {value}%</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface ConditionSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function ConditionSlider({ 
  value, 
  onChange,
  disabled = false 
}: ConditionSliderProps) {
  const handleChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <ConditionSliderWithTooltip
      value={value}
      onChange={handleChange}
      disabled={disabled}
    />
  );
}
