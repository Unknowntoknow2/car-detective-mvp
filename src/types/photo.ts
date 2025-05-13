
export interface AICondition {
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  confidenceScore: number;
  aiSummary?: string;
  issuesDetected?: string[];
  photoUrl?: string;
  bestPhotoUrl?: string;
}

export interface GeneratedCondition {
  condition: string;
  confidenceScore: number;
  aiSummary?: string;
  issuesDetected?: string[];
  photoUrl?: string;
  bestPhotoUrl?: string;
}

// Add missing types and constants
export interface Photo {
  id: string;
  file?: File;
  name?: string;
  size?: number;
  type?: string;
  url?: string;
  preview?: string;
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
}

// Constants
export const MAX_FILES = 6;
export const MIN_FILES = 2;
