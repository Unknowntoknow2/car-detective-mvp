// src/types/photo.ts

export interface Photo {
  id?: string;
  file?: File;
  name?: string;
  url?: string;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string | null;
  score?: number;
  isPrimary?: boolean;
  valuationId?: string;
  type?: string;
  angle?: string;
  fileName?: string;
  size?: number;
}

export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
  factor?: string;
  impact?: number;
}

export interface AICondition {
  condition: string;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

export interface PhotoScoringResult {
  photoScore: number;
  bestPhotoUrl?: string;
  aiCondition?: AICondition;
  explanation?: string;
  individualScores?: PhotoScore[];
  photoUrls?: string[];
  score?: number;
}
