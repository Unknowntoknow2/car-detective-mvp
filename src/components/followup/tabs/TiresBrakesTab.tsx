import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface TiresBrakesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function TiresBrakesTab({ formData, updateFormData }: TiresBrakesTabProps) {
  const TIRE_CONDITION_OPTIONS = [
    { value: 'excellent' as const, label: 'Excellent', color: 'bg-green-100 border-green-500 text-green-800', description: 'Like new, minimal wear' },
    { value: 'good' as const, label: 'Good', color: 'bg-blue-100 border-blue-500 text-blue-800', description: 'Normal wear, plenty of tread' },
    { value: 'fair' as const, label: 'Fair', color: 'bg-yellow-100 border-yellow-500 text-yellow-800', description: 'Moderate wear, may need replacement soon' },
    { value: 'poor' as const, label: 'Poor', color: 'bg-red-100 border-red-500 text-red-800', description: 'Worn out, needs immediate replacement' },
  ];

  const handleTireConditionChange = (condition: 'excellent' | 'good' | 'fair' | 'poor') => {
    updateFormData({ tire_condition: condition });
  };

  const BRAKE_CONDITION_OPTIONS = [
    { value: 'excellent' as const, label: 'Excellent', color: 'bg-green-100 border-green-500 text-green-800', description: 'Like new, no wear' },
    { value: 'good' as const, label: 'Good', color: 'bg-blue-100 border-blue-500 text-blue-800', description: 'Normal wear, good stopping' },
    { value: 'fair' as const, label: 'Fair', color: 'bg-yellow-100 border-yellow-500 text-yellow-800', description: 'Some wear, may need service soon' },
    { value: 'poor' as const, label: 'Poor', color: 'bg-red-100 border-red-500 text-red-800', description: 'Significant wear, needs replacement' },
  ];

  const handleBrakeConditionChange = (condition: 'excellent' | 'good' | 'fair' | 'poor') => {
    updateFormData({ brake_condition: condition });
  };

  return (
    <div className="space-y-6">
      {/* Tire Condition Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🛞</span>
            Tire Condition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TIRE_CONDITION_OPTIONS.map((option) => (
              <div
                key={option.value}
                onClick={() => handleTireConditionChange(option.value)}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  formData.tire_condition === option.value
                    ? option.color
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brake Condition Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🛑</span>
            Brake Condition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BRAKE_CONDITION_OPTIONS.map((option) => (
              <div
                key={option.value}
                onClick={() => handleBrakeConditionChange(option.value)}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  formData.brake_condition === option.value
                    ? option.color
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
