
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleCheck, CircleAlert } from 'lucide-react';

export interface ValuationHeaderProps {
  vehicleInfo?: {
    make?: string;
    model?: string;
    year?: number;
    mileage?: number;
    condition?: string;
  };
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  estimatedValue: number;
  confidenceScore?: number;
  displayMode?: 'card' | 'inline';
  isPremium?: boolean;
  additionalInfo?: Record<string, string>;
}

export function ValuationHeader({
  vehicleInfo,
  make: propMake,
  model: propModel,
  year: propYear,
  mileage: propMileage,
  condition: propCondition,
  estimatedValue,
  confidenceScore = 75,
  displayMode = 'card',
  isPremium = false,
  additionalInfo = {}
}: ValuationHeaderProps) {
  // Use either vehicleInfo object or individual props
  const make = vehicleInfo?.make || propMake;
  const model = vehicleInfo?.model || propModel;
  const year = vehicleInfo?.year || propYear;
  const mileage = vehicleInfo?.mileage || propMileage;
  const condition = vehicleInfo?.condition || propCondition;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value?: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 90) return 'Very High';
    if (score >= 80) return 'High';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Moderate';
    return 'Low';
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-emerald-100 text-emerald-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  const content = (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold">
            {year} {make} {model}
          </h2>
          <div className="text-sm text-muted-foreground space-x-2">
            {mileage && <span>{formatNumber(mileage)} miles</span>}
            {condition && <span>• {condition} condition</span>}
            
            {/* Show additional vehicle details if available */}
            {Object.entries(additionalInfo).map(([key, value]) => (
              <span key={key}>• {value}</span>
            ))}
            
            {isPremium && (
              <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-800 border-yellow-300">
                Premium
              </Badge>
            )}
          </div>
        </div>
        
        <Badge
          className={`${getConfidenceColor(confidenceScore)} px-2 py-1 text-xs flex items-center gap-1`}
        >
          {confidenceScore >= 70 ? (
            <CircleCheck className="h-3 w-3" />
          ) : (
            <CircleAlert className="h-3 w-3" />
          )}
          {getConfidenceLabel(confidenceScore)} Confidence
        </Badge>
      </div>

      <div className="border-t pt-3">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-muted-foreground">Estimated Value</p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(estimatedValue)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Based on current market data</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (displayMode === 'card') {
    return (
      <Card>
        <CardContent className="p-6">{content}</CardContent>
      </Card>
    );
  }

  return content;
}
