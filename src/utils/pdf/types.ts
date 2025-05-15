
export interface ReportData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  price: number;
  estimatedValue: number;
  zipCode?: string;
  vin?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  confidenceScore?: number;
  isPremium?: boolean;
  priceRange?: number[] | { min: number; max: number };
  adjustments?: {
    factor: string;
    impact: number;
    description?: string;
  }[];
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected?: string[];
    summary?: string;
  };
  generatedAt: string;
  userId?: string;
  explanation?: string;
  bestPhotoUrl?: string;
  // Additional fields needed by various components
  trim?: string;
  photoScore?: number;
  photoExplanation?: string;
  narrative?: string;
  features?: string[];
}

export interface ReportOptions {
  pageSize: 'letter' | 'a4' | 'legal';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  includePageNumbers: boolean;
  includePhotos: boolean;
  includeSimilarVehicles: boolean;
  companyInfo: {
    name: string;
    logo: string | null;
    website: string;
    phone: string;
  };
}

export interface SectionParams {
  doc: any;
  y: number;
  data: ReportData;
  options: ReportOptions;
  pageWidth: number;
  pageHeight: number;
  // Additional properties needed by various components
  page?: any;
  margin?: number;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  width?: number;
  height?: number;
  contentWidth?: number;
  boldFont?: any;
  regularFont?: any;
  primaryColor?: any;
  secondaryColor?: any;
  textColor?: any;
}

// Add the AdjustmentBreakdown type that is used in adjustmentTable.ts
export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  description?: string;
  name?: string;
  value?: number;
  percentAdjustment?: number;
  adjustment?: number;
  impactPercentage?: number;
}
