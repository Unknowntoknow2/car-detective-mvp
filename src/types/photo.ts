
export interface AICondition {
  score: number;
  category: string;
  confidence: number;
  condition: string;
  summary?: string;
  issuesDetected?: string[];
}
