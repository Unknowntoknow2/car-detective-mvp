
export interface ReportData {
  id: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage: number;
  condition: string;
  estimatedValue: number;
  price: number;
  priceRange: [number, number];
  confidenceScore: number;
  zipCode: string;
  adjustments: any[];
  generatedAt: string;
  isPremium: boolean;
  color?: string;
  bodyType?: string;
  fuelType?: string;
}

export interface PdfOptions {
  isPremium?: boolean;
  includeExplanation?: boolean;
  marketplaceListings?: any[];
}
