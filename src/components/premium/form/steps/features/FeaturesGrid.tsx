
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Feature {
  id: string;
  name: string;
  category: string;
  value?: number;
  selected?: boolean;
}

interface FeaturesGridProps {
  features: Feature[];
  onFeatureToggle: (featureId: string) => void;
}

export function FeaturesGrid({ features, onFeatureToggle }: FeaturesGridProps) {
  const groupedFeatures = features.reduce((groups, feature) => {
    const category = feature.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(feature);
    return groups;
  }, {} as Record<string, Feature[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categoryFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    feature.selected
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onFeatureToggle(feature.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{feature.name}</span>
                    {feature.value && (
                      <Badge variant="outline" className="text-xs">
                        +${feature.value}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
