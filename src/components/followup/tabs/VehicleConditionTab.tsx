
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { Car, Palette, Sofa, Gauge } from 'lucide-react';

interface VehicleConditionTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const CONDITION_OPTIONS = [
  { value: 'excellent' as const, label: 'Excellent', description: 'Like new condition', color: 'bg-green-50 border-green-200 text-green-700' },
  { value: 'good' as const, label: 'Good', description: 'Minor wear and tear', color: 'bg-blue-50 border-blue-200 text-blue-700' },
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
    <Card className={`${bgColor}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {CONDITION_OPTIONS.map((option) => (
            <div
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`cursor-pointer p-3 rounded-lg border-2 transition-all text-center ${
                value === option.value
                  ? option.color + ' font-medium'
                  : 'bg-white border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <div className="font-medium text-sm">{option.label}</div>
              <div className="text-xs mt-1 opacity-75">{option.description}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
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
