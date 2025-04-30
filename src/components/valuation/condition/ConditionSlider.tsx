
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { getConditionDescription } from './conditionDescriptions';

interface ConditionSliderProps {
  id: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
}

export function ConditionSlider({ id, name, value, onChange }: ConditionSliderProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const getConditionLabel = (val: number): string => {
    if (val <= 20) return 'Poor';
    if (val <= 40) return 'Fair';
    if (val <= 60) return 'Good';
    if (val <= 80) return 'Very Good';
    return 'Excellent';
  };
  
  const getConditionColor = (val: number): string => {
    if (val <= 20) return 'text-red-600';
    if (val <= 40) return 'text-amber-500';
    if (val <= 60) return 'text-yellow-500';
    if (val <= 80) return 'text-green-500';
    return 'text-blue-600';
  };
  
  const getSliderTrackColor = (val: number): string => {
    if (val <= 20) return 'bg-red-200';
    if (val <= 40) return 'bg-amber-200';
    if (val <= 60) return 'bg-yellow-200';
    if (val <= 80) return 'bg-green-200';
    return 'bg-blue-200';
  };
  
  const getSliderRangeColor = (val: number): string => {
    if (val <= 20) return 'bg-red-500';
    if (val <= 40) return 'bg-amber-500';
    if (val <= 60) return 'bg-yellow-500';
    if (val <= 80) return 'bg-green-500';
    return 'bg-blue-500';
  };
  
  // Override slider styles dynamically based on value
  const sliderStyles = {
    track: getSliderTrackColor(value),
    range: getSliderRangeColor(value),
  };
  
  const displayValue = hoverValue !== null ? hoverValue : value;
  const conditionLabel = getConditionLabel(displayValue);
  const conditionDescription = getConditionDescription(id, displayValue);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Label htmlFor={id} className="text-sm font-medium">
            {name}
          </Label>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">{conditionDescription}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <span className={cn("text-sm font-medium", getConditionColor(displayValue))}>
          {conditionLabel}
        </span>
      </div>
      
      <div 
        className="relative" 
        onMouseLeave={() => setHoverValue(null)}
      >
        <Slider
          id={id}
          min={0}
          max={100}
          step={5}
          value={[value]}
          onValueChange={([newValue]) => onChange(newValue)}
          onValueCommit={([newValue]) => onChange(newValue)}
          className={cn("h-2")}
          // Custom track and range colors
          trackClassName={sliderStyles.track}
          rangeClassName={sliderStyles.range}
          onMouseMove={(e) => {
            // Calculate value based on mouse position
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
            const snappedValue = Math.round(percent / 5) * 5; // Snap to 5% increments
            setHoverValue(snappedValue);
          }}
        />
        
        {/* Condition markers */}
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Very Good</span>
          <span>Excellent</span>
        </div>
      </div>
    </div>
  );
}
