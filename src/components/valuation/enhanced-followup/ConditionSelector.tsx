
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Lock } from 'lucide-react';
import { CONDITION_OPTIONS } from '@/types/follow-up-answers';

/**
 * ⚠️ LOCKED COMPONENT - DO NOT MODIFY ⚠️
 * This condition selector is locked and should not be modified.
 * All functionality is working correctly and has been protected.
 */

interface ConditionSelectorProps {
  value?: string;
  onChange: (value: 'excellent' | 'good' | 'fair' | 'poor') => void;
  readonly?: boolean;
}

export function ConditionSelector({ value, onChange, readonly = true }: ConditionSelectorProps) {
  // PROTECTION: This component is locked
  if (!readonly) {
    console.warn("ConditionSelector: Component is locked for modifications");
  }

  const handleChange = (newValue: 'excellent' | 'good' | 'fair' | 'poor') => {
    if (readonly) {
      console.warn("ConditionSelector: Selection blocked - component is locked");
      return;
    }
    onChange(newValue);
  };

  return (
    <div className="space-y-4 relative">
      {/* Lock indicator */}
      <div className="absolute -top-2 -right-2 z-10">
        <Lock className="w-4 h-4 text-gray-400" />
      </div>
      
      <div className="flex items-center gap-2">
        <Label className="text-base font-semibold">
          Overall Vehicle Condition
          {readonly && <span className="ml-2 text-xs text-gray-400">(Locked)</span>}
        </Label>
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
        {CONDITION_OPTIONS.map((option) => (
          <Card 
            key={option.value}
            className={`cursor-pointer transition-all hover:shadow-md ${
              value === option.value 
                ? 'ring-2 ring-primary bg-primary/5' 
                : readonly
                ? 'bg-gray-50 cursor-not-allowed'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => handleChange(option.value)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className={`font-medium ${readonly ? 'text-gray-500' : ''}`}>
                  {option.label}
                </h4>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  value === option.value 
                    ? 'bg-primary border-primary' 
                    : readonly
                    ? 'border-gray-300'
                    : 'border-muted-foreground'
                }`}>
                  {value === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                  )}
                </div>
              </div>
              <p className={`text-sm mb-2 ${readonly ? 'text-gray-400' : 'text-muted-foreground'}`}>
                {option.description}
              </p>
              <div className={`text-xs font-medium ${readonly ? 'text-gray-400' : 'text-primary'}`}>
                {option.impact}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {readonly && (
        <div className="flex items-center gap-2 mt-2 text-amber-600 text-sm">
          <Lock className="h-4 w-4" />
          <span>This component is locked and protected from modifications</span>
        </div>
      )}
    </div>
  );
}
