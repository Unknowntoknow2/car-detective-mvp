
export interface AICondition {
  condition: "Excellent" | "Good" | "Fair" | "Poor" | null;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
  uploaded?: boolean;
  uploading?: boolean;
  error?: string;
  explanation?: string; // Added missing property
}

export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean; // Added missing property
  explanation?: string; // Added missing property
}

export interface PhotoScoringResult {
  overallScore: number;
  individualScores: PhotoScore[];
  aiCondition?: AICondition;
  // Add missing properties for tests
  photos?: Photo[];
  photoScore?: number;
  error?: string;
  uploadPhotos?: (files: File[]) => Promise<Photo[]>;
}

export const MAX_FILES = 5;
export const MIN_FILES = 1;
