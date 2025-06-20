
import React from 'react';
import { Label } from '@/components/ui/label';
import { ConditionSelectorSegmented } from '@/components/lookup/ConditionSelectorSegmented';
import { ConditionLevel } from '@/types/condition';

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
      <ConditionSelectorSegmented
        value={condition}
        onChange={setCondition}
      />
    </div>
  );
}
