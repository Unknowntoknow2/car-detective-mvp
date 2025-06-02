
import React, { useState, useRef } from 'react';
import { EnhancedFeature, FEATURE_CATEGORIES, ENHANCED_FEATURES } from '@/data/enhanced-features-database';
import { FeatureCard } from '@/components/features/FeatureCard';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface FeaturesTabProps {
  formData: FollowUpAnswers;
  updateFormData: (data: Partial<FollowUpAnswers>) => void;
  baseValue: number;
}

export const FeaturesTab: React.FC<FeaturesTabProps> = ({
  formData,
  updateFormData,
  baseValue,
}) => {
  const [activeCategory, setActiveCategory] = useState(FEATURE_CATEGORIES[0]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFeatureToggle = (featureName: string) => {
    const features = formData.features || [];
    const updated = features.includes(featureName)
      ? features.filter((f) => f !== featureName)
      : [...features, featureName];

    updateFormData({ features: updated });
  };

  const scrollToCategory = (category: string) => {
    const section = document.getElementById(`feature-${category}`);
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveCategory(category);
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
      {/* Pill Selector */}
      <div className="flex overflow-x-auto gap-2 pb-4 sticky top-0 z-10 bg-white">
        {FEATURE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => scrollToCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all duration-150 ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feature Sections */}
      <div ref={containerRef} className="space-y-8">
        {FEATURE_CATEGORIES.map((category) => {
          const features: EnhancedFeature[] = ENHANCED_FEATURES[category] || [];

          return (
            <div key={category} id={`feature-${category}`}>
              <h3 className="text-xl font-semibold mb-4">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Total Summary */}
      <div className="sticky bottom-0 bg-white border-t pt-4 pb-6 mt-6">
        <div className="flex items-center justify-between px-4">
          <div className="text-sm text-gray-600">
            {selectedFeatures.size > 0
              ? `You've selected ${selectedFeatures.size} feature${selectedFeatures.size > 1 ? 's' : ''}`
              : 'No features selected yet'}
          </div>
          {totalValue > 0 && (
            <div className="text-green-700 font-semibold text-sm">
              +${totalValue.toLocaleString()} estimated value added
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
