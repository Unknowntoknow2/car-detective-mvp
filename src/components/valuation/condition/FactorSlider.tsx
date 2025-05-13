
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { FactorSliderProps } from './types';

export function FactorSlider({ id, label, options, value, onChange, ariaLabel }: FactorSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-medium leading-none">
          {label}
        </label>
        <span className="text-sm text-muted-foreground">
          {options.find(o => o.value === value)?.label || 'Unknown'}
        </span>
      </div>
      <Slider
        id={id}
        min={0}
        max={options.length - 1}
        step={1}
        value={[options.findIndex(o => o.value === value)]}
        onValueChange={(values) => onChange(options[values[0]].value)}
        className="py-2"
        aria-label={ariaLabel}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        {options.map((option, index) => (
          <span key={index} className="text-center" style={{ width: `${100 / options.length}%` }}>
            {option.label}
          </span>
        ))}
      </div>
    </div>
  );
}
