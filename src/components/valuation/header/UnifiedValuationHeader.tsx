
import React from 'react';
import { BadgeCheck, AlertCircle, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { VehicleInfoProps } from '../UnifiedValuationResult';
import { formatCurrency } from '@/utils/formatters';
import { getConditionColorClass } from '@/utils/valuation/conditionHelpers';

interface UnifiedValuationHeaderProps {
  vehicleInfo: VehicleInfoProps;
  estimatedValue: number;
  confidenceScore?: number;
  photoCondition?: any;
  isPremium?: boolean;
}

export function UnifiedValuationHeader({
  vehicleInfo,
  estimatedValue,
  confidenceScore = 75,
  photoCondition,
  isPremium = false
}: UnifiedValuationHeaderProps) {
  const { make, model, year, mileage, condition, trim } = vehicleInfo;
  
  // Determine condition display with badge color
  const conditionClass = getConditionColorClass(condition || 'Good');
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {year} {make} {model}
            {trim && <span className="ml-1 text-gray-500">{trim}</span>}
          </h1>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {condition && (
              <Badge variant="outline" className={conditionClass}>
                {condition} Condition
              </Badge>
            )}
            
            {mileage && (
              <Badge variant="outline">
                {mileage.toLocaleString()} miles
              </Badge>
            )}
            
            {photoCondition?.condition && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                <Camera className="h-3 w-3 mr-1" />
                AI Verified {photoCondition.condition}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="bg-primary/10 px-5 py-4 rounded-lg self-start">
          <div className="text-sm text-muted-foreground mb-1">Estimated Value</div>
          <div className="text-3xl font-bold text-primary">
            {formatCurrency(estimatedValue)}
          </div>
          
          {confidenceScore && (
            <div className="flex items-center mt-1 text-sm">
              {confidenceScore >= 75 ? (
                <BadgeCheck className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
              )}
              <span className={confidenceScore >= 75 ? 'text-green-700' : 'text-yellow-700'}>
                {confidenceScore}% Confidence
              </span>
            </div>
          )}
          
          {isPremium ? (
            <Badge className="mt-2 bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
              Premium
            </Badge>
          ) : (
            <Badge variant="outline" className="mt-2">
              Basic
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export default UnifiedValuationHeader;
