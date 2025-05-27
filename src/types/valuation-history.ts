
export interface Valuation {
  id: string;
  vin?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  photos?: string[];
  features?: string[];
  accidents?: boolean;
  accidentCount?: number;
}

export interface ValuationHistory {
  valuations: Valuation[];
  total: number;
  page: number;
  limit: number;
}
