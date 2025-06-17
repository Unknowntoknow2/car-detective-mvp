
export interface PhotoScore {
  overall: number;
  clarity: number;
  angle: number;
  lighting: number;
  condition: number;
  url?: string;
  isPrimary?: boolean;
  explanation?: string;
}

export interface PhotoAnalysisResult {
  scores: PhotoScore[];
  overallScore: number;
  recommendations: string[];
}

export interface PhotoScoringResult {
  score: number;
  analysis: PhotoAnalysisResult;
  confidence: number;
  photoUrls: string[];
  individualScores: PhotoScore[];
  bestPhotoUrl?: string;
  aiCondition: AICondition;
  error?: string;
}

export interface AICondition {
  confidence: number;
  description: string;
  condition?: string;
  issuesDetected?: string[];
}

export interface Photo {
  id: string;
  url: string;
  file?: File;
  name?: string;
  preview?: string;
  uploading?: boolean;
  uploaded?: boolean;
  size?: number;
  type?: string;
  thumbnail?: string;
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
