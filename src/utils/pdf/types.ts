
export interface ReportData {
  id?: string;
  make: string;
  makeId?: string;
  model: string;
  modelId?: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  priceRange: [number, number];
  adjustments: AdjustmentBreakdown[];
  photoUrl?: string;
  explanation?: string;
  generatedAt: string;
  narrative?: string;
  
  // Adding properties needed for tests
  confidenceScore?: number;
  photoScore?: number;
  bestPhotoUrl?: string;
  isPremium?: boolean;
  pdfUrl?: string;
  features?: string[];
  aiCondition?: any;
  vin?: string;
  valuationId?: string;
  zipCode?: string;
}

export interface ReportOptions {
  includeBranding: boolean;
  includeAIScore: boolean;
  includeFooter: boolean;
  includeTimestamp: boolean;
  includePhotoAssessment: boolean;
  isPremium: boolean;
  printBackground?: boolean;
  landscape?: boolean;
  showWholesaleValue?: boolean;
}

export interface SectionParams {
  doc: any;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  fontFamily: string;
}
