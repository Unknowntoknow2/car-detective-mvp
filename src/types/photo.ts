
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

export interface PhotoAnalysisResult {
  overallScore: number;
  individualScores: PhotoScore[];
  aiCondition?: AICondition;
}

export const MIN_FILES = 1;
export const MAX_FILES = 10;
