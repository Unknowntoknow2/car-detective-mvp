
import React from 'react';
import { FormData } from '@/types/premium-valuation';
import { ValuationResult } from '@/types/valuation';
import { formatCurrency } from '@/utils/formatters';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ValuationResultStepProps {
  formData: FormData;
  valuation?: ValuationResult;
  onNext: () => void;
  onPrevious: () => void;
}

export const ValuationResultStep: React.FC<ValuationResultStepProps> = ({
  formData,
  valuation,
  onNext,
  onPrevious
}) => {
  if (!valuation) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Generating Your Valuation...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Handle price range safely with proper typing
  const getPriceRange = (): { min: number; max: number } | null => {
    if (valuation.price_range && typeof valuation.price_range === 'object') {
      if ('low' in valuation.price_range && 'high' in valuation.price_range) {
        const range = valuation.price_range as { low: number; high: number; min?: number; max?: number };
        return {
          min: range.min ?? range.low,
          max: range.max ?? range.high
        };
      }
      if ('min' in valuation.price_range && 'max' in valuation.price_range) {
        const range = valuation.price_range as { min: number; max: number };
        return {
          min: range.min,
          max: range.max
        };
      }
    }
    
    if (valuation.priceRange && Array.isArray(valuation.priceRange) && valuation.priceRange.length >= 2) {
      return {
        min: valuation.priceRange[0],
        max: valuation.priceRange[1]
      };
    }
    
    return null;
  };

  const priceRange = getPriceRange();
  const estimatedValue = valuation.estimatedValue || valuation.estimated_value || 0;
  const confidenceScore = valuation.confidenceScore || valuation.confidence_score || 0;

  const mockAdjustments = [
    { factor: 'Condition', impact: 1000, description: 'Good condition adjustment' },
    { factor: 'Mileage', impact: -500, description: 'High mileage adjustment' },
    { factor: 'Features', impact: 800, description: 'Feature value adjustment' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Your Vehicle Valuation</h2>
        <p className="text-gray-600">Based on current market data and vehicle condition</p>
      </div>

      <Card className="p-6">
        <div className="text-center space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Estimated Value</p>
            <p className="text-4xl font-bold text-green-600">
              {formatCurrency(estimatedValue)}
            </p>
          </div>

          {priceRange && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Price Range</p>
              <p className="text-lg">
                {formatCurrency(priceRange.min)} - {formatCurrency(priceRange.max)}
              </p>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500 mb-1">Confidence Score</p>
            <Badge variant={confidenceScore >= 80 ? 'default' : 'secondary'}>
              {confidenceScore}% Confident
            </Badge>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Valuation Breakdown</h3>
        <div className="space-y-3">
          {mockAdjustments.map((adjustment, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-gray-700">{adjustment.factor}</span>
              <span className={`font-medium ${adjustment.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {adjustment.impact >= 0 ? '+' : ''}{formatCurrency(adjustment.impact)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-between">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Download Report
        </button>
      </div>
    </div>
  );
};
