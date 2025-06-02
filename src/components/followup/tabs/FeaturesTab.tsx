
import React, { useState, useRef } from 'react';
import { EnhancedFeature, FEATURE_CATEGORIES, ENHANCED_FEATURES } from '@/data/enhanced-features-database';
import { Badge } from '@/components/ui/badge';
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
                    <div
                      key={feature.name}
                      onClick={() => handleFeatureToggle(feature.name)}
                      className={`p-4 rounded-xl border shadow-sm cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-gradient-to-br from-indigo-100 to-purple-100 border-purple-400'
                          : 'bg-white hover:bg-gray-100 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{feature.name}</span>
                        {isSelected && (
                          <span className="text-green-600 font-semibold">
                            +${valueImpact}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{feature.impact}</Badge>
                        <Badge variant="secondary">{feature.rarity}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
