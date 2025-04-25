
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  impact: number;
}

interface FeatureGridProps {
  features: string[];
  featureList: Feature[];
  onFeatureToggle: (featureId: string) => void;
}

export function FeatureGrid({ features, featureList, onFeatureToggle }: FeatureGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {featureList.map(feature => (
        <Card
          key={feature.id}
          onClick={() => onFeatureToggle(feature.id)}
          className={`
            group relative overflow-hidden transition-all duration-300
            hover:shadow-lg hover:scale-[1.02] cursor-pointer
            ${features.includes(feature.id) ? 'border-primary/50 bg-primary/5' : 'border-border/50'}
          `}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {features.includes(feature.id) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
                <span className="font-medium">{feature.name}</span>
              </div>
              <Badge 
                variant={features.includes(feature.id) ? "default" : "outline"}
                className="transition-colors"
              >
                +${feature.impact}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
