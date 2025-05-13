
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

export interface ConditionOption {
  id?: string;
  label: string;
  value: number;
  tip?: string;
  multiplier?: number;
}

export interface FactorSliderProps {
  id: string;
  label?: string;
  options: ConditionOption[];
  value: number;
  onChange: (value: number) => void;
  ariaLabel?: string;
}

export const FactorSlider = ({
  id,
  label,
  options,
  value,
  onChange,
  ariaLabel
}: FactorSliderProps) => {
  // Find the closest option
  const findClosestOption = (val: number) => {
    return options.reduce((prev, curr) => {
      return Math.abs(curr.value - val) < Math.abs(prev.value - val) ? curr : prev;
    });
  };

  const closestOption = findClosestOption(value);

  return (
    <div className="space-y-3">
      {label && <Label htmlFor={id}>{label}</Label>}
      
      <div className="mt-1 space-y-3">
        <Slider
          id={id}
          min={0}
          max={100}
          step={1}
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          aria-label={ariaLabel || `Adjustment for ${label || ''}`}
        />
        
        <div className="flex justify-between text-xs">
          {options.map((option, idx) => (
            <div 
              key={idx} 
              className={`relative ${
                Math.abs(option.value - value) < 10 ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
              style={{ 
                left: `${option.value === 0 ? '0%' : 
                      option.value === 100 ? '0%' : 
                      '-10px'}`,
                textAlign: option.value === 0 ? 'left' : 
                          option.value === 100 ? 'right' : 'center' 
              }}
            >
              {option.tip ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="text-xs flex items-center">
                      {option.label}
                      <Info className="h-3 w-3 ml-0.5 inline" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{option.tip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                option.label
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
