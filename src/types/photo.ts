
export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
  issues?: string[];
}

export interface AICondition {
  condition: string;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

export interface PhotoAnalysisResult {
  overallScore: number;
  individualScores: PhotoScore[];
  aiCondition?: AICondition;
  error?: string;
}

// Add the Photo interface that's being imported by several components
export interface Photo {
  id: string;
  name?: string;
  size?: number;
  type?: string;
  url: string;
  file?: File;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
  explanation?: string;
}

// Add the constants that are being imported
export const MAX_FILES = 6;
export const MIN_FILES = 2;

// Add PhotoScoringResult for analyzePhotos.ts
export interface PhotoScoringResult {
  score: number;
  photoUrl: string;
  condition: string;
  confidenceScore: number;
  overallScore: number;
  individualScores: PhotoScore[];
  bestPhotoUrl?: string;
  aiCondition?: AICondition;
  error?: string;
}
