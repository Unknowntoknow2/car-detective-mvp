
// Add missing photo types
export interface Photo {
  id: string;
  file?: File;
  name?: string;
  size?: number;
  type?: string;
  url?: string;
  preview?: string;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
  score?: number;
  isPrimary?: boolean;
  explanation?: string;
}

export interface PhotoFile {
  id: string;
  file: File;
  preview: string;
}

export interface PhotoScore {
  id?: string;
  score: number;
  url: string;
  isPrimary?: boolean;
  metadata?: Record<string, any>;
}

export interface PhotoScoringResult {
  photoScore: number;
  individualScores: PhotoScore[];
  score?: number;
  photoUrls: string[];
  bestPhotoUrl?: string;
  aiCondition?: AICondition;
}

export interface PhotoAnalysisResult {
  photoUrls: string[];
  score: number;
  aiCondition?: AICondition;
  individualScores?: PhotoScore[];
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
