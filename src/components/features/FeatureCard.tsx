
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EnhancedFeature } from '@/data/enhanced-features-database';

interface FeatureCardProps {
  feature: EnhancedFeature;
  isSelected: boolean;
  onToggle: (name: string) => void;
  valueImpact: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  isSelected,
  onToggle,
  valueImpact,
}) => {
  const handleClick = () => {
    onToggle(feature.name);
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 rounded-xl border shadow-sm cursor-pointer transition-all duration-200
        ${
          isSelected
            ? 'bg-gradient-to-br from-green-100 to-emerald-200 border-green-500'
            : 'bg-white hover:bg-gray-50 border-gray-200'
        }
      `}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-semibold">{feature.name}</h4>
        {isSelected && (
          <span className="text-green-700 text-sm font-bold">+${valueImpact}</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center text-xs">
        <Badge 
          variant="outline" 
          title={`Impact: ${feature.impact}. Affects price by importance.`}
        >
          {feature.impact}
        </Badge>
        <Badge 
          variant="secondary" 
          title={`Rarity: ${feature.rarity}. More rare = more value.`}
        >
          {feature.rarity}
        </Badge>
        {!isSelected && valueImpact > 0 && (
          <Badge className="ml-auto bg-green-50 text-green-700 font-medium border border-green-300">
            +${valueImpact}
          </Badge>
        )}
      </div>
    </div>
  );
};
