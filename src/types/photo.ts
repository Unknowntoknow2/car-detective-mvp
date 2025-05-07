

export interface AICondition {
  condition: string | null;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

export const MAX_FILES = 5; // Adding the MAX_FILES constant

