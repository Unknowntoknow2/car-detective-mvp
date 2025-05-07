
export interface Photo {
  id: string;
  url: string;
  metadata?: Record<string, any>;
  name?: string;
  size?: number;
  type?: string;
  file?: File;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
  explanation?: string;
}

export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
}

export interface AICondition {
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

export interface PhotoScoringResult {
  overallScore: number;
  individualScores: PhotoScore[];
  aiCondition?: AICondition;
  error?: string;
}

// Constants for photo upload validation
export const MAX_FILES = 5;
export const MIN_FILES = 1;
