
export interface ReportData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  price: number;
  estimatedValue: number;
  priceRange: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  generatedAt: string;
  confidenceScore?: number;
  photoScore?: number;
  bestPhotoUrl?: string;
  isPremium?: boolean;
  aiCondition?: any;
  features?: any[];
  explanation?: string;
  vin?: string;
  trim?: string;
  userId?: string;
}

export interface ReportOptions {
  pageSize: "letter" | "a4";
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  includePageNumbers: boolean;
  includePhotos: boolean;
  includeSimilarVehicles: boolean;
  companyInfo: {
    name: string;
    logo: string | null;
    website: string;
    phone: string;
  };
}
