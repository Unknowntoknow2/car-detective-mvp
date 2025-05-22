
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriceComparisonChartProps {
  vehicleData: {
    make: string;
    model: string;
    year: number;
    zipCode: string;
  };
}

export function PriceComparisonChart({ vehicleData }: PriceComparisonChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Price Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60 flex items-center justify-center bg-gray-50 rounded-md">
          <p className="text-muted-foreground text-sm">
            Price comparison chart for {vehicleData.year} {vehicleData.make} {vehicleData.model} in {vehicleData.zipCode}
          </p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <p className="text-muted-foreground">Low Range</p>
            <p className="font-medium">$22,500</p>
          </div>
          <div>
            <p className="text-muted-foreground">Your Estimate</p>
            <p className="font-semibold text-primary">$24,750</p>
          </div>
          <div>
            <p className="text-muted-foreground">High Range</p>
            <p className="font-medium">$26,900</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
