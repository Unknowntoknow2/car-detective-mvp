
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FeaturesSelectorProps {
  selectedFeatures: string[];
  onFeatureToggle: (feature: string) => void;
}

const featureCategories = {
  Safety: ['ABS', 'Airbags', 'Backup Camera', 'Blind Spot Monitor'],
  Technology: ['Bluetooth', 'Navigation System', 'Premium Sound System', 'Remote Start'],
  Comfort: ['Leather Seats', 'Heated Seats', 'Sunroof', 'Keyless Entry'],
  Other: ['Alloy Wheels', 'Third-Row Seating', 'Four-Wheel Drive', 'Tow Package'],
};

export const FeaturesSelector: React.FC<FeaturesSelectorProps> = ({
  selectedFeatures,
  onFeatureToggle,
}) => {
  return (
    <div className="space-y-6">
      {Object.entries(featureCategories).map(([category, features]) => (
        <Card 
          key={category}
          className="p-4 space-y-4"
        >
          <CardHeader>
            <CardTitle>{category}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={feature}
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onFeatureToggle(feature);
                    } else {
                      onFeatureToggle(feature);
                    }
                  }}
                />
                <Label htmlFor={feature} className="cursor-pointer">
                  {feature}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
