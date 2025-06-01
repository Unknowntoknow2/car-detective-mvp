
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FollowUpAnswers, CONDITION_OPTIONS, TIRE_CONDITION_OPTIONS, ConditionOption, TireConditionOption } from '@/types/follow-up-answers';

interface VehicleConditionTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function VehicleConditionTab({ formData, updateFormData }: VehicleConditionTabProps) {
  const handleConditionChange = (condition: 'excellent' | 'good' | 'fair' | 'poor') => {
    updateFormData({ condition });
  };

  const handleExteriorConditionChange = (condition: 'excellent' | 'good' | 'fair' | 'poor') => {
    updateFormData({ exterior_condition: condition });
  };

  const handleInteriorConditionChange = (condition: 'excellent' | 'good' | 'fair' | 'poor') => {
    updateFormData({ interior_condition: condition });
  };

  const handleTireConditionChange = (condition: 'excellent' | 'good' | 'fair' | 'poor') => {
    updateFormData({ tire_condition: condition });
  };

  return (
    <div className="space-y-6">
      {/* Overall Condition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🚗</span>
            Overall Vehicle Condition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CONDITION_OPTIONS.map((option: ConditionOption) => (
              <div
                key={option.value}
                onClick={() => handleConditionChange(option.value)}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  formData.condition === option.value
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

      {/* Exterior Condition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🎨</span>
            Exterior Condition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CONDITION_OPTIONS.map((option: ConditionOption) => (
              <div
                key={option.value}
                onClick={() => handleExteriorConditionChange(option.value)}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  formData.exterior_condition === option.value
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

      {/* Interior Condition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🪑</span>
            Interior Condition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TIRE_CONDITION_OPTIONS.map((option: TireConditionOption) => (
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
    </div>
  );
}
