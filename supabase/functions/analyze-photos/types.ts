
export interface ConditionAssessmentResult {
  id?: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
  confidenceScore: number;
  issuesDetected: string[];
  aiSummary: string;
}
