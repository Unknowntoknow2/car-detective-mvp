
import React from 'react';
import { Label } from '@/components/ui/label';
import { ConditionSelectorBar, ConditionLevel } from '@/components/common/ConditionSelectorBar';

interface ConditionInputProps {
  condition: ConditionLevel;
  setCondition: (value: ConditionLevel) => void;
  disabled?: boolean;
}

export function ConditionInput({ 
  condition, 
  setCondition,
  disabled = false 
}: ConditionInputProps) {
  return (
    <div>
      <Label htmlFor="condition">Condition</Label>
      <ConditionSelectorBar
        value={condition}
        onChange={setCondition}
        disabled={disabled}
      />
    </div>
  );
}
