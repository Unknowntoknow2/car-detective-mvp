
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface Feature {
  id: string;
  name: string;
  impact: number;
}

interface FeatureGridProps {
  features: string[];
  featureList: Feature[];
  onFeatureToggle: (id: string) => void;
}

export function FeatureGrid({ features, featureList, onFeatureToggle }: FeatureGridProps) {
  // Group features by category
  const featureCategories = {
    "Comfort": featureList.filter(f => ["heated", "vent"].includes(f.id)),
    "Convenience": featureList.filter(f => ["power", "remote", "wireless"].includes(f.id)),
    "Entertainment": featureList.filter(f => ["nav", "audio"].includes(f.id)),
    "Interior": featureList.filter(f => ["leather", "sunroof"].includes(f.id)),
    "Performance": featureList.filter(f => ["awd", "sport"].includes(f.id)),
    "Safety": featureList.filter(f => ["camera", "cruise", "blind", "lane"].includes(f.id))
  };
  
  return (
    <div className="space-y-6">
      {Object.entries(featureCategories).map(([category, categoryFeatures]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {categoryFeatures.map((feature) => (
              <Card 
                key={feature.id}
                className={`p-3 cursor-pointer transition-all ${
                  features.includes(feature.id) 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => onFeatureToggle(feature.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{feature.name}</p>
                    <Badge variant="outline" className="mt-1 bg-background">
                      +${feature.impact}
                    </Badge>
                  </div>
                  {features.includes(feature.id) && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
