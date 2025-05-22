
export interface AICondition {
  condition: string;
  confidenceScore: number;
  issuesDetected: string[];
  summary: string;
}

export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  description: string;
}

export interface PhotoAnalysisResult {
  photoId: string;
  score: number;
  confidence: number;
  issues: string[];
  url: string;
}

export interface PhotoAssessment {
  overallScore: number;
  photos: PhotoAnalysisResult[];
  condition: string;
  summary: string;
}
