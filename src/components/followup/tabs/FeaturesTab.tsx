
import React from 'react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { EnhancedFeaturesSelector } from '@/components/features/EnhancedFeaturesSelector';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function FeaturesTab({ formData, updateFormData }: FeaturesTabProps) {
  const handleFeaturesChange = (features: string[]) => {
    updateFormData({ features });
  };

  // Estimate base value for feature calculations (this could come from initial valuation)
  const estimatedBaseValue = 25000; // This should ideally come from props or context

  return (
    <div>
      <EnhancedFeaturesSelector
        selectedFeatures={formData.features || []}
        onFeaturesChange={handleFeaturesChange}
        baseValue={estimatedBaseValue}
        showPricing={true}
      />
    </div>
  );
}
