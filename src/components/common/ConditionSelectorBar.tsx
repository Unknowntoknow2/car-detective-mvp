
import React from 'react';
import { Button } from '@/components/ui/button';

interface ConditionSelectorBarProps {
  value: string;
  onChange: (condition: string) => void;
  className?: string;
}

const conditions = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

export const ConditionSelectorBar: React.FC<ConditionSelectorBarProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {conditions.map((condition) => (
        <Button
          key={condition.value}
          variant={value === condition.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(condition.value)}
        >
          {condition.label}
        </Button>
      ))}
    </div>
  );
};

export default ConditionSelectorBar;
