
export const MIN_FILES = 3;
export const MAX_FILES = 5;

export interface Photo {
  url: string;
  thumbnail?: string;
  id?: string;
  explanation?: string;
}

export interface AICondition {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
  bestPhotoUrl?: string;
}

// Interface for valuation_photos table
export interface ValuationPhoto {
  id: string;
  valuation_id: string;
  photo_url: string;
  score: number;
  uploaded_at: string;
  explanation?: string;
}

// Type for individual photo scores
export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
  explanation?: string;
}

// Type for the return value of the usePhotoScoring hook
export interface PhotoScoringResult {
  uploadPhotos: (files: File[]) => Promise<{ 
    score: number, 
    aiCondition?: AICondition,
    individualScores?: PhotoScore[]
  } | null>;
  photos: Photo[];
  photoScore: number | null;
  aiCondition: AICondition | null;
  isUploading: boolean;
  isScoring: boolean;
  uploadProgress: number;
  error: string | null;
  resetUpload: () => Promise<void>;
  individualScores: PhotoScore[];
  isLoading: boolean;
}
