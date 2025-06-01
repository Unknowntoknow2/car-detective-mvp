import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ConditionTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function ConditionTab({ formData, updateFormData }: ConditionTabProps) {
  const handleConditionChange = (value: string) => {
    updateFormData({ condition: value as 'excellent' | 'good' | 'fair' | 'poor' });
  };

  const handleExteriorConditionChange = (value: string) => {
    updateFormData({ exterior_condition: value as 'excellent' | 'good' | 'fair' | 'poor' });
  };

  const handleInteriorConditionChange = (value: string) => {
    updateFormData({ interior_condition: value as 'excellent' | 'good' | 'fair' | 'poor' });
  };

  const handleTireConditionChange = (value: string) => {
    updateFormData({ tire_condition: value as 'excellent' | 'good' | 'fair' | 'poor' });
  };

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent', description: 'Like new condition' },
    { value: 'good', label: 'Good', description: 'Minor wear and tear' },
    { value: 'fair', label: 'Fair', description: 'Noticeable wear' },
    { value: 'poor', label: 'Poor', description: 'Significant issues' },
  ];

  const tireConditionOptions = [
    { value: 'excellent', label: 'Like New', description: 'Minimal wear, plenty of tread' },
    { value: 'good', label: 'Good Tread', description: 'Normal wear, good condition' },
    { value: 'fair', label: 'Worn', description: 'Moderate wear, may need replacement soon' },
    { value: 'poor', label: 'Needs Replacement', description: 'Worn out, needs immediate replacement' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Vehicle Condition</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.condition || ''}
            onValueChange={handleConditionChange}
            className="grid grid-cols-2 gap-4"
          >
            {conditionOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`condition-${option.value}`} />
                <Label htmlFor={`condition-${option.value}`} className="cursor-pointer">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tire Condition</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.tire_condition || ''}
            onValueChange={handleTireConditionChange}
            className="grid grid-cols-2 gap-4"
          >
            {tireConditionOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`tire-${option.value}`} />
                <Label htmlFor={`tire-${option.value}`} className="cursor-pointer">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.additional_notes || ''}
            onChange={(e) => updateFormData({ additional_notes: e.target.value })}
            placeholder="Any additional details about the vehicle condition..."
            rows={4}
          />
        </CardContent>
      </Card>
    </div>
  );
}
