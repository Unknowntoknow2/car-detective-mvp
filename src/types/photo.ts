
export interface AICondition {
  condition: string;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

export interface Photo {
  id: string;
  file?: File;
  name?: string;
  size?: number;
  type?: string;
  preview?: string;
  url?: string;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
  explanation?: string;
  score?: number;
  isPrimary?: boolean;
}

export interface PhotoFile {
  id: string;
  file: File;
  preview: string;
}

export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
}

export interface PhotoScoringResult {
  photoScore: number;
  score?: number; // For backward compatibility
  individualScores: PhotoScore[];
  photoUrls: string[];
  bestPhotoUrl?: string;
  aiCondition?: AICondition;
  error?: string;
}

export interface PhotoAnalysisResult {
  photoUrls: string[];
  score: number;
  aiCondition?: AICondition;
  individualScores?: PhotoScore[];
}

// Constants for photo uploads
export const MIN_FILES = 1;
export const MAX_FILES = 6;

// Add missing AdjustmentBreakdown interface
export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
}
