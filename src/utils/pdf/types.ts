
export interface ReportData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: Array<AdjustmentItem>;
  explanation?: string;
  generatedAt?: string;
  vin?: string;
  zipCode?: string;
  aiCondition?: any;
  premium?: boolean;
  isPremium?: boolean;
  isSample?: boolean;
  trim?: string;
  transmission?: string;
  bodyStyle?: string;
  color?: string;
  fuelType?: string;
  photoUrl?: string;
  bestPhotoUrl?: string;
  photoScore?: number;
  features?: string[];
  regionName?: string;
  price?: number;
  // Additional properties needed by sections
  reportTitle?: string;
  disclaimerText?: string;
  companyName?: string;
  website?: string;
}

export interface AdjustmentItem {
  factor: string;
  impact: number;
  description?: string;
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

export interface SectionParams {
  page: any;
  startY: number;
  width: number;
  margin: number;
  data: ReportData;
  options: ReportOptions;
  textColor: any;
  primaryColor: any;
  y?: number;
  height?: number; // Height property for the page
  fonts: {  // Make fonts required and ensure it has the necessary properties
    regular: any;
    bold: any;
    italic?: any;
  };
}

export interface ReportGeneratorParams {
  data: ReportData;
  options: ReportOptions;
}
