
export interface AICondition {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
  photoUrl?: string;
}

export interface Photo {
  id: string;
  url?: string;
  file?: File;
  name?: string;
  size?: number;
  type?: string;
  preview?: string;
  uploaded?: boolean;
  uploading?: boolean;
  error?: string;
  score?: number;
  isPrimary?: boolean;
}

export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
}

export interface PhotoFile {
  id: string;
  file: File;
  preview: string;
}

export interface PhotoScoringResult {
  photoScore: number;
  individualScores: PhotoScore[];
  score: number;
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

// Constants for photo upload
export const MAX_FILES = 5;
export const MIN_FILES = 1;

export interface AdjustmentBreakdown {
  name: string;
  description: string;
  value: number;
  percentAdjustment?: number;
  factor: string;
  impact: number;
  adjustment?: number;
  impactPercentage?: number;
}
