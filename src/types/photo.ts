
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

// PhotoScoringResult for photo analysis service
export interface PhotoScoringResult {
  score: number;
  confidenceScore: number;
  issues: string[];
  isPrimary?: boolean;
  summary?: string;
  url?: string;
}

// PhotoAnalysisResult for the overall analysis
export interface PhotoAnalysisResult {
  overallScore: number;
  bestPhoto?: PhotoScoringResult;
  detailedResults: PhotoScoringResult[];
  condition?: string;
  confidenceScore?: number;
}

// Photo interface for basic photo information
export interface Photo {
  id: string;
  url: string;
  score?: number;
  isPrimary?: boolean;
}
