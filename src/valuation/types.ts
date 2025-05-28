
import { EnrichedVehicleData } from '@/enrichment/types';
import { FollowUpAnswers } from '@/types/follow-up-answers';

export interface CalculateVehicleValueInput {
  vin: string;
  enrichedData: EnrichedVehicleData;
  followUpAnswers: FollowUpAnswers;
  basePrice?: number; // Optional fallback if no enriched data
}

export interface VehicleValuationResult {
  baseValue: number;
  adjustedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  penalties: {
    mileagePenalty: number;
    conditionPenalty: number;
    accidentPenalty: number;
    auctionDamagePenalty: number;
    ownerPenalty: number;
    servicePenalty: number;
  };
  dealerInsights: {
    estimatedDealerProfit: number;
    avgDealerListPrice: number;
    dealerMargin: number;
  };
  marketInsights: {
    avgMarketplacePrice: number;
    avgAuctionPrice: number;
    listingCount: number;
    priceVariance: number;
  };
  adjustments: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
}

export interface MarketData {
  avgMarketplacePrice: number;
  avgAuctionPrice: number;
  recentDealerPrice: number;
  listingCount: number;
  priceVariance: number;
}
