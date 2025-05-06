
export interface ReportData {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: string;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  confidenceScore: number;
  color: string;
  bodyStyle: string;
  bodyType: string;
  fuelType: string;
  explanation: string;
  isPremium: boolean;
  valuationId?: string;
  aiCondition?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
  bestPhotoUrl?: string;
  // Add missing fields
  plate?: string;
  state?: string;
  transmission?: string;
  adjustments?: any[];
  priceRange?: [number, number];
  carfaxData?: any;
}

export interface ValuationReportOptions {
  mileage?: string | number;
  estimatedValue?: number;
  confidenceScore?: number;
  condition?: string;
  fuelType?: string;
  zipCode?: string;
  adjustments?: any[];
  carfaxData?: any;
  isPremium?: boolean;
  explanation?: string;
  aiCondition?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
  bestPhotoUrl?: string;
}
