
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { TrendingUp, TrendingDown, Minus, Award, AlertCircle } from 'lucide-react';

interface ValuationAdjustment {
  factor: string;
  impact: number;
  description?: string;
}

interface ValuationResultProps {
  data: {
    estimatedValue: number;
    confidenceScore: number;
    basePrice: number;
    adjustments: ValuationAdjustment[];
    make: string;
    model: string;
    year: number;
    condition: string;
  };
}

export function ValuationResult({ data }: ValuationResultProps) {
  const {
    estimatedValue,
    confidenceScore,
    basePrice,
    adjustments = [],
    make,
    model,
    year,
    condition
  } = data;

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, text: 'High Confidence' };
    if (score >= 60) return { variant: 'secondary' as const, text: 'Medium Confidence' };
    return { variant: 'destructive' as const, text: 'Low Confidence' };
  };

  const getTrendIcon = (impact: number) => {
    if (impact > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (impact < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const confidenceBadge = getConfidenceBadge(confidenceScore);

  return (
    <div className="space-y-6">
      {/* Main Valuation Display */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Estimated Market Value</CardTitle>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">
              {formatCurrency(estimatedValue)}
            </div>
            <div className="flex items-center justify-center gap-2">
              <Badge variant={confidenceBadge.variant}>
                {confidenceBadge.text}
              </Badge>
              <span className={`text-sm font-medium ${getConfidenceColor(confidenceScore)}`}>
                {confidenceScore}% Confidence
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              Based on real market data for {year} {make} {model} in {condition} condition
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Valuation Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Valuation Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Base Price */}
          <div className="flex justify-between items-center py-2 border-b">
            <span className="font-medium">Base Market Value</span>
            <span className="font-semibold">{formatCurrency(basePrice)}</span>
          </div>

          {/* Adjustments */}
          {adjustments.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Adjustments</h4>
              {adjustments.map((adjustment: ValuationAdjustment, index: number) => (
                <div key={index} className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(adjustment.impact)}
                    <span className="text-sm">{adjustment.factor}</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    adjustment.impact > 0 ? 'text-green-600' : 
                    adjustment.impact < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {adjustment.impact > 0 ? '+' : ''}{formatCurrency(adjustment.impact)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Final Value */}
          <div className="flex justify-between items-center py-2 border-t font-semibold text-lg">
            <span>Estimated Value</span>
            <span className="text-primary">{formatCurrency(estimatedValue)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Confidence Explanation */}
      {confidenceScore < 80 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-medium text-amber-800">Confidence Score Explanation</h4>
                <p className="text-sm text-amber-700">
                  {confidenceScore < 60 
                    ? "This valuation has lower confidence due to limited market data or unique vehicle characteristics. Consider getting additional professional appraisals."
                    : "This valuation has moderate confidence. The estimate is based on available market data but may benefit from additional verification."
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
