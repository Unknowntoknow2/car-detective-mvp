
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAICondition } from '@/hooks/useAICondition';
import { ConditionTips } from './condition/ConditionTips';
import { formatCurrency } from '@/utils/formatters/formatCurrency';
import { Progress } from '@/components/ui/progress';
import { ConditionRatingOption } from './condition/types';
import { getConditionTips } from '@/utils/valuation/conditionHelpers';

interface ValuationResultsProps {
  estimatedValue: number;
  confidenceScore?: number;
  basePrice?: number;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  priceRange?: [number, number];
  demandFactor?: number;
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    mileage?: number;
    condition?: string;
  };
  valuationId?: string;
  onEmailReport?: () => void | Promise<void>;
  onDownloadPdf?: () => void | Promise<void>;
}

export const ValuationResults: React.FC<ValuationResultsProps> = ({
  estimatedValue,
  confidenceScore = 80,
  basePrice,
  priceRange,
  adjustments,
  demandFactor,
  vehicleInfo,
  onEmailReport,
  onDownloadPdf
}) => {
  const { conditionData } = useAICondition(vehicleInfo.trim || '');
  
  // Calculate price range if not provided
  const calculatedPriceRange = useMemo(() => {
    if (priceRange && Array.isArray(priceRange) && priceRange.length === 2) {
      return priceRange;
    }
    
    // Calculate range based on confidence score
    const margin = ((100 - (confidenceScore || 80)) / 100) * 0.2;
    const min = Math.floor(estimatedValue * (1 - margin));
    const max = Math.ceil(estimatedValue * (1 + margin));
    return [min, max] as [number, number];
  }, [estimatedValue, confidenceScore, priceRange]);
  
  // Generate condition tip text
  const conditionTipText = useMemo(() => {
    if (vehicleInfo.condition) {
      return getConditionTips(vehicleInfo.condition);
    }
    return 'Vehicle appears to be in average condition based on age and mileage.';
  }, [vehicleInfo.condition]);
  
  // Create a condition rating object that matches the ConditionRatingOption type
  const conditionRating: ConditionRatingOption = {
    id: 'overall-condition',
    name: 'Overall Condition',
    category: 'Vehicle Condition',
    tip: conditionTipText,
    value: vehicleInfo.condition ? 
      (vehicleInfo.condition === 'Excellent' ? 90 :
       vehicleInfo.condition === 'Good' ? 75 :
       vehicleInfo.condition === 'Fair' ? 60 : 40) : 75 // Convert string condition to numeric value
  };
  
  // Create selectedRatings object that matches the Record<string, ConditionRatingOption> type
  const selectedRatings: Record<string, ConditionRatingOption> = {
    condition: conditionRating
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Value Estimate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="mb-4">
              <div className="text-3xl font-bold text-primary mb-1">
                {formatCurrency(estimatedValue)}
              </div>
              {priceRange && (
                <div className="text-sm text-muted-foreground">
                  Estimated value range: {formatCurrency(calculatedPriceRange[0])} - {formatCurrency(calculatedPriceRange[1])}
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Confidence Score</span>
                <span className="text-sm">{confidenceScore}%</span>
              </div>
              <Progress value={confidenceScore} />
            </div>
            
            {basePrice && (
              <div className="mb-3">
                <div className="text-sm text-muted-foreground flex justify-between">
                  <span>Base Value:</span>
                  <span>{formatCurrency(basePrice)}</span>
                </div>
              </div>
            )}
            
            {adjustments && adjustments.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium">Value Factors</h4>
                <ul className="space-y-1">
                  {adjustments.map((adjustment, index) => (
                    <li key={index} className="text-sm flex justify-between">
                      <span>{adjustment.factor}</span>
                      <span className={adjustment.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {adjustment.impact > 0 ? '+' : ''}{adjustment.impact}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <ConditionTips selectedRatings={selectedRatings} />
      
      {(onEmailReport || onDownloadPdf) && (
        <div className="flex space-x-2 mt-4">
          {onEmailReport && (
            <Button variant="outline" size="sm" onClick={onEmailReport} className="flex-1">
              Email Report
            </Button>
          )}
          {onDownloadPdf && (
            <Button variant="outline" size="sm" onClick={onDownloadPdf} className="flex-1">
              Download PDF
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
