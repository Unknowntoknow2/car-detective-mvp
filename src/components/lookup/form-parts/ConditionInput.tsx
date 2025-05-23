
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import ConditionSelectorBar, { ConditionLevel } from '@/components/common/ConditionSelectorBar';

interface ConditionInputProps {
  condition: ConditionLevel;
  setCondition: (value: ConditionLevel) => void;
  disabled?: boolean;
}

export const ConditionInput: React.FC<ConditionInputProps> = ({
  condition,
  setCondition,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <FormLabel className="block text-gray-700">Vehicle Condition</FormLabel>
      <ConditionSelectorBar
        value={condition}
        onChange={setCondition}
        disabled={disabled}
      />
    </div>
  );
};

export default ConditionInput;
