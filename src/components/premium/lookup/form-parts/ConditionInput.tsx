
import React from 'react';
import { Label } from '@/components/ui/label';
import { ConditionSelectorBar } from '@/components/common/ConditionSelectorBar';

// Define ConditionLevel locally
export enum ConditionLevel {
  Poor = "Poor",
  Fair = "Fair",
  Good = "Good",
  VeryGood = "Very Good", 
  Excellent = "Excellent"
}

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
  const handleChange = (value: string) => {
    setCondition(value as ConditionLevel);
  };

  return (
    <div>
      <Label htmlFor="condition">Condition</Label>
      <ConditionSelectorBar
        value={condition}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
}
