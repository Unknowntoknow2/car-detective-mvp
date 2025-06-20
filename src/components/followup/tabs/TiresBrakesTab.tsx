
import React from 'react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { TireConditionOption } from '@/types/condition';
import { CircleDot, StopCircle } from 'lucide-react';

interface TiresBrakesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const TIRE_CONDITIONS = [
  { value: 'excellent' as TireConditionOption, label: 'Excellent', description: 'Like new, minimal wear', color: 'bg-green-50 border-green-200 text-green-700' },
  { value: 'good' as TireConditionOption, label: 'Good', description: 'Normal wear', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { value: 'worn' as TireConditionOption, label: 'Worn', description: 'Moderate wear', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { value: 'replacement' as TireConditionOption, label: 'Needs Replacement', description: 'Requires immediate replacement', color: 'bg-red-50 border-red-200 text-red-700' },
];

const BRAKE_CONDITIONS = [
  { value: 'excellent', label: 'Excellent', description: 'Like new', color: 'bg-green-50 border-green-200 text-green-700' },
  { value: 'good', label: 'Good', description: 'Good stopping', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { value: 'worn', label: 'Worn', description: 'Service soon', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { value: 'replacement', label: 'Poor', description: 'Needs replacement', color: 'bg-red-50 border-red-200 text-red-700' },
];

export function TiresBrakesTab({ formData, updateFormData }: TiresBrakesTabProps) {
  return (
    <div className="space-y-4">
      {/* Tire Condition */}
      <div className="p-3 rounded-lg border bg-blue-50 border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <CircleDot className="h-4 w-4 text-blue-600" />
          <h3 className="font-medium text-sm">Tire Condition</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TIRE_CONDITIONS.map((option) => (
            <div
              key={option.value}
              onClick={() => updateFormData({ tire_condition: option.value })}
              className={`cursor-pointer p-2 rounded-md border transition-all text-center ${
                formData.tire_condition === option.value
                  ? option.color + ' font-medium'
                  : 'bg-white border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <div className="font-medium text-xs">{option.label}</div>
              <div className="text-xs mt-1 opacity-75">{option.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Brake Condition */}
      <div className="p-3 rounded-lg border bg-red-50 border-red-200">
        <div className="flex items-center gap-2 mb-3">
          <StopCircle className="h-4 w-4 text-red-600" />
          <h3 className="font-medium text-sm">Brake Condition</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {BRAKE_CONDITIONS.map((option) => (
            <div
              key={option.value}
              onClick={() => updateFormData({ brake_condition: option.value })}
              className={`cursor-pointer p-2 rounded-md border transition-all text-center ${
                formData.brake_condition === option.value
                  ? option.color + ' font-medium'
                  : 'bg-white border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <div className="font-medium text-xs">{option.label}</div>
              <div className="text-xs mt-1 opacity-75">{option.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
