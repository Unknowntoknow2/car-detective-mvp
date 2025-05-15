// Define constants
export const MAX_FILES = 10;
export const MIN_FILES = 1;

// Photo file type (used when uploading)
export interface PhotoFile {
  id: string;
  file: File;
  previewUrl?: string;
  preview?: string; // For backward compatibility
  status?: 'uploading' | 'uploaded' | 'error';
  progress?: number;
  error?: string;
}

// Photo type (used after upload)
export interface Photo {
  id: string;
  url?: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  uploadedAt?: string;
  angle?: 'front' | 'back' | 'side' | 'interior' | 'other';
  isMainPhoto?: boolean;
  valuationId?: string;
  // For backward compatibility and form handling
  file?: File;
  name?: string;
  size?: number;
  type?: string;
  preview?: string;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
  score?: number;
  isPrimary?: boolean;
  explanation?: string;
}

// Photo score type
export interface PhotoScore {
  score: number;
  angle?: string;
  clarity?: number;
  lighting?: number;
  framing?: number;
  comments?: string[];
  issues?: string[];
  url?: string;
  isPrimary?: boolean;
}

// AI condition assessment result
export interface AICondition {
  condition: string;
  confidenceScore: number;
  issuesDetected?: string[];
  summary?: string;
}

// Photo analysis result from AI
export interface PhotoAnalysisResult {
  photoId?: string;
  photoUrls?: string[];
  angle?: string;
  clarity?: number;
  lighting?: number;
  framing?: number;
  overall?: number;
  score?: number;
  vehicleType?: string;
  damageDetected?: boolean;
  damageDescription?: string;
  colorDetected?: string;
  isComplete?: boolean;
  aiCondition?: AICondition;
  individualScores?: PhotoScore[];
  bestPhotoId?: string;
  error?: string; // Add error property
}

// Photo scoring result
export interface PhotoScoringResult {
  overallScore?: number;
  photoScore?: number; 
  score?: number;
  photoScores?: PhotoScore[];
  individualScores?: PhotoScore[];
  conditionAssessment?: AICondition;
  aiCondition?: AICondition;
  bestPhotoId?: string;
  bestPhotoUrl?: string;
  feedback?: string;
  missingAngles?: string[];
  completionPercentage?: number;
  photoUrls?: string[];
  error?: string; // Add error property
}

// Adjustment breakdown for photo-based valuation
export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  description?: string;
  name: string;
  value: number;
}

// Photo upload options
export interface PhotoUploadOptions {
  maxFiles?: number;
  allowedTypes?: string[];
  maxSizeMB?: number;
  autoUpload?: boolean;
  valuationId?: string;
  includeExif?: boolean;
}
