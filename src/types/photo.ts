
export interface PhotoScore {
  overall: number;
  clarity: number;
  angle: number;
  lighting: number;
  condition: number;
  url?: string;
  isPrimary?: boolean;
  explanation?: string;
}

export interface PhotoAnalysisResult {
  scores: PhotoScore[];
  overallScore: number;
  recommendations: string[];
}

export interface PhotoScoringResult {
  score: number;
  analysis: PhotoAnalysisResult;
  confidence: number;
}

export interface AICondition {
  confidence: number;
  description: string;
}
