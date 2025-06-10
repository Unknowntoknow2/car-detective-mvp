
export interface ReportData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  estimatedValue: number;
  price: number;
  priceRange: [number, number];
  confidenceScore: number;
  zipCode: string;
  adjustments: any[];
  generatedAt: string;
  vin?: string;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
    summary: string;
  };
}
