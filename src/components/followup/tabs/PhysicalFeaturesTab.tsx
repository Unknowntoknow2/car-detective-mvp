import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FollowUpAnswers, ConditionOption, TireConditionOption } from '@/types/follow-up-answers';

interface PhysicalFeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function PhysicalFeaturesTab({ formData, updateFormData }: PhysicalFeaturesTabProps) {
  const TIRE_CONDITION_OPTIONS: TireConditionOption[] = [
    {
      value: 'excellent',
      label: 'Excellent',
      color: 'bg-green-100 border-green-500 text-green-800',
      description: 'Like new, minimal wear',
      impact: 500
    },
    {
      value: 'good',
      label: 'Good',
      color: 'bg-blue-100 border-blue-500 text-blue-800',
      description: 'Normal wear, no issues',
      impact: 300
    },
    {
      value: 'fair',
      label: 'Fair',
      color: 'bg-yellow-100 border-yellow-500 text-yellow-800',
      description: 'Some wear, may need replacement soon',
      impact: 100
    },
    {
      value: 'poor',
      label: 'Poor',
      color: 'bg-red-100 border-red-500 text-red-800',
      description: 'Significant wear, needs immediate replacement',
      impact: -200
    }
  ];

  const EXTERIOR_CONDITION_OPTIONS: ConditionOption[] = [
    {
      value: 'excellent',
      label: 'Excellent',
      color: 'bg-green-100 border-green-500 text-green-800',
      description: 'No scratches, dents, or rust',
      impact: 600
    },
    {
      value: 'good',
      label: 'Good',
      color: 'bg-blue-100 border-blue-500 text-blue-800',
      description: 'Minor scratches or dents, no rust',
      impact: 300
    },
    {
      value: 'fair',
      label: 'Fair',
      color: 'bg-yellow-100 border-yellow-500 text-yellow-800',
      description: 'Noticeable scratches, dents, or minor rust',
      impact: -100
    },
    {
      value: 'poor',
      label: 'Poor',
      color: 'bg-red-100 border-red-500 text-red-800',
      description: 'Significant damage, rust, or bodywork needed',
      impact: -400
    }
  ];

  const INTERIOR_CONDITION_OPTIONS: ConditionOption[] = [
    {
      value: 'excellent',
      label: 'Excellent',
      color: 'bg-green-100 border-green-500 text-green-800',
      description: 'Like new, no stains or damage',
      impact: 500
    },
    {
      value: 'good',
      label: 'Good',
      color: 'bg-blue-100 border-blue-500 text-blue-800',
      description: 'Normal wear, minor stains or wear',
      impact: 200
    },
    {
      value: 'fair',
      label: 'Fair',
      color: 'bg-yellow-100 border-yellow-500 text-yellow-800',
      description: 'Visible stains, tears, or damage',
      impact: -200
    },
    {
      value: 'poor',
      label: 'Poor',
      color: 'bg-red-100 border-red-500 text-red-800',
      description: 'Significant damage, odors, or missing parts',
      impact: -500
    }
  ];

  const handleTireConditionChange = (condition: TireConditionOption['value']) => {
    updateFormData({ tire_condition: condition });
  };

  const handleExteriorConditionChange = (condition: ConditionOption['value']) => {
    updateFormData({ exterior_condition: condition });
  };

  const handleInteriorConditionChange = (condition: ConditionOption['value']) => {
    updateFormData({ interior_condition: condition });
  };

  const calculateImpact = (selectedOption: any) => {
    return selectedOption?.impact || 0;
  };

  return (
    <div className="space-y-6">
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
                <div className="text-sm text-gray-600">{option.description || 'No description'}</div>
                <div className="text-xs text-green-600">
                  Value Impact: ${calculateImpact(option)}
                </div>
                {formData.tire_condition === option.value && (
                  <div className="text-xs text-blue-600 mt-1">
                    Current Impact: ${calculateImpact(option)} to ${calculateImpact(option) * 1.5}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🎨</span>
            Exterior Condition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EXTERIOR_CONDITION_OPTIONS.map((option) => (
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
                <div className="text-sm text-gray-600">{option.description || 'No description'}</div>
              </div>
            ))}
          </div>

          {formData.exterior_condition && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Selected:</strong> {EXTERIOR_CONDITION_OPTIONS.find(opt => opt.value === formData.exterior_condition)?.label}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Impact: ${calculateImpact(EXTERIOR_CONDITION_OPTIONS.find(opt => opt.value === formData.exterior_condition)) || 0} to ${(calculateImpact(EXTERIOR_CONDITION_OPTIONS.find(opt => opt.value === formData.exterior_condition)) || 0) * 1.2}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interior Condition Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="mr-2">🪑</span>
            Interior Condition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {INTERIOR_CONDITION_OPTIONS.map((option) => (
              <div
                key={option.value}
                onClick={() => handleInteriorConditionChange(option.value)}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  formData.interior_condition === option.value
                    ? option.color
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description || 'No description'}</div>
              </div>
            ))}
          </div>

          {formData.interior_condition && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Interior Impact:</strong> ${calculateImpact(INTERIOR_CONDITION_OPTIONS.find(opt => opt.value === formData.interior_condition)) || 0} to ${(calculateImpact(INTERIOR_CONDITION_OPTIONS.find(opt => opt.value === formData.interior_condition)) || 0) * 1.3} value adjustment
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
