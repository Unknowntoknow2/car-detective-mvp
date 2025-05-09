
export const MAX_FILES = 6;
export const MIN_FILES = 1;

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

// Added PhotoFile type for mock uploader
export interface PhotoFile {
  id: string;
  file: File;
  preview: string;
}

export interface AICondition {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
  issues?: string[];
}

export interface AdjustmentBreakdown {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
  factor: string;
  impact: number;
  adjustment?: number;
  impactPercentage?: number;
  percentage?: number; // Explicitly added this property
}

export interface PhotoAssessmentResult {
  aiCondition: AICondition;
  photoScores: PhotoScore[];
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
  aiCondition?: AICondition;
  individualScores?: PhotoScore[];
}
