
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Minus } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface ValueShowcaseProps {
  estimatedValue: number;
  priceRange?: {
    min: number;
    max: number;
  };
  confidenceScore: number;
}

export const ValueShowcase: React.FC<ValueShowcaseProps> = ({
  estimatedValue,
  priceRange,
  confidenceScore
}) => {
  const getConfidenceLabel = (score: number) => {
    if (score >= 85) return 'High Confidence';
    if (score >= 70) return 'Good Confidence';
    return 'Moderate Confidence';
  };

  const getConfidenceDescription = (score: number) => {
    if (score >= 85) return 'Excellent data quality with comprehensive market insights';
    if (score >= 70) return 'Good data quality with solid market insights';
    return 'Moderate data quality - consider additional verification';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estimated Market Value</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Value Display */}
        <div className="text-center">
          <p className="text-4xl font-bold text-primary mb-2">
            {formatCurrency(estimatedValue)}
          </p>
          
          {priceRange && (
            <p className="text-muted-foreground">
              Range: {formatCurrency(priceRange.min)} - {formatCurrency(priceRange.max)}
            </p>
          )}
        </div>

        {/* Confidence Meter */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{getConfidenceLabel(confidenceScore)}</span>
            <span className="text-sm font-bold">{confidenceScore}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                confidenceScore >= 85 ? 'bg-green-500' : 
                confidenceScore >= 70 ? 'bg-blue-500' : 
                'bg-amber-500'
              }`}
              style={{ width: `${confidenceScore}%` }}
            />
          </div>
          
          <p className="text-xs text-muted-foreground">
            {getConfidenceDescription(confidenceScore)}
          </p>
        </div>

        {/* Market Indicators */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Strong Market</p>
          </div>
          <div className="text-center">
            <Minus className="h-5 w-5 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Stable Demand</p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Good Liquidity</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
