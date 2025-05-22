
export interface ReportData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  explanation?: string;
  generatedAt?: string;
  vin?: string;
  zipCode?: string;
  aiCondition?: any;
  premium?: boolean;
  isPremium?: boolean;
  isSample?: boolean;
}

export interface ReportOptions {
  includeBranding: boolean;
  includeExplanation: boolean;
  includePhotoAssessment: boolean;
  watermark: boolean | string;
  fontSize: number;
  pdfQuality: 'standard' | 'high';
  isPremium?: boolean;
}
