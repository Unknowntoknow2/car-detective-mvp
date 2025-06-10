
import React from "react";
import { FormData } from "@/types/premium-valuation";

interface VehicleSummaryProps {
  formData: FormData;
}

export function VehicleSummary({ formData }: VehicleSummaryProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-md font-medium mb-2">Vehicle Information</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-gray-500 block">Year, Make, Model</span>
          <span className="font-medium">
            {formData.year} {formData.make} {formData.model}
          </span>
        </div>
        <div>
          <span className="text-gray-500 block">Mileage</span>
          <span className="font-medium">
            {formData.mileage?.toLocaleString() || "N/A"} miles
          </span>
        </div>
        <div>
          <span className="text-gray-500 block">Condition</span>
          <span className="font-medium">{formData.condition}</span>
        </div>
        <div>
          <span className="text-gray-500 block">ZIP Code</span>
          <span className="font-medium">{formData.zipCode || "N/A"}</span>
        </div>
        {formData.vin && (
          <div className="col-span-2">
            <span className="text-gray-500 block">VIN</span>
            <span className="font-medium font-mono">{formData.vin}</span>
          </div>
        )}
      </div>
    </div>
  );
}
