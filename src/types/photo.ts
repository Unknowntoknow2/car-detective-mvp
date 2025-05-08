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

export interface Photo {
  id: string;
  url: string;
  valuationId: string; // ✅ required by tests + Supabase usage
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

export const MAX_FILES = 6;
export const MIN_FILES = 1;

export interface PhotoScoringResult {
  score: number;
  photoUrl: string;
  condition: ConditionRating;
  confidenceScore: number;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
  };
  individualScores?: number[];
  error?: string;
}
