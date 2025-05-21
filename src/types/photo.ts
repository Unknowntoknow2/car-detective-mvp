
export interface AICondition {
  condition: string;
  confidenceScore: number;
  issuesDetected: string[];
  summary: string;
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
  explanation?: string;
}

export interface PhotoScoringResult {
  photoUrl: string;
  score: number;
  confidenceScore?: number;
  condition?: string;
  issues?: string[];
}

export interface PhotoAnalysisResult {
  overallScore: number;
  individualScores: PhotoScore[];
  aiCondition?: AICondition;
  photoUrls?: string[]; // Added because several services expect this property
}

export const MIN_FILES = 1;
export const MAX_FILES = 10;
