
export interface AICondition {
  condition: "Excellent" | "Good" | "Fair" | "Poor" | null;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
  summary?: string; // Alias for aiSummary for backward compatibility
}

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
  uploaded?: boolean;
  uploading?: boolean;
  error?: string;
  explanation?: string;
  name?: string;
  size?: number;
  type?: string;
  file?: File;
}

export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
  explanation?: string;
}

export interface PhotoScoringResult {
  overallScore: number;
  individualScores: PhotoScore[];
  aiCondition?: AICondition;
  // Adding missing properties used in tests
  photos?: Photo[];
  photoScore?: number;
  error?: string;
  uploadPhotos?: (files: File[]) => Promise<Photo[]>;
  createPhotoScores?: () => Promise<PhotoScore[]>;
}

export const MAX_FILES = 5;
export const MIN_FILES = 1;
