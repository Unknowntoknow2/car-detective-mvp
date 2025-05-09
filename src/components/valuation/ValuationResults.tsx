
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/utils/formatters';

interface PriceAdjustment {
  factor: string;
  impact: number;
  description?: string;
}

interface VehicleInfo {
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  condition?: string;
}

interface ValuationResultsProps {
  estimatedValue: number;
  confidenceScore: number;
  basePrice?: number;
  adjustments?: PriceAdjustment[];
  priceRange?: [number, number];
  demandFactor?: number;
  vehicleInfo: VehicleInfo;
}

export function ValuationResults({
  estimatedValue,
  confidenceScore,
  basePrice,
  adjustments = [],
  priceRange,
  demandFactor,
  vehicleInfo
}: ValuationResultsProps) {
  // Format price range
  const formattedPriceRange = priceRange
    ? `${formatCurrency(priceRange[0])} - ${formatCurrency(priceRange[1])}`
    : `${formatCurrency(estimatedValue * 0.95)} - ${formatCurrency(estimatedValue * 1.05)}`;
  
  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader className="bg-primary-light/10 pb-3">
          <CardTitle className="text-xl text-primary">Estimated Value</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <span className="text-4xl font-bold">{formatCurrency(estimatedValue)}</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Confidence Score</span>
                <span className="font-medium">{confidenceScore}%</span>
              </div>
              <Progress value={confidenceScore} className="h-2" />
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Market Value Range:</p>
              <p className="font-medium text-base text-foreground">{formattedPriceRange}</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Make:</p>
                <p className="font-medium">{vehicleInfo.make}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Model:</p>
                <p className="font-medium">{vehicleInfo.model}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Year:</p>
                <p className="font-medium">{vehicleInfo.year}</p>
              </div>
              {vehicleInfo.mileage && (
                <div>
                  <p className="text-muted-foreground">Mileage:</p>
                  <p className="font-medium">{vehicleInfo.mileage.toLocaleString()} miles</p>
                </div>
              )}
              {vehicleInfo.condition && (
                <div>
                  <p className="text-muted-foreground">Condition:</p>
                  <p className="font-medium capitalize">{vehicleInfo.condition}</p>
                </div>
              )}
              {vehicleInfo.trim && (
                <div>
                  <p className="text-muted-foreground">Trim:</p>
                  <p className="font-medium">{vehicleInfo.trim}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {(adjustments && adjustments.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Value Adjustments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {basePrice && (
                <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="font-medium">Base Market Value</span>
                  <span>{formatCurrency(basePrice)}</span>
                </li>
              )}
              
              {adjustments.map((adjustment, index) => (
                <li key={index} className="flex justify-between items-start text-sm">
                  <div>
                    <p className="font-medium">{adjustment.factor}</p>
                    {adjustment.description && (
                      <p className="text-muted-foreground text-xs mt-0.5">{adjustment.description}</p>
                    )}
                  </div>
                  <span className={`font-medium ${adjustment.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {adjustment.impact >= 0 ? '+' : ''}{formatCurrency(adjustment.impact)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ValuationResults;
