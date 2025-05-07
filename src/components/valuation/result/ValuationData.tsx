
import React from 'react';
import { ValuationResults } from '@/components/premium/common/ValuationResults';
import { AICondition } from '@/types/photo';

interface ValuationDataProps {
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  adjustments?: { factor: string; impact: number; description: string }[];
  isAIVerified: boolean;
  conditionData: AICondition | null;
}

export const ValuationData: React.FC<ValuationDataProps> = ({
  estimatedValue,
  confidenceScore,
  priceRange,
  adjustments,
  isAIVerified,
  conditionData
}) => {
  return (
    <ValuationResults
      estimatedValue={estimatedValue}
      confidenceScore={confidenceScore}
      priceRange={priceRange}
      adjustments={adjustments}
      aiVerified={isAIVerified}
      aiCondition={conditionData}
    />
  );
};
