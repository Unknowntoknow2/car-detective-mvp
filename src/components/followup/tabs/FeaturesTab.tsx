
import React, { useRef } from 'react';
import { EnhancedFeature, FEATURE_CATEGORIES, ENHANCED_FEATURES } from '@/data/enhanced-features-database';
import { FeatureCard } from '@/components/features/FeatureCard';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (data: Partial<FollowUpAnswers>) => void;
  baseValue?: number;
}

export const FeaturesTab: React.FC<FeaturesTabProps> = ({
  formData,
  updateFormData,
  baseValue = 20000, // Default base value
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFeatureToggle = (featureName: string) => {
    const features = formData.features || [];
    const updated = features.includes(featureName)
      ? features.filter((f) => f !== featureName)
      : [...features, featureName];

    updateFormData({ features: updated });
  };

  const selectedFeatures = new Set(formData.features || []);
  const allSelectedFeatures: EnhancedFeature[] = [];

  FEATURE_CATEGORIES.forEach((category) => {
    (ENHANCED_FEATURES[category] || []).forEach((f) => {
      if (selectedFeatures.has(f.name)) {
        allSelectedFeatures.push(f);
      }
    });
  });

  const totalValue = allSelectedFeatures.reduce((sum, f) => {
    const value = Math.round(baseValue * (f.percentage || 0) + (f.fixed || 0));
    return sum + value;
  }, 0);

  return (
    <div className="w-full">
      {/* Feature Sections */}
      <div ref={containerRef} className="space-y-8">
        {FEATURE_CATEGORIES.map((category) => {
          const features: EnhancedFeature[] = ENHANCED_FEATURES[category] || [];

          return (
            <div key={category} id={`feature-${category}`}>
              <h3 className="text-xl font-bold mb-4 text-gray-900">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {features.map((feature) => {
                  const isSelected = selectedFeatures.has(feature.name);
                  const valueImpact = Math.round(
                    baseValue * (feature.percentage || 0) + (feature.fixed || 0)
                  );
                  
                  return (
                    <FeatureCard
                      key={feature.name}
                      feature={feature}
                      isSelected={isSelected}
                      onToggle={handleFeatureToggle}
                      valueImpact={valueImpact}
                      category={category}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Total Summary */}
      <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 pt-4 pb-4 mt-6">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="text-gray-700 text-sm">
              {selectedFeatures.size > 0
                ? `You've selected ${selectedFeatures.size} feature${selectedFeatures.size > 1 ? 's' : ''}`
                : 'Select features to see estimated value'}
            </div>
            {totalValue > 0 && (
              <div className="text-green-700 font-bold text-lg">
                +${totalValue.toLocaleString()} estimated value added
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
