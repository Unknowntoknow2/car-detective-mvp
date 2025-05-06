
/**
 * Result from image condition assessment
 */
export interface ConditionAssessmentResult {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}
