
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, Minus, TrendingUp } from 'lucide-react';

interface SummaryProps {
  confidenceScore: number;
  priceRange?: { min: number; max: number };
  marketTrend?: 'up' | 'down' | 'stable';
  recommendationText?: string;
}

export default function Summary({
  confidenceScore,
  priceRange,
  marketTrend = 'stable',
  recommendationText
}: SummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Valuation Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Confidence Score */}
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">Confidence Level</span>
            <div className="flex items-center">
              <span className="text-xl font-semibold">{confidenceScore}%</span>
              <Badge 
                className="ml-2" 
                variant={confidenceScore > 85 ? "default" : confidenceScore > 70 ? "outline" : "secondary"}
              >
                {confidenceScore > 85 ? "High" : confidenceScore > 70 ? "Medium" : "Low"}
              </Badge>
            </div>
          </div>
          
          {/* Price Range */}
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">Suggested Price Range</span>
            <div className="flex items-center">
              {priceRange ? (
                <span className="text-xl font-semibold">
                  {formatCurrency(priceRange.min)} - {formatCurrency(priceRange.max)}
                </span>
              ) : (
                <span className="text-xl font-semibold">Not Available</span>
              )}
            </div>
          </div>
          
          {/* Market Trend */}
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground mb-1">Market Trend</span>
            <div className="flex items-center">
              {marketTrend === 'up' && (
                <>
                  <ArrowUp className="mr-1 h-5 w-5 text-green-500" />
                  <span className="text-xl font-semibold text-green-600">Rising</span>
                </>
              )}
              {marketTrend === 'down' && (
                <>
                  <ArrowDown className="mr-1 h-5 w-5 text-red-500" />
                  <span className="text-xl font-semibold text-red-600">Falling</span>
                </>
              )}
              {marketTrend === 'stable' && (
                <>
                  <Minus className="mr-1 h-5 w-5 text-amber-500" />
                  <span className="text-xl font-semibold text-amber-600">Stable</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {recommendationText && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center mb-2">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              <span className="font-medium">Recommendation</span>
            </div>
            <p className="text-muted-foreground">{recommendationText}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
