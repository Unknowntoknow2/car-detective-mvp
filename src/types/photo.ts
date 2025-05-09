
// src/types/photo.ts

export interface Photo {
  id?: string;
  file?: File;
  name?: string;
  url?: string;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string | null;
  size?: number;
  type?: string;
  explanation?: string;
}

export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
  issues?: string[];
}

export interface PhotoScoringResult {
  overallScore: number;
  individualScores: PhotoScore[];
  score?: number; // For backward compatibility
  photoUrl?: string; // For backward compatibility
  condition?: string;
  confidenceScore?: number;
  error?: string;
  aiCondition?: AICondition;
}

export interface PhotoAnalysisResult {
  photoUrls: string[];
  score: number;
  overallScore?: number;
  individualScores?: PhotoScore[];
  aiCondition?: AICondition;
}

export interface AICondition {
  condition: string;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

// Constants
export const MAX_FILES = 6;
export const MIN_FILES = 1;
