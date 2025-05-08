
/**
 * Photo-related types
 */

export type ConditionRating = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export interface AICondition {
  condition: ConditionRating;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
  bestPhotoUrl?: string;
}

export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
  issues?: string[];
}

export interface PhotoAnalysisResult {
  overallScore: number;
  individualScores: PhotoScore[];
  aiCondition?: AICondition;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
  };
  error?: string;
}

// Add missing Photo interface
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
  issues?: string[];
}

// Add missing constants
export const MAX_FILES = 6;
export const MIN_FILES = 1;

// Add missing PhotoScoringResult
export interface PhotoScoringResult {
  score: number;
  photoUrl: string;
  condition: string;
  confidenceScore: number;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
  };
}
