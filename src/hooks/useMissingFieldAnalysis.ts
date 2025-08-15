import { useMemo } from 'react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { analyzeMissingFields, MissingDataAnalysis } from '@/utils/valuation/missingFieldAnalyzer';

interface UseMissingFieldAnalysisProps {
  formData: FollowUpAnswers;
  hasPhotos?: boolean;
  isPremium?: boolean;
}

interface UseMissingFieldAnalysisReturn {
  analysis: MissingDataAnalysis;
  isComplete: boolean;
  hasHighPriorityMissing: boolean;
  completionScore: number;
  needsAttention: boolean;
}

/**
 * Hook to analyze missing fields and provide completion insights
 */
export function useMissingFieldAnalysis({
  formData,
  hasPhotos = false,
  isPremium = false
}: UseMissingFieldAnalysisProps): UseMissingFieldAnalysisReturn {
  
  const analysis = useMemo(() => {
    return analyzeMissingFields(formData, hasPhotos, isPremium);
  }, [formData, hasPhotos, isPremium]);

  const derived = useMemo(() => {
    const isComplete = analysis.missingFields.length === 0;
    const hasHighPriorityMissing = analysis.missingFields.some(field => field.priority === 'high');
    const completionScore = Math.round(
      ((analysis.completionPercentage / 100) + (analysis.confidenceBoost / 100)) / 2 * 100
    );
    
    // Needs attention if completion is low or has high priority missing fields
    const needsAttention = analysis.completionPercentage < 70 || hasHighPriorityMissing;

    return {
      isComplete,
      hasHighPriorityMissing,
      completionScore,
      needsAttention
    };
  }, [analysis]);

  return {
    analysis,
    ...derived
  };
}