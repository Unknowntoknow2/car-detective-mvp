import { DecodedVehicle } from "./DecodedVehicle";

export interface MarketListing {
  source: string;
  price: number;
  url: string;
}

export interface ValuationAuditLog {
  auditLogId: string;
  vin: string;
  timestamp: string;
  decodedVehicle: DecodedVehicle;
  userInputs: {
    mileage: number;
    zip: string;
    condition: string;
  };
  valuationOutputs: {
    estimatedValue: number;
    confidenceScore: number;
    fallbackTriggered: boolean;
  };
  marketListings: MarketListing[];
  sourcesUsed: string[];
  openAiTrace?: string;
  warnings?: string[];
}
