
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
