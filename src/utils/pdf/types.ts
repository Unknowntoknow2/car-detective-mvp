
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
  
  // Adding properties needed for tests and PDF generation
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
  color?: string;
  bodyStyle?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  photoExplanation?: string;
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
  
  // Additional options needed by PDF generator service
  title?: string;
  userName?: string;
  dealerName?: string;
}

export interface SectionParams {
  doc: any;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  fontFamily: string;
  
  // Additional properties needed by PDF section modules
  page?: any;
  width?: number;
  height?: number;
  contentWidth?: number;
  regularFont?: string;
  boldFont?: string;
}

export interface AdjustmentBreakdown {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
  factor?: string;
  impact?: number;
  adjustment?: number;
  impactPercentage?: number;
}
