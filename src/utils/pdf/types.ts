export interface ReportData {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: string;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  confidenceScore: number | null;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  features?: string[];
  fuelType?: string;
  transmission?: string;
  color?: string;
  bodyStyle?: string;
  accidentHistory?: string;
  serviceHistory?: string;
  ownerCount?: number;
  titleStatus?: string;
  photo?: string;
  explanation?: string; // Added explanation field
}
