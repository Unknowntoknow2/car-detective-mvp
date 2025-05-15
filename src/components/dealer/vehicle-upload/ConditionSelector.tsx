
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConditionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const ConditionSelector: React.FC<ConditionSelectorProps> = ({
  value,
  onChange
}) => {
  const conditions = [
    { label: 'Excellent', value: 'Excellent', color: 'bg-green-500' },
    { label: 'Good', value: 'Good', color: 'bg-blue-500' },
    { label: 'Fair', value: 'Fair', color: 'bg-yellow-500' },
    { label: 'Poor', value: 'Poor', color: 'bg-red-500' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {conditions.map((condition) => (
        <button
          key={condition.value}
          type="button"
          className={cn(
            "flex flex-col items-center justify-center p-3 rounded-md border transition-all text-center h-24",
            value === condition.value 
              ? "border-primary shadow-sm bg-primary/5" 
              : "border-gray-200 hover:border-gray-300 bg-white"
          )}
          onClick={() => onChange(condition.value)}
        >
          <div className={cn(
            "w-4 h-4 rounded-full mb-2",
            condition.color
          )}>
            {value === condition.value && (
              <Check className="w-4 h-4 text-white" />
            )}
          </div>
          <span className="font-medium">{condition.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ConditionSelector;
