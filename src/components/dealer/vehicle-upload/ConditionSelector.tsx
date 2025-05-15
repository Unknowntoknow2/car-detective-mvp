
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';

interface ConditionSelectorProps {
  selectedCondition: string;
  onConditionChange: (condition: string) => void;
}

export const ConditionSelector: React.FC<ConditionSelectorProps> = ({
  selectedCondition,
  onConditionChange
}) => {
  const conditions = [
    { 
      value: 'excellent', 
      label: 'Excellent', 
      description: 'Like new condition with minimal wear and tear.' 
    },
    { 
      value: 'good', 
      label: 'Good', 
      description: 'Normal wear for age and mileage, no major mechanical issues.' 
    },
    { 
      value: 'fair', 
      label: 'Fair', 
      description: 'Some mechanical or cosmetic issues that need attention.' 
    },
    { 
      value: 'poor', 
      label: 'Poor', 
      description: 'Significant problems, may not be in reliable running condition.' 
    }
  ];
  
  return (
    <div className="space-y-3">
      <Label>Vehicle Condition</Label>
      <RadioGroup 
        value={selectedCondition} 
        onValueChange={onConditionChange}
        className="grid gap-2"
      >
        {conditions.map((condition) => (
          <label
            key={condition.value}
            className={`
              flex items-center gap-2 rounded-md border p-3 cursor-pointer
              ${selectedCondition === condition.value 
                ? 'bg-primary/5 border-primary/50' 
                : 'bg-transparent hover:bg-muted/50'}
            `}
          >
            <RadioGroupItem value={condition.value} id={`condition-${condition.value}`} />
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor={`condition-${condition.value}`} 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {condition.label}
              </Label>
              <p className="text-xs text-muted-foreground">
                {condition.description}
              </p>
            </div>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
};
