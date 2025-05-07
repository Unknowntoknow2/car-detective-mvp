
export interface AICondition {
  condition: string | null;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}
