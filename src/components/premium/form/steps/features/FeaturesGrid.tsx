
import { FeatureOption } from '@/types/premium-valuation';
import { FeatureCard } from './FeatureCard';

interface FeaturesGridProps {
  features: FeatureOption[];
  selectedFeatures: string[];
  onToggleFeature: (featureId: string) => void;
}

export function FeaturesGrid({ features, selectedFeatures, onToggleFeature }: FeaturesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {features.map(feature => (
        <FeatureCard
          key={feature.id}
          feature={feature}
          isSelected={selectedFeatures.includes(feature.id)}
          onToggle={onToggleFeature}
        />
      ))}
    </div>
  );
}
