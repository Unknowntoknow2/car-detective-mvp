
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
  adjustments?: Array<AdjustmentItem>;
  features?: string[];
  explanation?: string;
  generatedDate: Date;
  bestPhotoUrl?: string;
  aiCondition?: any;
  premium?: boolean;
  isSample?: boolean;
  
  // Add missing properties from errors
  trim?: string;
  photoUrl?: string;
  price?: number;
  bodyType?: string;
  reportTitle?: string;
  reportDate?: Date;
  companyName?: string;
  website?: string;
  disclaimerText?: string;
  photoScore?: number;
}

// Add AdjustmentItem interface that was missing
export interface AdjustmentItem {
  factor: string;
  impact: number;
  description?: string;
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

// Add SectionParams interface
export interface SectionParams {
  doc?: any;
  page?: any;
  data: ReportData;
  y?: number;
  width?: number;
  height?: number;
  margin?: number;
  pageWidth?: number;
  pageHeight?: number;
  textColor?: any;
  regularFont?: any;
  boldFont?: any;
}

// Add ReportGeneratorParams interface
export interface ReportGeneratorParams {
  data: ReportData;
  options: ReportOptions;
  document: any;
}

// Add AdjustmentBreakdown interface
export interface AdjustmentBreakdown {
  baseValue: number;
  adjustments: AdjustmentItem[];
  totalValue: number;
}

