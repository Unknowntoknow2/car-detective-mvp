
export interface Valuation {
  id: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  estimatedValue: number;
  confidenceScore?: number;
  createdAt: string;
  zipCode?: string;
}

export interface ValuationResult {
  id: string;
  vehicle: {
    vin?: string;
    make: string;
    model: string;
    year: number;
    trim?: string;
  };
  valuation: {
    estimatedValue: number;
    confidenceScore: number;
    factors: Array<{
      name: string;
      impact: number;
      description: string;
    }>;
  };
  createdAt: string;
}
