
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConditionOption {
  value: number;
  label: string;
  tip: string;
  multiplier: number;
}

export interface FactorSliderProps {
  id: string;
  label: string;
  options: ConditionOption[];
  value: number;
  onChange: (val: number) => void;
  ariaLabel?: string;
  stepSize?: number;
}

export function FactorSlider({ 
  id, 
  label, 
  options, 
  value, 
  onChange, 
  ariaLabel = "Condition slider",
  stepSize = 25 
}: FactorSliderProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  
  // Find the closest option to the current value
  const getCurrentOption = () => {
    if (options.length === 0) return null;
    
    const index = Math.round((value / 100) * (options.length - 1));
    return options[index >= 0 && index < options.length ? index : 0];
  };
  
  const getOptionAtValue = (val: number) => {
    if (options.length === 0) return null;
    
    const index = Math.round((val / 100) * (options.length - 1));
    return options[index >= 0 && index < options.length ? index : 0];
  };
  
  const currentOption = getCurrentOption();
  const displayOption = hoveredValue !== null ? getOptionAtValue(hoveredValue) : currentOption;
  
  // Step between each mark on the slider
  const step = options.length > 1 ? 100 / (options.length - 1) : 100;
  
  // Calculate color based on value
  const getColorClass = (val: number) => {
    if (val <= 25) return 'text-red-600';
    if (val <= 50) return 'text-amber-500';
    if (val <= 75) return 'text-green-500';
    return 'text-blue-600';
  };
  
  // Calculate background and foreground colors for slider
  const getSliderTrackColor = (val: number) => {
    if (val <= 25) return 'bg-red-200';
    if (val <= 50) return 'bg-amber-200';
    if (val <= 75) return 'bg-green-200';
    return 'bg-blue-200';
  };
  
  const getSliderRangeColor = (val: number) => {
    if (val <= 25) return 'bg-red-500';
    if (val <= 50) return 'bg-amber-500';
    if (val <= 75) return 'bg-green-500';
    return 'bg-blue-500';
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Label htmlFor={id} className="text-sm font-medium">
            {label}
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">Adjust this factor to reflect your vehicle's condition</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <span className={cn("text-sm font-medium", getColorClass(value))}>
          {displayOption?.label}
        </span>
      </div>
      
      <div 
        className="relative pt-6" 
        onMouseLeave={() => setHoveredValue(null)}
      >
        {/* Value tooltip that appears above the current thumb position */}
        {displayOption && (
          <div 
            className={cn(
              "absolute -top-1 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium text-white transition-all",
              getSliderRangeColor(value)
            )}
            style={{ 
              left: `${hoveredValue !== null ? hoveredValue : value}%`,
              zIndex: 10
            }}
          >
            {displayOption.label}
          </div>
        )}
        
        <Slider
          id={id}
          min={0}
          max={100}
          step={stepSize || step}
          value={[value]}
          onValueChange={([newValue]) => onChange(newValue)}
          aria-label={ariaLabel}
          className="min-h-10 h-8" // Increase hit area
          trackClassName={getSliderTrackColor(value)}
          rangeClassName={getSliderRangeColor(value)}
          onMouseMove={(e) => {
            // Calculate value based on mouse position
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
            const snappedValue = Math.round(percent / (stepSize || step)) * (stepSize || step); // Snap to step increments
            setHoveredValue(snappedValue);
          }}
        />
        
        {/* Condition markers and labels */}
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          {options.map((option, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-0.5 h-1 bg-slate-300 mb-1"></div>
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Improvement tip */}
      {displayOption && (
        <div className="mt-2 text-xs bg-slate-50 p-3 rounded-md border border-slate-200">
          <span className="block font-medium text-slate-700 mb-1">Tip:</span>
          <p className="text-slate-600">{displayOption.tip}</p>
        </div>
      )}
    </div>
  );
}
