
// Define the PDF section parameters
export interface SectionParams {
  doc: any; // PDF document object
  page: any; // PDF page object
  margin: number;
  width: number;
  height: number;
  pageWidth: number;
  regularFont: any;
  boldFont: any;
  contentWidth: number;
}

export interface ReportData {
  id?: string;
  valuationId?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  adjustments: AdjustmentBreakdown[];
  generatedAt: string;
  
  // Optional fields
  vin?: string;
  photoUrl?: string;
  explanation?: string;
  bestPhotoUrl?: string;
  photoScore?: number;
  isPremium?: boolean;
  features?: string[];
  aiCondition?: {
    condition: "Excellent" | "Good" | "Fair" | "Poor";
    confidenceScore: number;
    issuesDetected?: string[];
  };
  
  // Additional fields for specific use cases
  color?: string;
  bodyStyle?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  narrative?: string;
  photoExplanation?: string;
}

export interface AdjustmentBreakdown {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
}

export interface PdfOptions {
  format?: 'letter' | 'a4';
  orientation?: 'portrait' | 'landscape';
  margin?: number;
  includeBranding?: boolean;
  includeFooter?: boolean;
  includeTimestamp?: boolean;
  isPremium?: boolean;
}

export interface ReportOptions extends PdfOptions {
  includeBranding?: boolean;
  includeFooter?: boolean;
  includeTimestamp?: boolean;
  includePhotoAssessment?: boolean;
  includeAIScore?: boolean;
  isPremium?: boolean;
  title?: string;
  userName?: string;
  dealerName?: string;
}
