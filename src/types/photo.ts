
export interface AICondition {
  condition: string;
  confidence: number;
  issuesDetected: string[];
  summary: string;
}

export interface Photo {
  id: string;
  url?: string;
  file?: File;
  name?: string;
  preview?: string;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
  thumbnail?: string;
}

export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
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

export interface PhotoUploadProps {
  onPhotoAnalysisComplete?: (vehicle?: any) => void;
  onPhotoUpload?: (files: File[]) => void;
  isLoading?: boolean;
  vehicle?: any;
}

export const MAX_FILES = 10;
export const MIN_FILES = 1;
