
export const MAX_FILES = 6;
export const MIN_FILES = 1;

export interface PhotoFile {
  file: File;
  id: string;
  preview: string;
  uploaded?: boolean;
  url?: string;
  error?: string;
}

export interface AICondition {
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}

export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
}

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

export interface PhotoAssessmentResult {
  aiCondition: AICondition;
  photoScores: PhotoScore[];
}
