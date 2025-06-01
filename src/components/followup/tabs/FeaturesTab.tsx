
import React from 'react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { EnhancedFeaturesSelector } from '@/components/features/EnhancedFeaturesSelector';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  baseValue?: number;
  overrideDetected?: boolean;
}

export function FeaturesTab({ 
  formData, 
  updateFormData, 
  baseValue = 25000,
  overrideDetected = false 
}: FeaturesTabProps) {
  const handleFeaturesChange = (features: string[]) => {
    updateFormData({ features });
  };

  return (
    <div>
      <EnhancedFeaturesSelector
        selectedFeatures={formData.features || []}
        onFeaturesChange={handleFeaturesChange}
        baseValue={baseValue}
        showPricing={true}
        overrideDetected={overrideDetected}
      />
    </div>
  );
}
