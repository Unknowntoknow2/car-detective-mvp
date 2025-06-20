
import React from 'react';
import { Label } from '@/components/ui/label';
import { UnifiedConditionSelector } from '@/components/common/UnifiedConditionSelector';
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
      <UnifiedConditionSelector
        type="overall"
        value={condition}
        onChange={(value) => setCondition(value as ConditionLevel)}
        variant="segmented"
        disabled={disabled}
      />
    </div>
  );
}
