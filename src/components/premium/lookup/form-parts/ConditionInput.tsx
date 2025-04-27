
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ConditionLevel, ConditionOption } from '@/components/lookup/types/manualEntry';

const CONDITION_OPTIONS: ConditionOption[] = [
  { value: 'poor', label: 'Poor', conditionValue: 25, description: 'Significant repairs needed, not fully operational' },
  { value: 'fair', label: 'Fair', conditionValue: 50, description: 'Functional but has noticeable wear and issues' },
  { value: 'good', label: 'Good', conditionValue: 75, description: 'Minor wear, fully functional with minimal issues' },
  { value: 'excellent', label: 'Excellent', conditionValue: 100, description: 'Like new condition with minimal wear' }
];

interface ConditionInputProps {
  condition: ConditionLevel;
  conditionValue: number;
  onChange: (value: ConditionLevel) => void;
  onSliderChange: (value: number) => void;
  disabled?: boolean;
}

export function ConditionInput({ 
  condition, 
  conditionValue, 
  onChange, 
  onSliderChange, 
  disabled 
}: ConditionInputProps) {
  const selectedCondition = CONDITION_OPTIONS.find(option => option.value === condition);

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 block">Vehicle Condition</Label>
        <Select 
          value={condition} 
          onValueChange={(value: ConditionLevel) => onChange(value)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            {CONDITION_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="mt-3">
          <Slider 
            defaultValue={[75]} 
            max={100} 
            step={1} 
            value={[conditionValue]}
            onValueChange={value => onSliderChange(value[0])}
            disabled={disabled}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Poor</span>
            <span>Fair</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>
        </div>
        
        {selectedCondition && (
          <p className="text-sm text-slate-600 mt-3">
            {selectedCondition.description}
          </p>
        )}
      </div>
    </div>
  );
}
