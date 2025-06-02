
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { Car, Palette, Sofa, Gauge } from 'lucide-react';

interface VehicleConditionTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const CONDITION_OPTIONS = [
  { value: 'excellent' as const, label: 'Excellent', description: 'Like new', color: 'bg-green-50 border-green-200 text-green-700' },
  { value: 'good' as const, label: 'Good', description: 'Minor wear', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { value: 'fair' as const, label: 'Fair', description: 'Noticeable wear', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { value: 'poor' as const, label: 'Poor', description: 'Significant issues', color: 'bg-red-50 border-red-200 text-red-700' },
];

export function VehicleConditionTab({ formData, updateFormData }: VehicleConditionTabProps) {
  const ConditionSelector = ({ 
    title, 
    icon: Icon, 
    value, 
    onChange,
    bgColor 
  }: { 
    title: string; 
    icon: any; 
    value: string; 
    onChange: (value: 'excellent' | 'good' | 'fair' | 'poor') => void;
    bgColor: string;
  }) => (
    <div className={`p-3 rounded-lg border ${bgColor}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4" />
        <h3 className="font-medium text-sm">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {CONDITION_OPTIONS.map((option) => (
          <div
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer p-2 rounded-md border transition-all text-center ${
              value === option.value
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
  );

  return (
    <div className="space-y-4">
      <ConditionSelector
        title="Overall Vehicle Condition"
        icon={Car}
        value={formData.condition || ''}
        onChange={(condition) => updateFormData({ condition })}
        bgColor="bg-blue-50 border-blue-200"
      />

      <ConditionSelector
        title="Exterior Condition"
        icon={Palette}
        value={formData.exterior_condition || ''}
        onChange={(condition) => updateFormData({ exterior_condition: condition })}
        bgColor="bg-green-50 border-green-200"
      />

      <ConditionSelector
        title="Interior Condition"
        icon={Sofa}
        value={formData.interior_condition || ''}
        onChange={(condition) => updateFormData({ interior_condition: condition })}
        bgColor="bg-purple-50 border-purple-200"
      />

      <ConditionSelector
        title="Tire Condition"
        icon={Gauge}
        value={formData.tire_condition || ''}
        onChange={(condition) => updateFormData({ tire_condition: condition })}
        bgColor="bg-orange-50 border-orange-200"
      />
    </div>
  );
}
