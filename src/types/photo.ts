
export interface PhotoScore {
  url: string;
  score: number;
  overall: number;
  clarity: number;
  angle: number;
  lighting: number;
  condition: number;
  isPrimary?: boolean;
  explanation?: string;
}

export interface PhotoAnalysisResult {
  overallScore: number;
  individualScores: PhotoScore[];
  recommendations: string[];
  confidence: number;
  issues: string[];
  url: string;
  photoUrls: string[];
  aiCondition?: AICondition;
}

export interface PhotoScoringResult {
  score: number;
  confidence: number;
  photoUrls: string[];
  individualScores: PhotoScore[];
  bestPhotoUrl?: string;
  aiCondition: AICondition;
  overallScore: number;
  issues: string[];
  summary: string;
  photoUrl: string;
}

export interface AICondition {
  condition: string;
  confidence: number;
  description: string;
  issuesDetected?: string[];
  summary?: string;
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
