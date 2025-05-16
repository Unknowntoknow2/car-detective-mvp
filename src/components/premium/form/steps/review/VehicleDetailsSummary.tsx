
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormData } from '@/types/premium-valuation';

interface VehicleDetailsSummaryProps {
  formData: FormData;
}

export function VehicleDetailsSummary({ formData }: VehicleDetailsSummaryProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Vehicle Details</h3>
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="grid gap-4">
            {formData.bodyType && (
              <div className="flex justify-between items-start py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Body Type:</span>
                <span className="text-right font-medium text-gray-800">{formData.bodyType}</span>
              </div>
            )}
            {formData.exteriorColor && (
              <div className="flex justify-between items-start py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Exterior Color:</span>
                <span className="text-right font-medium text-gray-800">{formData.exteriorColor}</span>
              </div>
            )}
            {formData.interiorColor && (
              <div className="flex justify-between items-start py-3 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Interior Color:</span>
                <span className="text-right font-medium text-gray-800">{formData.interiorColor}</span>
              </div>
            )}
            {formData.transmission && (
              <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-0">
                <span className="text-gray-600 font-medium">Transmission:</span>
                <span className="text-right font-medium text-gray-800">{formData.transmission}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
