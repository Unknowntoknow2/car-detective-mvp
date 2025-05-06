
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { PremiumBadge } from '@/components/ui/premium-badge';

interface Adjustment {
  factor: string;
  impact: number;
  description: string;
}

interface ValuationResultsProps {
  estimatedValue: number;
  confidenceScore: number;
  basePrice?: number;
  adjustments?: Adjustment[];
  priceRange?: [number, number];
  demandFactor?: number;
  aiVerified?: boolean;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
  isPremium?: boolean;
}

export function ValuationResults({
  estimatedValue,
  confidenceScore,
  basePrice,
  adjustments,
  priceRange,
  demandFactor,
  aiVerified = false,
  aiCondition,
  isPremium = false
}: ValuationResultsProps) {
  
  // Formatting helpers
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="bg-primary-light/10 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-base md:text-lg">
              Valuation Report
            </CardTitle>
          </div>
          
          {isPremium && (
            <PremiumBadge 
              variant="gold" 
              size="sm"
              className="border border-amber-300"
            >
              Premium Report
            </PremiumBadge>
          )}
        </div>
        
        <CardDescription className="text-xs md:text-sm">
          {aiVerified ? 'AI-verified assessment' : 'Based on your vehicle details'}
          {aiCondition && aiCondition.confidenceScore >= 80 && (
            <span className="ml-2 text-green-600 font-medium"> • AI Verified: {aiCondition.condition}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-2">Estimated Value</p>
          <p className="text-3xl md:text-4xl font-bold text-primary">
            {formatCurrency(estimatedValue)}
          </p>
          <div className="flex items-center justify-center mt-2">
            <div className="px-3 py-1 text-xs font-medium bg-primary-light/20 text-primary rounded-full">
              {confidenceScore}% Confidence
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {basePrice && (
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="font-medium">Base Price</p>
              <p className="text-lg">{formatCurrency(basePrice)}</p>
            </div>
          )}
          {adjustments && adjustments.length > 0 && (
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="font-medium">Adjustments</p>
              <ul className="text-sm mt-1 space-y-1">
                {adjustments.slice(0, 3).map((adj, i) => (
                  <li key={i} className="flex justify-between">
                    <span className="line-clamp-1">{adj.factor}</span>
                    <span className={adj.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {adj.impact > 0 ? '+' : ''}{adj.impact}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {demandFactor && (
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="font-medium">Market Adjustment</p>
              <p className="text-lg">
                {demandFactor !== 1 
                  ? ((demandFactor - 1) * 100).toFixed(1) + '%' 
                  : '0%'}
              </p>
            </div>
          )}
        </div>

        {priceRange && (
          <div className="mt-4 p-4 bg-primary/5 rounded-lg">
            <p className="font-medium">Price Range</p>
            <p className="text-base md:text-lg">{formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}</p>
          </div>
        )}
        
        {isPremium && aiCondition && (
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="font-medium text-amber-800 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-amber-600" />
              Premium AI Analysis
            </p>
            <p className="text-sm text-amber-700 mt-1">
              {aiCondition.aiSummary || `This vehicle is in ${aiCondition.condition} condition with a ${aiCondition.confidenceScore}% confidence score.`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
