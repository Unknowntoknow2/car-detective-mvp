
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ConditionSelectorProps {
  value: string;
  onChange: (condition: string) => void;
  className?: string;
}

const conditions = [
  { value: 'excellent', label: 'Excellent', description: 'Like new condition' },
  { value: 'good', label: 'Good', description: 'Well maintained' },
  { value: 'fair', label: 'Fair', description: 'Some wear and tear' },
  { value: 'poor', label: 'Poor', description: 'Needs significant work' },
];

export const ConditionSelector: React.FC<ConditionSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium">Vehicle Condition</label>
      <div className="flex flex-wrap gap-2">
        {conditions.map((condition) => (
          <Button
            key={condition.value}
            variant={value === condition.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(condition.value)}
            className="flex flex-col items-center p-3 h-auto"
          >
            <span className="font-medium">{condition.label}</span>
            <span className="text-xs text-muted-foreground">
              {condition.description}
            </span>
          </Button>
        ))}
      </div>
      {value && (
        <Badge variant="secondary" className="mt-2">
          Selected: {conditions.find(c => c.value === value)?.label}
        </Badge>
      )}
    </div>
  );
};

export default ConditionSelector;
