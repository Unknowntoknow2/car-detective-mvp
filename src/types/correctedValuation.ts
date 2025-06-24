// This file is deprecated - types are now defined in the pipeline and hooks
// Keeping minimal interface for backward compatibility

export interface CorrectedValuationResults {
  success: boolean;
  valuation: {
    estimatedValue: number;
    confidenceScore: number;
    basePrice: number;
    adjustments: Array<{
      factor: string;
      impact: number;
      description: string;
    }>;
    valuationId: string;
    vin: string;
    make: string;
    model: string;
    year: number;
    mileage: number;
    condition: string;
    zipCode: string;
  };
  summary: string;
  marketplaceData: {
    listings: Array<{
      id: string;
      title: string;
      price: number;
      platform: string;
      location: string;
      url: string;
      mileage?: number;
      created_at: string;
    }>;
    averagePrice: number;
    count: number;
  };
  pdfBuffer: Uint8Array;
}
