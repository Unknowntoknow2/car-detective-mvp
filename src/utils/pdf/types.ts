
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
}
