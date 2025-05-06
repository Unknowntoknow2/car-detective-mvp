
export interface ValuationResult {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  adjustments: {
    name: string;
    value: number;
    percentage: number;
  }[];
  createdAt?: string;
}

export interface ValuationResultProps {
  valuationId?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  location?: string;
  valuation?: number;
  isManualValuation?: boolean;
}
