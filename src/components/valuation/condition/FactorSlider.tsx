
import React from 'react';
import { Slider } from '@/components/ui/slider';

export interface ConditionOption {
  value: number;
  label: string;
  description?: string;
  tip?: string;
  multiplier?: number;
}

export interface FactorSliderProps {
  id: string;
  label: string;
  options: ConditionOption[];
  value: number;
  onChange: (value: number) => void;
  ariaLabel?: string;
}

export function FactorSlider({ id, label, options, value, onChange, ariaLabel }: FactorSliderProps) {
  // Find the current option based on value
  const currentOption = options.find(o => o.value === value) || options[0];
  const sliderIndex = options.findIndex(o => o.value === value);
  
  // Use a default index of 0 if the value isn't found
  const safeSliderIndex = sliderIndex >= 0 ? sliderIndex : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-medium leading-none">
          {label}
        </label>
        <span className="text-sm text-muted-foreground">
          {currentOption.label}
        </span>
      </div>
      <Slider
        id={id}
        min={0}
        max={options.length - 1}
        step={1}
        value={[safeSliderIndex]}
        onValueChange={(values) => onChange(options[values[0]].value)}
        className="py-2"
        aria-label={ariaLabel || `${label} slider`}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        {options.map((option, index) => (
          <span key={index} className="text-center" style={{ width: `${100 / options.length}%` }}>
            {option.label}
          </span>
        ))}
      </div>
      
      {currentOption.tip && (
        <div className="text-xs text-muted-foreground mt-1">
          <span className="font-medium">Tip:</span> {currentOption.tip}
        </div>
      )}
    </div>
  );
}
