// src/types/photo.ts

export interface Photo {
  id?: string;
  file?: File;
  name?: string;
  url?: string;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string | null;
}

export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
}

export interface PhotoScoringResult {
  overallScore: number;
  individualScores: PhotoScore[];
  aiCondition: {
    condition: string;
    confidenceScore: number;
    issuesDetected?: string[];
  };
}
