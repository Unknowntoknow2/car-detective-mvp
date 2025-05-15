
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { VehicleFormTooltip } from '@/components/form/VehicleFormToolTip';

interface ConfidenceScoreProps {
  score: number;
  showTooltip?: boolean;
}

export function ConfidenceScore({ score, showTooltip = true }: ConfidenceScoreProps) {
  // Determine color based on score
  const getColorClass = () => {
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-amber-700';
    return 'text-red-700';
  };
  
  // Determine progress color
  const getProgressClass = () => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-amber-600';
    return 'bg-red-600';
  };
  
  // Determine confidence level text
  const getConfidenceText = () => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  };
  
  return (
    <div className="space-y-1">
      <div className="flex items-center space-x-1">
        <span className="text-sm font-medium">Confidence Score</span>
        {showTooltip && (
          <VehicleFormTooltip 
            content="This score indicates how confident we are in the accuracy of the valuation based on the data provided."
          />
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Progress value={score} className="h-2 flex-1" indicatorClassName={getProgressClass()} />
        <span className={`text-sm font-medium min-w-10 ${getColorClass()}`}>
          {score}% <span className="text-xs">({getConfidenceText()})</span>
        </span>
      </div>
    </div>
  );
}
