
// Create or update photo types
export interface Photo {
  id?: string;
  url: string;
  score?: number;
  isPrimary?: boolean;
  valuationId?: string;
  type?: string;
  angle?: string;
  fileName?: string;
  size?: number;
}

export interface PhotoScore {
  score: number;
  primaryUrl?: string;
  angles?: { [key: string]: number };
}

export interface AICondition {
  condition: string;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

export interface PhotoScoringResult {
  photoScore: number;
  bestPhotoUrl?: string;
  aiCondition?: AICondition;
  explanation?: string;
}

// Constants
export const MAX_FILES = 8;
export const MIN_FILES = 1;
