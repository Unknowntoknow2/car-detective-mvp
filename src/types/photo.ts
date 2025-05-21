
export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
}

export interface AICondition {
  condition: string;
  confidenceScore: number;
  issuesDetected: string[];
  summary: string;
}

export interface PhotoScoringResult {
  photoScore: number;
  score: number;
  individualScores: PhotoScore[];
  photoUrls: string[];
  bestPhotoUrl?: string;
  aiCondition: AICondition;
  error?: string;
}

export interface PhotoAnalysisResult {
  photoUrls: string[];
  score: number;
  aiCondition: AICondition;
  individualScores: PhotoScore[];
  error?: string;
}

export interface Photo {
  id: string;
  url?: string;
  file?: File;
  isPrimary?: boolean;
  score?: number;
  type?: string;
  name?: string;
  size?: number;
  preview?: string;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
}

export interface PhotoFile {
  file: File;
  id: string;
  url?: string;
  preview?: string;
  name?: string;
  size?: number;
  type?: string;
}

// Constants for photo uploads
export const MIN_FILES = 1;
export const MAX_FILES = 10;
