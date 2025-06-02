
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { CircleDot, StopCircle } from 'lucide-react';

interface TiresBrakesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const TIRE_CONDITIONS = [
  { value: 'excellent' as const, label: 'Excellent', description: 'Like new, minimal wear', color: 'bg-green-50 border-green-200 text-green-700' },
  { value: 'good' as const, label: 'Good', description: 'Normal wear, plenty of tread', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { value: 'fair' as const, label: 'Fair', description: 'Moderate wear, replacement soon', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { value: 'poor' as const, label: 'Poor', description: 'Worn out, needs replacement', color: 'bg-red-50 border-red-200 text-red-700' },
];

const BRAKE_CONDITIONS = [
  { value: 'excellent' as const, label: 'Excellent', description: 'Like new, no wear', color: 'bg-green-50 border-green-200 text-green-700' },
  { value: 'good' as const, label: 'Good', description: 'Normal wear, good stopping', color: 'bg-blue-50 border-blue-200 text-blue-700' },
  { value: 'fair' as const, label: 'Fair', description: 'Some wear, service soon', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { value: 'poor' as const, label: 'Poor', description: 'Significant wear, needs replacement', color: 'bg-red-50 border-red-200 text-red-700' },
];

export function TiresBrakesTab({ formData, updateFormData }: TiresBrakesTabProps) {
  return (
    <div className="space-y-6">
      {/* Tire Condition */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CircleDot className="h-5 w-5 text-blue-600" />
            Tire Condition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {TIRE_CONDITIONS.map((option) => (
              <div
                key={option.value}
                onClick={() => updateFormData({ tire_condition: option.value })}
                className={`cursor-pointer p-3 rounded-lg border-2 transition-all text-center ${
                  formData.tire_condition === option.value
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

      {/* Brake Condition */}
      <Card className="bg-red-50 border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <StopCircle className="h-5 w-5 text-red-600" />
            Brake Condition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {BRAKE_CONDITIONS.map((option) => (
              <div
                key={option.value}
                onClick={() => updateFormData({ brake_condition: option.value })}
                className={`cursor-pointer p-3 rounded-lg border-2 transition-all text-center ${
                  formData.brake_condition === option.value
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
    </div>
  );
}
