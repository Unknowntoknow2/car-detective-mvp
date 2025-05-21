
export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
}

export interface AICondition {
  condition: string;
  confidenceScore: number;
  issuesDetected: any[];
  summary: string;
}

export interface PhotoScoringResult {
  photoScore: number;
  score: number;
  individualScores: PhotoScore[];
  photoUrls: string[];
  bestPhotoUrl?: string;
  aiCondition: AICondition;
  error?: string;
}

export interface PhotoAnalysisResult {
  photoUrls: string[];
  score: number;
  aiCondition: AICondition;
  individualScores: PhotoScore[];
  error?: string;
}

export interface Photo {
  id: string;
  url: string;
  file?: File;
  isPrimary?: boolean;
  score?: number;
  type?: string;
}

export interface PhotoFile {
  file: File;
  id: string;
  url?: string;
}
