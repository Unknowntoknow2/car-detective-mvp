
export interface ConditionAssessmentResult {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
  confidenceScore: number;
  issuesDetected: string[];
  aiSummary: string;
}
