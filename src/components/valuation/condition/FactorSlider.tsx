
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export interface ConditionOption {
  id: string;
  label: string;
  value: number;
  tip?: string;
}

interface FactorSliderProps {
  id: string;
  label: string;
  options: ConditionOption[];
  value: number;
  onChange: (id: string, value: number) => void;
}

export function FactorSlider({
  id,
  label,
  options,
  value,
  onChange
}: FactorSliderProps) {
  const [sliderValue, setSliderValue] = useState<number>(value);
  
  // Update the internal value when the prop changes
  useEffect(() => {
    setSliderValue(value);
  }, [value]);
  
  // Get min and max from options
  const min = 0;
  const max = options.length - 1;
  
  // Handle slider change
  const handleSliderChange = (values: number[]) => {
    const newValue = Math.round(values[0]);
    setSliderValue(newValue);
    onChange(id, newValue);
  };
  
  // Handle option button click
  const handleOptionClick = (index: number) => {
    setSliderValue(index);
    onChange(id, index);
  };
  
  return (
    <div className="space-y-4">
      <Label htmlFor={id}>{label}</Label>
      
      <Slider
        id={id}
        value={[sliderValue]}
        min={min}
        max={max}
        step={1}
        onValueChange={handleSliderChange}
      />
      
      <div className="flex justify-between">
        {options.map((option, index) => (
          <Button
            key={option.id}
            variant={sliderValue === index ? "default" : "outline"}
            size="sm"
            onClick={() => handleOptionClick(index)}
            className="text-xs px-2 py-1 h-auto min-w-[60px]"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
