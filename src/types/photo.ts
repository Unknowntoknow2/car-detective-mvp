<<<<<<< HEAD

export interface AICondition {
  condition: string;
  confidenceScore: number;
  issuesDetected: string[];
  summary: string;
  score?: number; // Added to match usage in code
=======
// Define constants
export const MAX_FILES = 10;
export const MIN_FILES = 1;

// Photo file type (used when uploading)
export interface PhotoFile {
  id: string;
  file: File;
  previewUrl?: string;
  preview?: string; // For backward compatibility
  status?: "uploading" | "uploaded" | "error";
  progress?: number;
  error?: string;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}

export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  description: string;
  name?: string; // Added to match usage in valuationEngine.ts
}

export interface PhotoAnalysisResult {
  photoId: string;
  score: number;
  confidence: number;
  issues: string[];
  url: string;
  photoUrls?: string[];
  aiCondition?: AICondition;
  individualScores?: PhotoScore[];
  overallScore?: number; // Added to fix errors
}

export interface PhotoAssessment {
  overallScore: number;
  photos: PhotoAnalysisResult[];
  condition: string;
  summary: string;
}

// Photo types needed by photo upload components
export interface Photo {
  id: string;
<<<<<<< HEAD
=======
  url?: string;
  thumbnailUrl?: string;
  fileName?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  uploadedAt?: string;
  angle?: "front" | "back" | "side" | "interior" | "other";
  isMainPhoto?: boolean;
  valuationId?: string;
  // For backward compatibility and form handling
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  file?: File;
  name?: string;
  size?: number;
  type?: string;
  preview?: string;
  url?: string;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
  explanation?: string;
}

export interface PhotoFile {
  id: string;
  file: File;
  preview?: string;
}

export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
  explanation?: string;
}

// Add PhotoScoringResult for photoScoringService
export interface PhotoScoringResult {
<<<<<<< HEAD
  overallScore: number;
  individualScores: PhotoScore[];
  condition: string;
  issues: string[];
  summary: string;
  photoUrl?: string; // Added to match usage
  score?: number; // Added to match usage
  confidence?: number; // Added to match usage
  photoUrls?: string[]; // Added to match usage
  aiCondition?: AICondition; // Added to match usage
=======
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
  error?: string;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}

// Constants for photo upload limits
export const MIN_FILES = 1;
export const MAX_FILES = 6;
