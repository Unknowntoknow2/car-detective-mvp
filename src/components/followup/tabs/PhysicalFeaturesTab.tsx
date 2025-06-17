
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FollowUpAnswers, ConditionOption, TireConditionOption } from '@/types/follow-up-answers';

interface PhysicalFeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

// Define option configurations for display
const tireConditionOptions: Array<{
  value: TireConditionOption;
  label: string;
  color: string;
  description: string;
}> = [
  {
    value: 'excellent',
    label: 'Excellent',
    color: 'bg-green-500',
    description: 'Like new tires with excellent tread'
  },
  {
    value: 'good',
    label: 'Good',
    color: 'bg-blue-500',
    description: 'Good condition with adequate tread'
  },
  {
    value: 'worn',
    label: 'Worn',
    color: 'bg-yellow-500',
    description: 'Worn but still usable'
  },
  {
    value: 'replacement',
    label: 'Needs Replacement',
    color: 'bg-red-500',
    description: 'Requires immediate replacement'
  }
];

const exteriorConditionOptions: Array<{
  value: ConditionOption;
  label: string;
  color: string;
  description: string;
}> = [
  {
    value: 'excellent',
    label: 'Excellent',
    color: 'bg-green-500',
    description: 'Like new appearance'
  },
  {
    value: 'very-good',
    label: 'Very Good',
    color: 'bg-green-400',
    description: 'Minor imperfections'
  },
  {
    value: 'good',
    label: 'Good',
    color: 'bg-blue-500',
    description: 'Some wear but well maintained'
  },
  {
    value: 'fair',
    label: 'Fair',
    color: 'bg-yellow-500',
    description: 'Noticeable wear and minor damage'
  },
  {
    value: 'poor',
    label: 'Poor',
    color: 'bg-red-500',
    description: 'Significant damage or wear'
  }
];

const interiorConditionOptions: Array<{
  value: ConditionOption;
  label: string;
  color: string;
  description: string;
}> = [
  {
    value: 'excellent',
    label: 'Excellent',
    color: 'bg-green-500',
    description: 'Like new interior'
  },
  {
    value: 'very-good',
    label: 'Very Good',
    color: 'bg-green-400',
    description: 'Minimal wear'
  },
  {
    value: 'good',
    label: 'Good',
    color: 'bg-blue-500',
    description: 'Normal wear for age'
  },
  {
    value: 'fair',
    label: 'Fair',
    color: 'bg-yellow-500',
    description: 'Noticeable wear'
  },
  {
    value: 'poor',
    label: 'Poor',
    color: 'bg-red-500',
    description: 'Significant wear or damage'
  }
];

export function PhysicalFeaturesTab({ formData, updateFormData }: PhysicalFeaturesTabProps) {
  const handleTireConditionChange = (value: TireConditionOption) => {
    updateFormData({ tire_condition: value });
  };

  const handleExteriorConditionChange = (value: ConditionOption) => {
    updateFormData({ exterior_condition: value });
  };

  const handleInteriorConditionChange = (value: ConditionOption) => {
    updateFormData({ interior_condition: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">Tire Condition</Label>
        <p className="text-sm text-muted-foreground mb-3">
          Select the current condition of the vehicle's tires.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {tireConditionOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={formData.tire_condition === option.value ? "default" : "outline"}
              onClick={() => handleTireConditionChange(option.value)}
              className={`justify-start h-auto p-3 ${
                formData.tire_condition === option.value ? option.color + ' text-white' : ''
              }`}
            >
              <div className="text-left">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs opacity-80">{option.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold">Exterior Condition</Label>
        <p className="text-sm text-muted-foreground mb-3">
          Rate the exterior condition of the vehicle.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {exteriorConditionOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={formData.exterior_condition === option.value ? "default" : "outline"}
              onClick={() => handleExteriorConditionChange(option.value)}
              className={`justify-start h-auto p-3 ${
                formData.exterior_condition === option.value ? option.color + ' text-white' : ''
              }`}
            >
              <div className="text-left">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs opacity-80">{option.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold">Interior Condition</Label>
        <p className="text-sm text-muted-foreground mb-3">
          Rate the interior condition of the vehicle.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {interiorConditionOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={formData.interior_condition === option.value ? "default" : "outline"}
              onClick={() => handleInteriorConditionChange(option.value)}
              className={`justify-start h-auto p-3 ${
                formData.interior_condition === option.value ? option.color + ' text-white' : ''
              }`}
            >
              <div className="text-left">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs opacity-80">{option.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="physical_notes">Additional Physical Condition Notes</Label>
        <Textarea
          id="physical_notes"
          placeholder="Describe any specific physical conditions, damage, or noteworthy features..."
          value={formData.additional_notes || ''}
          onChange={(e) => updateFormData({ additional_notes: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  );
}
