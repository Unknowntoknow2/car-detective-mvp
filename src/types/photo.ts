
export interface AICondition {
  condition: "Excellent" | "Good" | "Fair" | "Poor" | null;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
  uploaded?: boolean;
  uploading?: boolean;
  error?: string;
}

export interface PhotoScore {
  url: string;
  score: number;
}

export interface PhotoScoringResult {
  overallScore: number;
  individualScores: PhotoScore[];
  aiCondition?: AICondition;
}

export const MAX_FILES = 5;
export const MIN_FILES = 1;
