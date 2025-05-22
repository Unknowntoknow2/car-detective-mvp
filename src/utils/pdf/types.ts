
export interface ReportData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  estimatedValue: number;
  confidenceScore?: number;
  zipCode?: string;
  vin?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  bodyStyle?: string;
  priceRange?: [number, number];
  baseValue?: number;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  features?: string[];
  explanation?: string;
  generatedDate: Date;
  bestPhotoUrl?: string;
  aiCondition?: any;
  premium?: boolean;
  isSample?: boolean;
}

export interface ReportOptions {
  includeBranding: boolean;
  includeExplanation: boolean;
  includePhotoAssessment: boolean;
  watermark: string | boolean;
  fontSize: number;
  pdfQuality: 'low' | 'standard' | 'high';
  isPremium?: boolean;
}
