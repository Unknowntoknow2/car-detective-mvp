
export interface ReportData {
  // Vehicle information
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage: number;
  condition: string;
  
  // Valuation information
  estimatedValue: number;
  confidenceScore: number;
  
  // Location information
  zipCode: string;
  
  // Condition information
  aiCondition: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
    summary?: string;
  };
  
  // Additional information
  adjustments: AdjustmentItem[];
  generatedAt: string;
  
  // Extended properties for corrected valuations
  ainSummary?: string;
  marketConditions?: {
    demand: string;
    supply: string;
    priceDirection: string;
  };
}

export interface AdjustmentItem {
  factor: string;
  impact: number;
  description: string;
}
