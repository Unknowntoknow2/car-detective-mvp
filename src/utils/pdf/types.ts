
// Update or create this file to define the ReportOptions interface with all needed properties
export interface ReportOptions {
  format: string;
  orientation: string;
  margin: number;
  includeBranding: boolean;
  includeFooter: boolean;
  includeTimestamp: boolean;
  includePhotoAssessment: boolean;
  includeAIScore: boolean;
  isPremium: boolean;
  title: string;
  printBackground?: boolean;
  landscape?: boolean;
  showWholesaleValue?: boolean;
  userName?: string;
  dealerName?: string;
}

export interface SectionParams {
  // Add all needed properties for section parameters
  doc: any;
  page: any;
  pageWidth: number;
  pageHeight: number;
  width: number;
  height: number;
  margin: number;
  fontRegular: string;
  fontBold: string;
  fontItalic: string;
  regularFont: any;
  boldFont: any;
  contentWidth: number;
  red: string;
  black: string;
  gray: string;
  lightGray: string;
  green: string;
  blue: string;
  // Add any other colors or parameters needed
}

export interface ReportData {
  make: string;
  model: string;
  year: number;
  mileage: number | string;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  priceRange: [number, number];
  adjustments: Array<{
    factor?: string;
    impact?: number;
    name?: string;
    value?: number;
    description?: string;
    percentAdjustment?: number;
  }>;
  generatedAt: string;
  confidenceScore: number;
  photoScore?: number;
  bestPhotoUrl?: string;
  isPremium?: boolean;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  };
  explanation?: string;
  vin?: string;
  trim?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  features?: string[];
  color?: string;
  narrative?: string;
  id?: string;
  valuationId?: string;
  photoExplanation?: string;
}
