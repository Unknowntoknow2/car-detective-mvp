
// src/types/ValuationTypes.ts
// Canonical schema for AIN Valuation Engine (Google-level, 40+ factors)
// All legacy types are deprecated and aliased to canonical.

/**
 * @deprecated Use VehicleDataCanonical instead.
 */
export type LegacyVehicleData = VehicleDataCanonical;
/**
 * @deprecated Use ValuationResultCanonical instead.
 */
export type ValuationResult = ValuationResultCanonical;

// ---
// 📋 Core Required Fields
// ---
export interface VehicleDataCanonical {
  vin: string; // 1
  year: number; // 2
  make: string; // 3
  model: string; // 4
  mileage: number; // 5
  zip: string; // 6
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor'; // 7
  titleStatus: 'Clean' | 'Salvage' | 'Rebuilt' | 'Other'; // 8

  // ⚡ Strongly Recommended
  trim?: string; // 9
  engine?: string; // 10
  drivetrain?: string; // 11
  fuelType?: string; // 12
  color?: string; // 13
  lastServiceDate?: string; // 14 (ISO)
  accidentHistory?: number | boolean; // 15

  // 🔎 Optional/Enrichment
  batteryHealthPercentage?: number; // 16
  photoAiConditionScore?: number; // 17
  marketConfidenceScore?: number; // 18
  sourceOrigin?: string; // 19
  vinDecodeLevel?: 'Basic' | 'Enhanced' | 'Premium'; // 20

  // 🏁 Advanced/Roadmap
  auctionHistory?: string; // 21
  serviceHistoryDetails?: string; // 22
  ownershipHistory?: string; // 23
  registrationState?: string; // 24
  insuranceLossRecords?: string; // 25
  aftermarketMods?: string; // 26
  factoryOptions?: string; // 27
  recallStatus?: string; // 28
  tireConditionScore?: number; // 29
  marketSeasonality?: string; // 30
  dealerVsPrivate?: 'Dealer' | 'Private'; // 31
  incentivesOrRebates?: string; // 32
  msrpInflationAdjustment?: number; // 33
  fuelPriceAdjustment?: number; // 34
  geoMarketTrends?: string; // 35

  // ---
  // Room for future fields (36-40+)
  [key: string]: any;
}

export interface Adjustment {
  factor: string;
  impact: number; // e.g. +500, -1200
  description: string;
}

export interface MarketFactor {
  factor: string;
  impact: number;
  description: string;
}

export interface ValuationResultCanonical {
  estimatedValue: number;
  priceRange: { low: number; high: number };
  confidence: number; // 0-1
  adjustments: Adjustment[];
  marketFactors: MarketFactor[];
  vehicleData: VehicleDataCanonical;
  explanation: string;
}
