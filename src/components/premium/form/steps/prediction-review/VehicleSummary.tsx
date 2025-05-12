
import React from 'react';
import { FormData } from '@/types/premium-valuation';

interface VehicleSummaryProps {
  formData: FormData;
  aiConditionUsed?: boolean;
}

export function VehicleSummary({ formData, aiConditionUsed }: VehicleSummaryProps) {
  // Convert hasAccident to a consistent string format for display
  const hasAccidentDisplay = typeof formData.hasAccident === 'boolean'
    ? formData.hasAccident ? 'Yes' : 'No'
    : formData.hasAccident === 'yes' ? 'Yes' : 'No';

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-md font-medium mb-2">Vehicle Information</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-gray-500 block">Year, Make, Model</span>
          <span className="font-medium">{formData.year} {formData.make} {formData.model}</span>
        </div>
        {formData.trim && (
          <div>
            <span className="text-gray-500 block">Trim</span>
            <span className="font-medium">{formData.trim}</span>
          </div>
        )}
        <div>
          <span className="text-gray-500 block">Mileage</span>
          <span className="font-medium">{formData.mileage?.toLocaleString() || 'N/A'} miles</span>
        </div>
        <div>
          <span className="text-gray-500 block">Condition</span>
          <span className="font-medium">
            {formData.conditionLabel}
            {aiConditionUsed && (
              <span className="ml-1 text-xs text-blue-600 bg-blue-50 px-1 py-0.5 rounded">
                AI Verified
              </span>
            )}
          </span>
        </div>
        <div>
          <span className="text-gray-500 block">Fuel Type</span>
          <span className="font-medium">{formData.fuelType || 'N/A'}</span>
        </div>
        <div>
          <span className="text-gray-500 block">ZIP Code</span>
          <span className="font-medium">{formData.zipCode || 'N/A'}</span>
        </div>
        {formData.exteriorColor && (
          <div>
            <span className="text-gray-500 block">Exterior Color</span>
            <span className="font-medium">{formData.exteriorColor}</span>
          </div>
        )}
        {formData.interiorColor && (
          <div>
            <span className="text-gray-500 block">Interior Color</span>
            <span className="font-medium">{formData.interiorColor}</span>
          </div>
        )}
        {(formData.bodyStyle || formData.bodyType) && (
          <div>
            <span className="text-gray-500 block">Body Style</span>
            <span className="font-medium">{formData.bodyStyle || formData.bodyType}</span>
          </div>
        )}
        <div>
          <span className="text-gray-500 block">Accident History</span>
          <span className="font-medium">{hasAccidentDisplay}</span>
        </div>
        {formData.features && formData.features.length > 0 && (
          <div className="col-span-2">
            <span className="text-gray-500 block">Features</span>
            <span className="font-medium">{formData.features.length} premium features selected</span>
          </div>
        )}
      </div>
    </div>
  );
}
