
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { Check } from 'lucide-react';

interface ConditionTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const conditionOptions = [
  {
    value: 'excellent',
    title: 'Excellent',
    description: 'Like new condition, minimal wear',
    impact: '+15% to +20%',
    color: 'bg-green-100 border-green-300 text-green-800',
    selectedColor: 'bg-green-500 border-green-600 text-white'
  },
  {
    value: 'very-good',
    title: 'Very Good',
    description: 'Minor wear, well maintained',
    impact: '+5% to +10%',
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    selectedColor: 'bg-blue-500 border-blue-600 text-white'
  },
  {
    value: 'good',
    title: 'Good',
    description: 'Normal wear for age and mileage',
    impact: 'Baseline Value',
    color: 'bg-gray-100 border-gray-300 text-gray-800',
    selectedColor: 'bg-gray-500 border-gray-600 text-white'
  },
  {
    value: 'fair',
    title: 'Fair',
    description: 'Some cosmetic issues, needs attention',
    impact: '-10% to -20%',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    selectedColor: 'bg-yellow-500 border-yellow-600 text-white'
  },
  {
    value: 'poor',
    title: 'Poor',
    description: 'Significant issues, major repairs needed',
    impact: '-25% to -40%',
    color: 'bg-red-100 border-red-300 text-red-800',
    selectedColor: 'bg-red-500 border-red-600 text-white'
  }
];

export function ConditionTab({ formData, updateFormData }: ConditionTabProps) {
  const handleConditionSelect = (condition: string) => {
    updateFormData({ condition });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔍 Overall Vehicle Condition
          </CardTitle>
          <p className="text-sm text-gray-600">
            Select the condition that best describes your vehicle's overall state
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conditionOptions.map((option) => {
              const isSelected = formData.condition === option.value;
              const colorClass = isSelected ? option.selectedColor : option.color;
              
              return (
                <div
                  key={option.value}
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${colorClass}`}
                  onClick={() => handleConditionSelect(option.value)}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{option.title}</h3>
                    <p className="text-sm opacity-90">{option.description}</p>
                    <div className="text-xs font-medium">
                      Value Impact: {option.impact}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
