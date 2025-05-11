
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormData } from '@/types/premium-valuation';

interface VehicleSummaryCardProps {
  formData: FormData;
}

export function VehicleSummaryCard({ formData }: VehicleSummaryCardProps) {
  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Vehicle Information</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium">Make & Model</p>
              <p className="text-sm text-muted-foreground">
                {formData.make} {formData.model}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Year</p>
              <p className="text-sm text-muted-foreground">{formData.year}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium">Mileage</p>
              <p className="text-sm text-muted-foreground">
                {typeof formData.mileage === 'number' 
                  ? formData.mileage.toLocaleString() 
                  : formData.mileage} miles
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Condition</p>
              <p className="text-sm text-muted-foreground">
                {formData.conditionLabel || 'Average'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm font-medium">ZIP Code</p>
              <p className="text-sm text-muted-foreground">{formData.zipCode}</p>
            </div>
            {formData.fuelType && (
              <div>
                <p className="text-sm font-medium">Fuel Type</p>
                <p className="text-sm text-muted-foreground">{formData.fuelType}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
