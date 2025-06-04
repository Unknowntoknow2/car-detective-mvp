
export interface PlateLookupInfo {
  plate: string;
  state: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  color?: string;
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
  estimatedValue?: number;
  zipCode?: string;
  condition?: string;
  // Premium features
  detailedHistory?: boolean;
  marketInsights?: {
    averagePrice: number;
    priceRange: [number, number];
    marketTrend: string;
  };
  serviceRecords?: any[];
  accidentHistory?: {
    reported: boolean;
    details: any[];
  };
}

export interface VINLookupResponse {
  success: boolean;
  data?: {
    make: string;
    model: string;
    year: number;
    trim?: string;
    engine?: string;
    transmission?: string;
  };
  error?: string;
}
