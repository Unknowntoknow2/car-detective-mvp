
import { PremiumFeature } from "./data/premium-features";
import { PremiumFeatureCard } from "./PremiumFeatureCard";

interface PremiumFeaturesGridProps {
  features: PremiumFeature[];
  selectedFeature: string;
  onSelectFeature: (id: string) => void;
}

export function PremiumFeaturesGrid({ 
  features, 
  selectedFeature, 
  onSelectFeature 
}: PremiumFeaturesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature) => (
        <PremiumFeatureCard
          key={feature.id}
          {...feature}
          isSelected={selectedFeature === feature.id}
          onSelect={() => onSelectFeature(feature.id)}
        />
      ))}
    </div>
  );
}
