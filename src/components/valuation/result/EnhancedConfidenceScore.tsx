import React from 'react';
import { Badge } from '@/components/ui/badge';

interface EnhancedConfidenceScoreProps {
  confidenceScore: number;
  confidenceBreakdown?: {
    vinAccuracy: number;
    marketData: number;
    fuelCostMatch: number;
    msrpQuality: number;
    overall: number;
    recommendations: string[];
  };
}

export function EnhancedConfidenceScore({ confidenceScore, confidenceBreakdown }: EnhancedConfidenceScoreProps) {
  const getConfidenceColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getConfidenceLabel = (score: number) => {
    if (score >= 85) return 'High';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Low';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2">
        <span className={`text-2xl font-bold ${getConfidenceColor(confidenceScore)}`}>
          {confidenceScore}%
        </span>
        <Badge variant={confidenceScore >= 70 ? 'default' : 'secondary'}>
          {getConfidenceLabel(confidenceScore)} Confidence
        </Badge>
      </div>
      
      {confidenceBreakdown && (
        <div className="text-sm text-muted-foreground space-y-1">
          {confidenceBreakdown.recommendations.slice(0, 2).map((rec, index) => (
            <div key={index} className="text-center">• {rec}</div>
          ))}
        </div>
      )}
    </div>
  );
}