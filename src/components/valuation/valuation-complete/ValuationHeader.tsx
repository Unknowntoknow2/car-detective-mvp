
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters/formatCurrency';
import { formatNumber } from '@/utils/formatters/formatNumber';
import { CarFront, Award } from 'lucide-react';

interface VehicleInfo {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
}

interface ValuationHeaderProps {
  vehicleInfo: VehicleInfo;
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
  const { make, model, year, mileage, condition } = vehicleInfo;
  
  return (
    <Card className="overflow-hidden">
      <div className={`p-6 ${isPremium ? 'bg-primary/10' : 'bg-muted/50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <CarFront className="mr-2 h-5 w-5" />
              {year} {make} {model}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {isPremium && (
                <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30">
                  <Award className="h-3 w-3 mr-1" /> Premium Valuation
                </Badge>
              )}
              {condition && (
                <Badge variant="outline">
                  Condition: {condition}
                </Badge>
              )}
              {mileage && (
                <Badge variant="outline">
                  {formatNumber(mileage)} miles
                </Badge>
              )}
              {Object.entries(additionalInfo).map(([key, value]) => (
                <Badge key={key} variant="outline">
                  {key}: {value}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Estimated Value</p>
          <h2 className="text-4xl font-bold text-primary">
            {formatCurrency(estimatedValue)}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Based on {isPremium ? 'premium' : 'standard'} evaluation
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
