
import React from "react";
import { FormData } from "@/types/premium-valuation";

interface FeaturesSummaryProps {
  formData: FormData;
}

export function FeaturesSummary({ formData }: FeaturesSummaryProps) {
  const features = formData.features || formData.selectedFeatures || [];
  
  if (!features || features.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-md font-medium mb-2">Vehicle Features</h3>
        <p className="text-sm text-gray-500">No additional features selected</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-md font-medium mb-2">Vehicle Features</h3>
      <p className="text-sm text-gray-600 mb-2">
        Selected {features.length} premium features:
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {features.map((feature: any, index: number) => (
          <div key={index} className="text-sm">
            <span className="font-medium">{typeof feature === 'string' ? feature : feature.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
