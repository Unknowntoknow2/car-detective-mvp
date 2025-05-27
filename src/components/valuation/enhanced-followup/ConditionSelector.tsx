
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { CONDITION_OPTIONS } from '@/types/follow-up-answers';

interface ConditionSelectorProps {
  value?: string;
  onChange: (value: 'excellent' | 'good' | 'fair' | 'poor') => void;
}

export function ConditionSelector({ value, onChange }: ConditionSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="text-base font-semibold">Overall Vehicle Condition</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Condition significantly impacts vehicle value. Be honest for accurate valuation.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CONDITION_OPTIONS.map((option: typeof CONDITION_OPTIONS[number]) => (
          <Card 
            key={option.value}
            className={`cursor-pointer transition-all hover:shadow-md ${
              value === option.value 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => onChange(option.value)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium">{option.label}</h4>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  value === option.value 
                    ? 'bg-primary border-primary' 
                    : 'border-muted-foreground'
                }`}>
                  {value === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
              <div className="text-xs font-medium text-primary">{option.impact}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
