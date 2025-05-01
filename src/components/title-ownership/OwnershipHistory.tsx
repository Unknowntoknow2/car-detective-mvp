
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface OwnershipHistoryProps {
  numberOfOwners: number;
  onChange: (value: number) => void;
}

export function OwnershipHistory({ numberOfOwners, onChange }: OwnershipHistoryProps) {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      onChange(value);
    }
  };

  // Calculate impact text based on number of owners
  const getImpactText = () => {
    if (numberOfOwners === 1) {
      return { text: "Optimal for resale value", color: "text-green-600" };
    } else if (numberOfOwners === 2) {
      return { text: "Minimal impact on value", color: "text-green-600" };
    } else if (numberOfOwners <= 4) {
      return { text: "Moderate impact on value", color: "text-amber-600" };
    } else {
      return { text: "Significant impact on value", color: "text-red-600" };
    }
  };

  const impact = getImpactText();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="owner-count" className="text-sm font-medium">
          Number of Previous Owners
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p className="text-sm">
                Fewer previous owners generally means higher resale value. 
                One-owner vehicles typically command a premium.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Slider
            value={[numberOfOwners]}
            min={1}
            max={10}
            step={1}
            onValueChange={handleSliderChange}
          />
        </div>
        <Input
          id="owner-count"
          type="number"
          min={1}
          max={10}
          value={numberOfOwners}
          onChange={handleInputChange}
          className="w-16 text-right"
        />
      </div>

      <div className="text-sm">
        <p className={`font-medium ${impact.color}`}>
          {impact.text}
        </p>
        <p className="text-muted-foreground mt-1">
          {numberOfOwners === 1 
            ? "Original owner vehicle (highest value)" 
            : `${numberOfOwners} different owners in vehicle history`}
        </p>
      </div>
    </div>
  );
}
