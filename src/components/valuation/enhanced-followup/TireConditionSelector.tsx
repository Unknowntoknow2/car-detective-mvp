
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Circle } from 'lucide-react';

interface TireConditionSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

const TIRE_CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent', description: 'New or nearly new tires' },
  { value: 'good', label: 'Good', description: 'Tires in good condition with plenty of tread' },
  { value: 'fair', label: 'Fair', description: 'Tires show wear but still safe' },
  { value: 'poor', label: 'Poor', description: 'Tires need replacement soon' }
];

export function TireConditionSelector({ value, onChange }: TireConditionSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Circle className="h-5 w-5 text-gray-500" />
          <CardTitle className="text-lg">Tire Condition</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Tire condition affects safety and can impact vehicle value.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Label className="text-base font-medium mb-4 block">
          What is the current condition of the tires?
        </Label>
        
        <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
          {TIRE_CONDITION_OPTIONS.map((option) => (
            <div
              key={option.value}
              className={`p-3 rounded-lg border transition-all ${
                value === option.value
                  ? 'bg-primary/5 border-primary'
                  : 'bg-muted/30 border-muted hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={option.value} id={option.value} />
                <div className="flex-1">
                  <Label htmlFor={option.value} className="font-medium cursor-pointer">
                    {option.label}
                  </Label>
                  <div className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
