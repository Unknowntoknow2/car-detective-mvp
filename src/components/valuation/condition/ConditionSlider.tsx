
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { ConditionSliderProps } from './types';

export function ConditionSlider({ id, name, value, onChange }: ConditionSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-medium leading-none">
          {name}
        </label>
        <span className="text-sm text-muted-foreground">
          {value}/100
        </span>
      </div>
      <Slider
        id={id}
        min={0}
        max={100}
        step={5}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        className="py-2"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Poor</span>
        <span>Fair</span>
        <span>Good</span>
        <span>Very Good</span>
        <span>Excellent</span>
      </div>
    </div>
  );
}
