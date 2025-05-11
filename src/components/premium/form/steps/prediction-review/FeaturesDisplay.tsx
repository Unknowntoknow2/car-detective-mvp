
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface FeaturesDisplayProps {
  features: string[];
}

export function FeaturesDisplay({ features }: FeaturesDisplayProps) {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Selected Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
