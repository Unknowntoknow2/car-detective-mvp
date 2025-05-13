import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { AIConditionAssessment } from './AIConditionAssessment';
import { ConditionTips } from './condition/ConditionTips';
import { useAICondition } from '@/hooks/useAICondition';
import { getConditionValueImpact, getConditionTips } from '@/utils/valuation/conditionHelpers';

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
  valuationId?: string;
}

export function ValuationResults({
  estimatedValue,
  confidenceScore,
  basePrice,
  adjustments = [],
  priceRange = [0, 0],
  demandFactor = 1,
  vehicleInfo,
  valuationId
}: ValuationResultsProps) {
  // Use AI condition hook if we have a valuation ID
  const { conditionData, isLoading } = useAICondition(valuationId);
  
  // Generate condition tips based on vehicle condition
  const conditionTipText = vehicleInfo.condition ? getConditionTips(vehicleInfo.condition) : '';
  
  // Calculate adjusted price range if not provided
  const calculatedPriceRange: [number, number] = priceRange[0] === 0 ? 
    [
      Math.round(estimatedValue * 0.95),
      Math.round(estimatedValue * 1.05)
    ] : priceRange;
  
  // Create mock selected ratings for ConditionTips if not available from adjustments
  const selectedRatings = {
    condition: {
      category: 'Overall Condition',
      tip: conditionTipText,
      value: vehicleInfo.condition || 'Good'
    }
  };
  
  // Add condition adjustment if not already in the adjustments array
  if (vehicleInfo.condition && !adjustments.some(adj => adj.factor === 'Condition')) {
    const conditionImpact = getConditionValueImpact(vehicleInfo.condition);
    adjustments.push({
      factor: 'Condition',
      impact: conditionImpact,
      description: `${vehicleInfo.condition} condition`
    });
  }
  
  // Update the condition options to match ConditionRatingOption interface
  const CONDITIONS: Record<string, ConditionRatingOption> = {
    condition: {
      id: 'condition',
      name: 'Condition',
      category: 'Vehicle Condition',
      tip: 'Vehicle condition significantly impacts value',
      value: 'Good'
    }
  };
  
  return (
    <div className="space-y-6">
      {/* AI Condition Assessment */}
      {valuationId && (
        <AIConditionAssessment 
          conditionData={conditionData}
          isLoading={isLoading}
          bestPhotoUrl={conditionData?.photoUrl}
        />
      )}
      
      {/* Valuation Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Valuation Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Estimated Value</h3>
              <p className="text-3xl font-bold text-primary">${estimatedValue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                Price range: ${calculatedPriceRange[0].toLocaleString()} - ${calculatedPriceRange[1].toLocaleString()}
              </p>
            </div>
            
            {basePrice && (
              <div>
                <h3 className="text-sm font-medium">Base Price</h3>
                <p className="text-lg font-semibold">${basePrice.toLocaleString()}</p>
              </div>
            )}
            
            {adjustments.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Value Adjustments</h3>
                <ul className="space-y-2">
                  {adjustments.map((adj, index) => (
                    <li key={index} className="flex justify-between text-sm border-b pb-2">
                      <div>
                        <span className="font-medium">{adj.factor}</span>
                        <p className="text-xs text-muted-foreground">{adj.description}</p>
                      </div>
                      <span className={adj.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {adj.impact > 0 ? '+' : ''}{typeof adj.impact === 'number' && !isNaN(adj.impact) ? 
                          (isNaN(parseInt(adj.impact.toString())) ? adj.impact : formatCurrency(adj.impact)) : 
                          adj.impact}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium flex items-center gap-2">
                Confidence Score
                <span className="bg-primary-light px-2 py-0.5 rounded-full text-xs font-normal">
                  {confidenceScore}%
                </span>
              </h3>
              <div className="mt-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${confidenceScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Condition Tips */}
      <ConditionTips selectedRatings={selectedRatings} />
    </div>
  );
}
