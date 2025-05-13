
import React from 'react';
import { formatCurrency } from '@/utils/formatters';
import { AIConditionBadge } from '@/components/valuation/AIConditionBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AICondition } from '@/types/photo';
import { getConditionColorClass } from '@/utils/valuation/conditionHelpers';

export interface VehicleInfoProps {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  trim?: string;
  vin?: string;
}

export interface UnifiedValuationHeaderProps {
  vehicleInfo: VehicleInfoProps;
  estimatedValue: number;
  confidenceScore?: number;
  photoCondition?: AICondition;
  isPremium?: boolean;
  additionalInfo?: Record<string, string>;
}

export function UnifiedValuationHeader({
  vehicleInfo,
  estimatedValue,
  confidenceScore = 75,
  photoCondition,
  isPremium = false,
  additionalInfo = {}
}: UnifiedValuationHeaderProps) {
  const { make, model, year, mileage, condition, trim, vin } = vehicleInfo;
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">
              {year} {make} {model} {trim}
            </CardTitle>
            <div className="flex flex-wrap items-center mt-2 gap-2">
              {condition && (
                <Badge className={`${getConditionColorClass(condition)}`}>
                  {condition} Condition
                </Badge>
              )}
              
              {photoCondition && (
                <AIConditionBadge 
                  condition={photoCondition.condition} 
                  confidenceScore={photoCondition.confidenceScore} 
                />
              )}
              
              {mileage && (
                <Badge variant="outline">
                  {mileage.toLocaleString()} miles
                </Badge>
              )}
              
              {Object.entries(additionalInfo).map(([key, value]) => (
                <Badge key={key} variant="outline" className="capitalize">
                  {key}: {value}
                </Badge>
              ))}
            </div>
            
            {vin && (
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                VIN: {vin}
              </p>
            )}
          </div>
          
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Estimated Value</p>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(estimatedValue)}
            </p>
            <p className="text-xs text-muted-foreground">
              {confidenceScore}% confidence
              {isPremium && <span className="ml-1 text-primary">• Premium</span>}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary"
            style={{ width: `${confidenceScore}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default UnifiedValuationHeader;
