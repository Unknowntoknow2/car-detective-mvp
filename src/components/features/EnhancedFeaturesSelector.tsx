
import React from 'react';
import { ENHANCED_FEATURES, FEATURE_CATEGORIES, EnhancedFeature } from '@/data/enhanced-features-database';
import { Badge } from '@/components/ui/badge';

interface EnhancedFeaturesSelectorProps {
  selectedFeatures: string[];
  onToggle: (feature: string) => void;
  baseValue: number;
}

export const EnhancedFeaturesSelector: React.FC<EnhancedFeaturesSelectorProps> = ({
  selectedFeatures,
  onToggle,
  baseValue,
}) => {
  return (
    <div className="space-y-8">
      {FEATURE_CATEGORIES.map((category) => {
        const features: EnhancedFeature[] = ENHANCED_FEATURES[category] ?? [];

        return (
          <div key={category}>
            <h3 className="text-xl font-semibold mb-4">{category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature) => {
                const isSelected = selectedFeatures.includes(feature.name);
                const valueImpact = Math.round(
                  baseValue * (feature.percentage || 0) + (feature.fixed || 0)
                );

                return (
                  <div
                    key={feature.name}
                    onClick={() => onToggle(feature.name)}
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
  );
};
