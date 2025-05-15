
export interface ReportData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  confidenceScore?: number;
  generatedAt: string;
  userId?: string;
  priceRange?: [number, number];
  adjustments?: Array<{
    name: string;
    value: number;
    factor?: string;
    impact?: number;
    description?: string;
    impactPercentage?: number;
  }>;
  // Additional properties needed for the PDF
  vin?: string;
  trim?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  bodyType?: string;
  bestPhotoUrl?: string;
  isPremium?: boolean;
  explanation?: string;
  photoScore?: number;
  narrative?: string;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected?: string[];
    summary?: string;
  };
}

export interface ReportOptions {
  includeBreakdown?: boolean;
  includeMarketTrends?: boolean;
  includeSimilarVehicles?: boolean;
  watermark?: boolean;
  branding?: boolean;
  templateId?: string;
  isPremium?: boolean;
  includeHeader: boolean;
  includeFooter: boolean;
  includePageNumbers: boolean;
  includePhotos: boolean;
  includeLegalDisclaimer: boolean;
  theme: 'light' | 'dark';
  format?: string;
  orientation?: string;
  margin?: number;
  includeBranding: boolean;
  includeTimestamp: boolean;
  includePhotoAssessment: boolean;
  includeAIScore: boolean;
  title: string;
  printBackground?: boolean;
  landscape?: boolean;
  showWholesaleValue?: boolean;
  dealerName?: string;
  userName?: string;
}

export interface SectionParams {
  doc: any;
  data: ReportData;
  options: ReportOptions;
  pageWidth: number;
  pageHeight: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  y: number;
  fonts: Record<string, any>;
  currentPage: number;
  totalPages: number;
}
