
export interface ReportData {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  zipCode: string;
  estimatedValue: number;
  confidenceScore: number;
  color: string;
  bodyStyle: string;
  bodyType: string;
  fuelType: string;
  explanation: string;
  isPremium: boolean;
  valuationId?: string;
  aiCondition?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
  bestPhotoUrl?: string;
  photoExplanation?: string;
  transmission?: string;
  priceRange?: [number, number];
  plate?: string;
  state?: string;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
}

export interface ReportOptions {
  includeBranding?: boolean;
  includeAIScore?: boolean;
  includeFooter?: boolean;
  includeTimestamp?: boolean;
  includePhotoAssessment?: boolean;
}

export type ValuationReportOptions = ReportOptions;
