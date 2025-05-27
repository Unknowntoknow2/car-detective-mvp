
import React from 'react';
import { FeatureOption } from '@/types/premium-valuation';
import { FeatureCard } from './FeatureCard';

interface FeaturesGridProps {
  features: FeatureOption[];
  selectedFeatures: string[];
  onFeatureToggle: (featureId: string) => void;
}

export const FeaturesGrid: React.FC<FeaturesGridProps> = ({
  features,
  selectedFeatures,
  onFeatureToggle
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map((feature) => (
        <FeatureCard
          key={feature.id}
          feature={feature}
          isSelected={selectedFeatures.includes(feature.id)}
          onToggle={onFeatureToggle}
        />
      ))}
    </div>
  );
};
