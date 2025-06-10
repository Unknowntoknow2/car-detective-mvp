
import React from 'react';
import { cn } from '@/lib/utils';

export interface TireConditionSelectorBarProps {
  value: 'excellent' | 'good' | 'fair' | 'poor';
  onChange: (value: 'excellent' | 'good' | 'fair' | 'poor') => void;
}

const tireConditionOptions = [
  { value: 'excellent', label: 'Like New', color: 'bg-green-100 border-green-500 text-green-800' },
  { value: 'good', label: 'Good Tread', color: 'bg-blue-100 border-blue-500 text-blue-800' },
  { value: 'fair', label: 'Worn', color: 'bg-yellow-100 border-yellow-500 text-yellow-800' },
  { value: 'poor', label: 'Needs Replacement', color: 'bg-red-100 border-red-500 text-red-800' },
] as const;

export function TireConditionSelectorBar({ value, onChange }: TireConditionSelectorBarProps) {
  return (
    <div className="flex space-x-2 mt-2">
      {tireConditionOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all',
            value === option.value
              ? option.color
              : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
