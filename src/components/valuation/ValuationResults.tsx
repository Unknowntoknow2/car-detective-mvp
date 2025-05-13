
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
  confidenceScore: number;
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
  onEmailReport: () => void | Promise<string>;
}

export const ValuationResults: React.FC<ValuationResultsProps> = ({
  estimatedValue,
  confidenceScore = 80,
  basePrice,
  priceRange,
  adjustments,
  demandFactor,
  vehicleInfo,
  onEmailReport
}) => {
  const { generatedCondition, isLoading } = useAICondition(vehicleInfo);

  const selectedRatings = useMemo<ConditionRatingOption[]>(() => {
    if (!generatedCondition) return [];
    
    return [
      {
        id: 'exterior',
        name: 'Exterior',
        category: 'exterior',
        value: generatedCondition.exterior || 3,
        description: 'Overall exterior condition including body, paint, and glass',
        tip: getConditionTips('exterior', generatedCondition.exterior || 3)
      }
    ];
  }, [generatedCondition]);

  const getConditionLabel = (score: number): string => {
    if (score >= 4.5) return 'Excellent';
    if (score >= 3.5) return 'Very Good';
    if (score >= 2.5) return 'Good';
    if (score >= 1.5) return 'Fair';
    return 'Poor';
  };

  const renderPriceRange = () => {
    if (!priceRange) return null;

    return (
      <div className="mt-6">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Value Range</h4>
        <div className="flex items-center justify-between text-sm mb-1">
          <span>{formatCurrency(priceRange[0])}</span>
          <span>{formatCurrency(priceRange[1])}</span>
        </div>
        <Progress value={confidenceScore} className="h-2" />
        <div className="flex justify-center mt-1">
          <span className="text-xs text-muted-foreground">
            {getConditionLabel(confidenceScore / 20)} confidence
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-blue-800 mb-1">Estimated Value</h3>
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-blue-700">
            {formatCurrency(estimatedValue)}
          </span>
          <span className="ml-2 text-sm text-blue-600">
            {getConditionLabel(confidenceScore / 20)} confidence
          </span>
        </div>
        {renderPriceRange()}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Year:</span>
              <span>{vehicleInfo.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Make:</span>
              <span>{vehicleInfo.make}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Model:</span>
              <span>{vehicleInfo.model}</span>
            </div>
            {vehicleInfo.trim && (
              <div className="flex justify-between">
                <span className="font-medium">Trim:</span>
                <span>{vehicleInfo.trim}</span>
              </div>
            )}
            {vehicleInfo.mileage && (
              <div className="flex justify-between">
                <span className="font-medium">Mileage:</span>
                <span>{vehicleInfo.mileage.toLocaleString()} miles</span>
              </div>
            )}
            {vehicleInfo.condition && (
              <div className="flex justify-between">
                <span className="font-medium">Condition:</span>
                <span>{vehicleInfo.condition}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {adjustments && adjustments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Valuation Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adjustments.map((adjustment, index) => (
                <div key={index} className="flex justify-between">
                  <span className="font-medium">{adjustment.factor}:</span>
                  <span className={adjustment.impact > 0 ? 'text-green-600' : 'text-red-600'}>
                    {adjustment.impact > 0 ? '+' : ''}{formatCurrency(adjustment.impact)}
                  </span>
                </div>
              ))}
              {basePrice && (
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-medium">Base Value:</span>
                  <span>{formatCurrency(basePrice)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {generatedCondition && selectedRatings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Condition Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedRatings.map((rating) => (
                <div key={rating.id} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{rating.name}:</span>
                    <span>{getConditionLabel(rating.value)}</span>
                  </div>
                  <ConditionTips category={rating.category} tip={rating.tip || ''} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={() => onEmailReport()}
          className="font-medium"
        >
          Email Full Report
        </Button>
      </div>
    </div>
  );
};
