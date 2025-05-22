
export interface AICondition {
  condition: string;
  confidenceScore: number;
  issuesDetected: string[];
  summary: string;
}

export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  description: string;
}

export interface PhotoAnalysisResult {
  photoId: string;
  score: number;
  confidence: number;
  issues: string[];
  url: string;
  photoUrls?: string[];
  aiCondition?: AICondition;
  individualScores?: PhotoScore[];
}

export interface PhotoAssessment {
  overallScore: number;
  photos: PhotoAnalysisResult[];
  condition: string;
  summary: string;
}

// Add missing types needed by photo upload components
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
}

export interface PhotoFile {
  id: string;
  file: File;
  preview?: string;
}

export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
}

// Constants for photo upload limits
export const MIN_FILES = 1;
export const MAX_FILES = 6;
