
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { Car, Disc, Palette, Sofa } from 'lucide-react';

interface ConditionTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const conditionLevels = [
  { value: 'excellent', label: 'Excellent', color: 'bg-green-500', description: 'Like new condition' },
  { value: 'very-good', label: 'Very Good', color: 'bg-blue-500', description: 'Minor wear only' },
  { value: 'good', label: 'Good', color: 'bg-yellow-500', description: 'Normal wear and tear' },
  { value: 'fair', label: 'Fair', color: 'bg-orange-500', description: 'Noticeable wear' },
  { value: 'poor', label: 'Poor', color: 'bg-red-500', description: 'Significant wear/damage' }
];

const tireConditionDetails = {
  excellent: { tread: '8-10/32"', description: 'Nearly new tires with excellent tread depth' },
  'very-good': { tread: '6-8/32"', description: 'Good tread depth, even wear pattern' },
  good: { tread: '4-6/32"', description: 'Adequate tread, some wear visible' },
  fair: { tread: '2-4/32"', description: 'Low tread depth, replacement needed soon' },
  poor: { tread: '0-2/32"', description: 'Worn to replacement indicators, unsafe' }
};

const brakeConditionDetails = {
  excellent: { remaining: '80-100%', description: 'Like new brake pads and rotors' },
  'very-good': { remaining: '60-80%', description: 'Good brake life remaining' },
  good: { remaining: '40-60%', description: 'Normal brake wear' },
  fair: { remaining: '20-40%', description: 'Brakes need attention soon' },
  poor: { remaining: '0-20%', description: 'Immediate brake service required' }
};

export function ConditionTab({ formData, updateFormData }: ConditionTabProps) {
  const getConditionInfo = (condition: string) => {
    return conditionLevels.find(level => level.value === condition) || conditionLevels[2];
  };

  const ConditionSelector = ({ 
    title, 
    icon: Icon, 
    value, 
    onChange, 
    details 
  }: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    value: string;
    onChange: (value: string) => void;
    details?: Record<string, { tread?: string; remaining?: string; description: string }>;
  }) => {
    const currentCondition = getConditionInfo(value);
    const currentDetail = details?.[value];

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-blue-500" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor={`${title.toLowerCase()}-condition`}>Condition Rating</Label>
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {conditionLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${level.color}`} />
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-gray-500">{level.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {value && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className={`${currentCondition.color} text-white`}>
                  {currentCondition.label}
                </Badge>
                {currentDetail?.tread && (
                  <span className="text-sm text-gray-600">Tread: {currentDetail.tread}</span>
                )}
                {currentDetail?.remaining && (
                  <span className="text-sm text-gray-600">Life: {currentDetail.remaining}</span>
                )}
              </div>
              <p className="text-sm text-gray-700">
                {currentDetail?.description || currentCondition.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tire Condition */}
      <ConditionSelector
        title="Tire Condition"
        icon={Disc}
        value={formData.tire_condition || ''}
        onChange={(value) => updateFormData({ tire_condition: value })}
        details={tireConditionDetails}
      />

      {/* Exterior Condition */}
      <ConditionSelector
        title="Exterior Condition"
        icon={Palette}
        value={formData.exterior_condition || ''}
        onChange={(value) => updateFormData({ exterior_condition: value })}
      />

      {/* Interior Condition */}
      <ConditionSelector
        title="Interior Condition"
        icon={Sofa}
        value={formData.interior_condition || ''}
        onChange={(value) => updateFormData({ interior_condition: value })}
      />

      {/* Brake Condition */}
      <ConditionSelector
        title="Brake Condition"
        icon={Car}
        value={formData.brake_condition || ''}
        onChange={(value) => updateFormData({ brake_condition: value })}
        details={brakeConditionDetails}
      />

      {/* Condition Summary */}
      {(formData.tire_condition || formData.exterior_condition || formData.interior_condition || formData.brake_condition) && (
        <Card>
          <CardHeader>
            <CardTitle>Condition Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Tires', value: formData.tire_condition },
                { label: 'Exterior', value: formData.exterior_condition },
                { label: 'Interior', value: formData.interior_condition },
                { label: 'Brakes', value: formData.brake_condition }
              ].map(({ label, value }) => {
                if (!value) return null;
                const condition = getConditionInfo(value);
                return (
                  <div key={label} className="text-center">
                    <div className="text-sm text-gray-600 mb-1">{label}</div>
                    <Badge variant="secondary" className={`${condition.color} text-white`}>
                      {condition.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
