
import React from "react";
import { FormData } from "@/types/premium-valuation";

interface VehicleDetailsSummaryProps {
  formData: FormData;
}

export function VehicleDetailsSummary({ formData }: VehicleDetailsSummaryProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-md font-medium mb-2">Vehicle Details</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        {formData.transmission && (
          <div>
            <span className="text-gray-500 block">Transmission</span>
            <span className="font-medium capitalize">{formData.transmission}</span>
          </div>
        )}
        {formData.fuelType && (
          <div>
            <span className="text-gray-500 block">Fuel Type</span>
            <span className="font-medium capitalize">{formData.fuelType}</span>
          </div>
        )}
        {formData.bodyStyle && (
          <div>
            <span className="text-gray-500 block">Body Style</span>
            <span className="font-medium">{formData.bodyStyle}</span>
          </div>
        )}
        {formData.color && (
          <div>
            <span className="text-gray-500 block">Color</span>
            <span className="font-medium">{formData.color}</span>
          </div>
        )}
        {formData.trim && (
          <div>
            <span className="text-gray-500 block">Trim</span>
            <span className="font-medium">{formData.trim}</span>
          </div>
        )}
      </div>
    </div>
  );
}
