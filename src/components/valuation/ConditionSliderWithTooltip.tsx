
import React from 'react';
import { Info } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConditionSliderProps {
  score: number;
  onScoreChange: (score: number) => void;
  disabled?: boolean;
}

const marks = [
  { value: 25, label: 'Poor', color: 'text-destructive' },
  { value: 50, label: 'Fair', color: 'text-warning' },
  { value: 75, label: 'Good', color: 'text-success' },
  { value: 90, label: 'Excellent', color: 'text-primary' }
];

export function ConditionSliderWithTooltip({
  score,
  onScoreChange,
  disabled = false
}: ConditionSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Vehicle Condition</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Select the vehicle's overall condition. This adjusts the valuation:</p>
                <ul className="mt-2 space-y-1">
                  {marks.map(mark => (
                    <li key={mark.value} className={`text-sm ${mark.color}`}>
                      {mark.label}: {mark.value}%
                    </li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="text-sm font-medium">{score}%</span>
      </div>

      <Slider
        value={[score]}
        onValueChange={([value]) => onScoreChange(value)}
        min={0}
        max={100}
        step={1}
        disabled={disabled}
      />

      <div className="grid grid-cols-4 gap-2">
        {marks.map(mark => (
          <div key={mark.value} className="text-center">
            <span className={`text-xs font-medium ${mark.color}`}>{mark.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
