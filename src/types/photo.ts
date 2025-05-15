
export interface AICondition {
  condition: string;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}
