
// Define necessary interfaces for photo analysis

// AdjustmentBreakdown interface used in valuation engine
export interface AdjustmentBreakdown {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
  factor: string;
  impact: number;
  adjustment?: number;
  impactPercentage?: number;
}

// AICondition interface for vehicle condition assessment
export interface AICondition {
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  confidenceScore: number;
  aiSummary?: string;
  issuesDetected?: string[];
  photoUrl?: string;
  bestPhotoUrl?: string;
}

// Photo interface for basic photo information
export interface Photo {
  id: string;
  url?: string;
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

// PhotoFile interface for file upload handling
export interface PhotoFile {
  id: string;
  file: File;
  preview: string;
}

// PhotoScore interface for individual photo scores
export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
}

// PhotoScoringResult for photo analysis service
export interface PhotoScoringResult {
  photoScore?: number;
  individualScores?: PhotoScore[];
  score: number;
  photoUrls?: string[];
  bestPhotoUrl?: string;
  aiCondition?: AICondition;
  error?: string;
  confidenceScore?: number;
  issues?: string[];
  isPrimary?: boolean;
  summary?: string;
  url?: string;
}

// PhotoAnalysisResult for the overall analysis
export interface PhotoAnalysisResult {
  photoUrls: string[];
  score: number;
  aiCondition?: AICondition;
  individualScores?: PhotoScore[];
  overallScore?: number;
  bestPhoto?: PhotoScoringResult;
  detailedResults?: PhotoScoringResult[];
  condition?: string;
  confidenceScore?: number;
}

// Constants for photo uploads
export const MAX_FILES = 6;
export const MIN_FILES = 2;
