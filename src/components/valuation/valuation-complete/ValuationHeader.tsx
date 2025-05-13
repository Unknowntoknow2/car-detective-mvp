
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { getConditionColorClass } from '@/utils/valuation/conditionHelpers';

interface VehicleInfoProps {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  trim?: string;
}

interface ValuationHeaderProps {
  vehicleInfo: VehicleInfoProps;
  estimatedValue: number;
  isPremium?: boolean;
  additionalInfo?: Record<string, string>;
}

export function ValuationHeader({
  vehicleInfo,
  estimatedValue,
  isPremium = false,
  additionalInfo = {}
}: ValuationHeaderProps) {
  const { make, model, year, mileage, condition, trim } = vehicleInfo;
  
  return (
    <Card className="shadow-sm bg-white">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div>
            <CardTitle className="text-2xl font-bold mb-2">
              {year} {make} {model} {trim || ''}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mb-4">
              {condition && (
                <Badge className={getConditionColorClass(condition)}>
                  {condition} Condition
                </Badge>
              )}
              
              {mileage !== undefined && (
                <Badge variant="outline">
                  {mileage.toLocaleString()} miles
                </Badge>
              )}
              
              {Object.entries(additionalInfo).map(([key, value]) => (
                <Badge key={key} variant="outline" className="capitalize">
                  {key}: {value}
                </Badge>
              ))}
              
              {isPremium && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Premium Report
                </Badge>
              )}
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 md:text-right">
            <p className="text-sm text-muted-foreground">Estimated Value</p>
            <p className="text-3xl font-bold text-primary mt-1">
              {formatCurrency(estimatedValue)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground">
            {isPremium 
              ? "Comprehensive valuation powered by our advanced algorithms and market data."
              : "Basic valuation based on vehicle information. Upgrade to Premium for a more detailed report."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
