
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ValuationScoreBarProps {
  score: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ValuationScoreBar({
  score,
  className,
  showLabel = true,
  size = 'md'
}: ValuationScoreBarProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 85) return 'bg-green-600';
    if (score >= 70) return 'bg-emerald-600';
    if (score >= 50) return 'bg-amber-600';
    return 'bg-red-600';
  };
  
  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'High Confidence';
    if (score >= 70) return 'Good Confidence';
    if (score >= 50) return 'Moderate Confidence';
    return 'Low Confidence';
  };
  
  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';
  const progressColor = getProgressColor(score);
  
  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium">Confidence Score</span>
          <span className={cn("font-semibold", getScoreColor(score))}>
            {score}% - {getScoreLabel(score)}
          </span>
        </div>
      )}
      <Progress 
        value={score} 
        className={cn(heightClass, "bg-gray-200", progressColor)}
      />
    </div>
  );
}
