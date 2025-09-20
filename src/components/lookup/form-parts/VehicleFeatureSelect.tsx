import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VehicleFeatureSelectProps {
  availableFeatures: string[];
  selectedFeatures: string[];
  setSelectedFeatures: (features: string[]) => void;
}

export function VehicleFeatureSelect({
  availableFeatures,
  selectedFeatures,
  setSelectedFeatures,
}: VehicleFeatureSelectProps) {
  const handleFeatureToggle = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Vehicle Features</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {availableFeatures.map((feature) => (
            <div
              key={feature}
              className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/40 rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-pointer hover:bg-primary/20"
              onClick={() => handleFeatureToggle(feature)}
            >
              <span>{feature}</span>
              <button
                type="button"
                className="ml-1 text-xs hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFeatureToggle(feature);
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
