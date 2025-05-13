
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConditionOption {
  value: number;
  label: string;
  tip: string;
  multiplier: number;
}

interface FactorSliderProps {
  id: string;
  label: string;
  options: ConditionOption[];
  value: number;
  onChange: (value: number) => void;
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
}

export function FactorSlider({
  id,
  label,
  options,
  value,
  onChange,
  ariaLabel,
  className,
  disabled = false
}: FactorSliderProps) {
  const [selectedOption, setSelectedOption] = useState<ConditionOption>(() => {
    // Find option closest to the initial value
    const closest = options.reduce((prev, curr) => {
      return Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev;
    }, options[0]);
    return closest;
  });

  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];
    // Find the closest option to the slider value
    const closest = options.reduce((prev, curr) => {
      return Math.abs(curr.value - newValue) < Math.abs(prev.value - newValue) ? curr : prev;
    });
    
    setSelectedOption(closest);
    onChange(closest.value);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="font-medium text-sm">{label}</div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center cursor-help">
                <span className="text-sm font-medium mr-1">{selectedOption.label}</span>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-2 max-w-[220px]">
                <p className="text-sm font-medium">{selectedOption.label}</p>
                <p className="text-xs">{selectedOption.tip}</p>
                <div className="text-xs text-primary font-semibold">
                  Value multiplier: {selectedOption.multiplier.toFixed(2)}x
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Slider 
        id={id}
        min={0}
        max={100}
        step={1}
        value={[selectedOption.value]}
        onValueChange={handleSliderChange}
        aria-label={ariaLabel}
        disabled={disabled}
      />
      
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        {options.map((option) => (
          <div key={option.label} className="text-center">
            <div className={cn(
              "h-1 w-1 rounded-full mb-1 mx-auto", 
              option.value === selectedOption.value 
                ? "bg-primary h-2 w-2" 
                : "bg-muted-foreground"
            )} />
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}
