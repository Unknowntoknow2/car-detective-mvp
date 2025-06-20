
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { getFeaturesByCategory } from '@/utils/enhanced-features-calculator';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function FeaturesTab({ formData, updateFormData }: FeaturesTabProps) {
  const allFeatures = [
    ...getFeaturesByCategory('audio'),
    ...getFeaturesByCategory('technology'),
    ...getFeaturesByCategory('safety'),
    ...getFeaturesByCategory('exterior'),
    ...getFeaturesByCategory('interior'),
  ];
  
  const selectedFeatures = formData.features || [];

  const handleFeatureToggle = (featureId: string) => {
    const updatedFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter((f: string) => f !== featureId)
      : [...selectedFeatures, featureId];
    
    updateFormData({ features: updatedFeatures });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select any additional features your vehicle has:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allFeatures.map((feature: any) => (
          <div key={feature.id} className="flex items-center space-x-2">
            <Checkbox
              id={feature.id}
              checked={selectedFeatures.includes(feature.id)}
              onCheckedChange={(checked: boolean) => {
                if (checked) {
                  handleFeatureToggle(feature.id);
                } else {
                  handleFeatureToggle(feature.id);
                }
              }}
            />
            <Label htmlFor={feature.id} className="cursor-pointer">
              {feature.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
