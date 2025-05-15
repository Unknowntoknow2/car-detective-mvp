
// Define constants
export const MAX_FILES = 10;
export const MIN_FILES = 1;

// Photo file type (used when uploading)
export interface PhotoFile {
  id: string;
  file: File;
  previewUrl: string;
  status: 'uploading' | 'uploaded' | 'error';
  progress: number;
  error?: string;
}

// Photo type (used after upload)
export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  fileName: string;
  fileSize: number;
  width?: number;
  height?: number;
  uploadedAt: string;
  angle: 'front' | 'back' | 'side' | 'interior' | 'other';
  isMainPhoto?: boolean;
  valuationId?: string;
}

// Photo score type
export interface PhotoScore {
  score: number;
  angle: string;
  clarity: number;
  lighting: number;
  framing: number;
  comments: string[];
  issues?: string[];
}

// AI condition assessment result
export interface AICondition {
  condition: string;
  confidenceScore: number;
  issuesDetected?: string[];
  summary?: string;
  aiSummary?: string; // For backward compatibility
}

// Photo analysis result from AI
export interface PhotoAnalysisResult {
  photoId: string;
  angle: string;
  clarity: number;
  lighting: number;
  framing: number;
  overall: number;
  vehicleType?: string;
  damageDetected?: boolean;
  damageDescription?: string;
  colorDetected?: string;
  isComplete: boolean;
}

// Photo scoring result
export interface PhotoScoringResult {
  overallScore: number;
  photoScores: PhotoScore[];
  conditionAssessment?: AICondition;
  bestPhotoId?: string;
  feedback: string;
  missingAngles?: string[];
  completionPercentage: number;
}

// Adjustment breakdown for photo-based valuation
export interface AdjustmentBreakdown {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
  factor: string;
  impact: number;
  impactPercentage?: number;
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
