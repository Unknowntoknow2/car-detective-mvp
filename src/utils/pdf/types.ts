// Add this to the top of your file if needed
export interface ReportOptions {
  includeBranding: boolean;
  includeAIScore: boolean;
  includeFooter: boolean;
  includeTimestamp: boolean;
  includePhotoAssessment: boolean;
  // Additional properties used in the code
  format?: string;
  printBackground?: boolean;
  landscape?: boolean;
  showWholesaleValue?: boolean;
  dealerName?: string;
  title?: string;
  userName?: string;
}

// If needed, make sure the rest of your existing type definitions remain
export interface ReportData {
  // Keep existing properties
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  zipCode: string;
  estimatedValue: number;
  confidenceScore: number;
  color: string;
  bodyStyle: string;
  bodyType: string;
  fuelType: string;
  explanation: string;
  isPremium: boolean;
  transmission?: string;
  priceRange?: [number, number];
  adjustments?: Array<{ factor: string; impact: number; description: string }>;
  aiCondition?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
  bestPhotoUrl?: string;
  photoExplanation?: string;
  narrative?: string;
  valuationId?: string;
}

export interface SectionParams {
  page: any; // PDFPage
  width: number;
  height: number;
  margin: number;
  regularFont: any; // PDFFont
  boldFont: any; // PDFFont
  contentWidth: number;
}
