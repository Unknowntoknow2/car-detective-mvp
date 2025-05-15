
import React from 'react';
import { Check } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
}

interface FeaturesIncludedProps {
  features: Feature[];
}

const FeaturesIncluded: React.FC<FeaturesIncludedProps> = ({ features }) => {
  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-semibold">Premium Features Include:</h3>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="mt-1 bg-green-100 dark:bg-green-900/30 rounded-full p-0.5 text-green-600 dark:text-green-400">
              <Check className="h-4 w-4" />
            </span>
            <div>
              <h4 className="font-medium">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeaturesIncluded;
