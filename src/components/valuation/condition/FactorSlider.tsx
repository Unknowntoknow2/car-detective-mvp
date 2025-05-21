
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
  // Ensure value is a number
  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  
  // Find the closest option
  const findClosestOption = (val: number) => {
    return options.reduce((prev, curr) => {
      // Convert option value to number if it's a string
      const currValue = typeof curr.value === 'string' ? parseFloat(curr.value) : curr.value;
      const prevValue = typeof prev.value === 'string' ? parseFloat(prev.value) : prev.value;
      
      return Math.abs(currValue - val) < Math.abs(prevValue - val) ? curr : prev;
    });
  };

  const closestOption = findClosestOption(numericValue);

  return (
    <div className="space-y-3">
      {label && <Label htmlFor={id}>{label}</Label>}
      
      <div className="mt-1 space-y-3">
        <Slider
          id={id}
          min={0}
          max={100}
          step={1}
          value={[numericValue]}
          onValueChange={(values) => onChange(values[0])}
          aria-label={ariaLabel || `Adjustment for ${label || ''}`}
        />
        
        <div className="flex justify-between text-xs">
          {options.map((option, idx) => {
            // Convert option value to number for comparison
            const optionValue = typeof option.value === 'string' ? parseFloat(option.value) : option.value;
            
            return (
              <div 
                key={idx} 
                className={`relative ${
                  Math.abs(optionValue - numericValue) < 10 ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
                style={{ 
                  left: `${optionValue === 0 ? '0%' : 
                        optionValue === 100 ? '0%' : 
                        '-10px'}`,
                  textAlign: optionValue === 0 ? 'left' : 
                            optionValue === 100 ? 'right' : 'center' 
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
            );
          })}
        </div>
      </div>
    </div>
  );
};
