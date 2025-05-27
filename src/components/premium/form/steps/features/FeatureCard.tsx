
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FeatureOption } from '@/types/premium-valuation';

interface FeatureCardProps {
  feature: FeatureOption;
  isSelected: boolean;
  onToggle: (featureId: string) => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  isSelected,
  onToggle
}) => {
  return (
    <Card className={`cursor-pointer transition-colors ${isSelected ? 'border-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggle(feature.id)}
          />
          <div className="flex-1">
            <h4 className="font-medium">{feature.name}</h4>
            {feature.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {feature.description}
              </p>
            )}
            <p className="text-sm font-medium text-green-600 mt-2">
              +${feature.valueImpact}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
