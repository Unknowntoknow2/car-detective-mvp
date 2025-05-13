
export interface AICondition {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
  photoUrl?: string;
}
