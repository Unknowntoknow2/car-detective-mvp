
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
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected?: string[];
    summary?: string;
  };
}
