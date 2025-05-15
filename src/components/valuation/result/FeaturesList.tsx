
import React from 'react';

interface FeaturesListProps {
  features: string[];
}

export const FeaturesList: React.FC<FeaturesListProps> = ({ features }) => {
  if (!features || features.length === 0) {
    return null;
  }
  
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-semibold text-lg mb-2">Vehicle Features</h3>
      <ul className="list-disc pl-5 space-y-1">
        {features.map((feature, index) => (
          <li key={index} className="text-sm">{feature}</li>
        ))}
      </ul>
    </div>
  );
};

export default FeaturesList;
