
// Add missing photo types
export interface PhotoScore {
  id?: string;
  score: number;
  url: string;
  metadata?: Record<string, any>;
}

export interface AICondition {
  condition: string;
  confidenceScore: number;
  issuesDetected: string[];
  summary?: string;
  aiSummary?: string;
}

export const MAX_FILES = 6;
export const MIN_FILES = 1;
