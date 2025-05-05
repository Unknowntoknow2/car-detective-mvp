
export const MIN_FILES = 3;
export const MAX_FILES = 5;

export interface Photo {
  url: string;
  thumbnail?: string;
  id?: string;
}

export interface AICondition {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

// Interface for valuation_photos table
export interface ValuationPhoto {
  id: string;
  valuation_id: string;
  photo_url: string;
  score: number;
  uploaded_at: string;
}

// Type for the return value of the usePhotoScoring hook
export interface PhotoScoringResult {
  uploadPhotos: (files: File[]) => Promise<{ score: number, aiCondition?: AICondition } | null>;
  photos: Photo[];
  photoScore: number | null;
  aiCondition: AICondition | null;
  isUploading: boolean;
  isScoring: boolean;
  uploadProgress: number;
  error: string | null;
  resetUpload: () => Promise<void>;
}
