
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ConfidenceScoreProps {
  score: number;
  className?: string;
  comparableVehicles?: number;
}

export function ConfidenceScore({ 
  score, 
  className = "",
  comparableVehicles = 0
}: ConfidenceScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 70) return "Fair";
    return "Poor";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Confidence Score</span>
        <Badge variant="outline" className={getScoreColor(score)}>
          {getScoreLabel(score)}
        </Badge>
      </div>
      <Progress value={score} className="h-2" />
      <p className="text-xs text-muted-foreground">
        {score}% confidence in valuation accuracy
        {comparableVehicles > 0 && ` (${comparableVehicles} comparables)`}
      </p>
    </div>
  );
}
