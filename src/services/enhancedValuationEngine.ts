import { supabase } from '@/integrations/supabase/client';
import { searchMarketListings } from '@/agents/marketSearchAgent';
import { MarketListing, normalizeListing, getNormalizedUrl, getNormalizedSourceType } from '@/types/marketListing';
import { calculateUnifiedConfidence, type ConfidenceContext } from '@/utils/valuation/calculateUnifiedConfidence';

// Define input and output types
export interface EnhancedValuationInput {
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  zipCode: string;
  features?: string[];
}

export interface ValuationAdjustment {
  factor: string;
  impact: number;
  description: string;
  percentAdjustment?: number;
}

export interface EnhancedValuationResult {
  estimatedValue: number;
  baseMarketValue: number;
  adjustedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  adjustments: ValuationAdjustment[];
  marketListings: {
    id: string;
    price: number;
    mileage: number;
    source: string;
    sourceType: string;
    url: string;
    listingUrl: string;
    dealerName: string;
    location: string;
    condition: string;
    isCpo: boolean;
    fetchedAt: string;
  }[];
  valuationMethod: string;
  trustScore: number;
  sources: string[];
  meta: {
    listingsFound: number;
    realListingsCount: number;
    exactVinMatch: boolean;
    fallbackUsed: boolean;
    processingTime: number;
    marketDataQuality: 'excellent' | 'good' | 'limited' | 'none';
  };
}

export async function calculateEnhancedValuation(input: EnhancedValuationInput): Promise<EnhancedValuationResult> {
  console.log('🚀 Enhanced Valuation Engine v3.1 - Starting calculation');
  console.log('Input:', { vin: input.vin, make: input.make, model: input.model, year: input.year, zipCode: input.zipCode });

  try {
    // Step 1: Unified Market Listings Search via Agent
    console.log('📊 Fetching market listings via unified search agent...');
    const marketListings = await searchMarketListings({
      vin: input.vin,
      make: input.make || '',
      model: input.model || '',
      year: input.year || new Date().getFullYear(),
      zipCode: input.zipCode,
      mileage: input.mileage,
      condition: input.condition
    });

    // Normalize all listings to ensure consistent field access
    const normalizedListings = marketListings.map(normalizeListing);
    
    console.log(`📈 Market listings found: ${normalizedListings.length}`);
    normalizedListings.forEach((listing, index) => {
      console.log(`  ${index + 1}. ${listing.source}: $${listing.price?.toLocaleString() || 'N/A'} (${getNormalizedSourceType(listing)})`);
    });

    // Check for exact VIN match
    const exactVinMatch = normalizedListings.some(l => l.vin === input.vin);
    const realListingsCount = normalizedListings.filter(l => getNormalizedSourceType(l) !== 'estimated' && l.source !== 'Market Estimate').length;

    // Step 2: Calculate base market value
    let baseMarketValue: number;
    let valuationMethod: string;
    let trustScore = 0.5;
    
    if (normalizedListings.length >= 3) {
      // Use market-based valuation
      const prices = normalizedListings.map(l => l.price).filter(p => p && p > 0);
      baseMarketValue = calculateMedianPrice(prices);
      valuationMethod = `market_median_${normalizedListings.length}_listings`;
      trustScore = Math.min(0.95, 0.7 + (realListingsCount * 0.05));
      console.log(`💰 Market-based valuation: $${baseMarketValue.toLocaleString()} (${prices.length} valid prices)`);
    } else {
      // Fallback to MSRP-based estimation
      console.log('⚠️ Insufficient market data - using MSRP fallback method');
      const year = input.year || new Date().getFullYear();
      const currentYear = new Date().getFullYear();
      const vehicleAge = Math.max(0, currentYear - year);
      
      // Enhanced MSRP estimation based on vehicle class
      let estimatedMSRP: number;
      const make = (input.make || '').toLowerCase();
      const model = (input.model || '').toLowerCase();
      
      // Vehicle class-based MSRP estimation
      if (model.includes('f-150') || model.includes('f150')) {
        estimatedMSRP = 45000 - (vehicleAge * 3000);
      } else if (model.includes('civic')) {
        estimatedMSRP = 28000 - (vehicleAge * 2000);
      } else if (model.includes('accord') || model.includes('camry')) {
        estimatedMSRP = 32000 - (vehicleAge * 2500);
      } else if (model.includes('altima') || model.includes('sentra')) {
        estimatedMSRP = 30000 - (vehicleAge * 2200);
      } else if (make.includes('luxury') || make.includes('bmw') || make.includes('mercedes') || make.includes('audi')) {
        estimatedMSRP = 55000 - (vehicleAge * 4000);
      } else {
        // Generic sedan/compact estimation
        estimatedMSRP = 28000 - (vehicleAge * 2000);
      }
      
      baseMarketValue = Math.max(estimatedMSRP * 0.4, 8000); // Floor at $8k
      valuationMethod = 'msrp_depreciation_fallback';
      trustScore = 0.35;
      console.log(`📉 MSRP-based estimation: $${baseMarketValue.toLocaleString()}`);
    }

    // Step 3: Apply condition and mileage adjustments
    let adjustedValue = baseMarketValue;
    const adjustments: ValuationAdjustment[] = [];
    
    // Mileage adjustment
    let mileagePenalty = 0;
    if (input.mileage && input.mileage > 0) {
      const year = input.year || new Date().getFullYear();
      const expectedMileage = (new Date().getFullYear() - year) * 12000;
      const mileageDiff = input.mileage - expectedMileage;
      
      if (mileageDiff > 10000) {
        mileagePenalty = Math.min(mileageDiff * 0.12, baseMarketValue * 0.15);
        adjustedValue -= mileagePenalty;
        adjustments.push({
          factor: 'High Mileage',
          impact: -mileagePenalty,
          description: `${input.mileage.toLocaleString()} miles (${(mileageDiff/1000).toFixed(0)}k over expected)`,
          percentAdjustment: -(mileagePenalty / baseMarketValue) * 100
        });
      } else if (mileageDiff < -5000) {
        const lowMileageBonus = Math.min(Math.abs(mileageDiff) * 0.08, baseMarketValue * 0.08);
        adjustedValue += lowMileageBonus;
        adjustments.push({
          factor: 'Low Mileage',
          impact: lowMileageBonus,
          description: `${input.mileage.toLocaleString()} miles (${Math.abs(mileageDiff/1000).toFixed(0)}k under expected)`,
          percentAdjustment: (lowMileageBonus / baseMarketValue) * 100
        });
      }
    }

    // Condition adjustment
    if (input.condition) {
      let conditionMultiplier = 1.0;
      let conditionDescription = '';
      
      switch (input.condition.toLowerCase()) {
        case 'excellent':
          conditionMultiplier = 1.12;
          conditionDescription = 'Excellent condition premium';
          break;
        case 'very good':
          conditionMultiplier = 1.06;
          conditionDescription = 'Very good condition adjustment';
          break;
        case 'good':
          conditionMultiplier = 1.0;
          conditionDescription = 'Good condition (baseline)';
          break;
        case 'fair':
          conditionMultiplier = 0.85;
          conditionDescription = 'Fair condition discount';
          break;
        case 'poor':
          conditionMultiplier = 0.65;
          conditionDescription = 'Poor condition significant discount';
          break;
      }
      
      if (conditionMultiplier !== 1.0) {
        const conditionAdjustment = (adjustedValue * conditionMultiplier) - adjustedValue;
        adjustedValue *= conditionMultiplier;
        adjustments.push({
          factor: 'Vehicle Condition',
          impact: conditionAdjustment,
          description: conditionDescription,
          percentAdjustment: (conditionMultiplier - 1) * 100
        });
      }
    }

    // Step 4: Calculate confidence score using unified engine
    const confidenceContext: ConfidenceContext = {
      exactVinMatch,
      marketListings: normalizedListings,
      sources: ['enhanced_valuation_engine', ...normalizedListings.map(l => l.source)],
      trustScore,
      mileagePenalty,
      zipCode: input.zipCode || ''
    };
    
    const confidenceScore = calculateUnifiedConfidence(confidenceContext);

    // Step 5: Build comprehensive result
    const result: EnhancedValuationResult = {
      estimatedValue: Math.round(adjustedValue),
      baseMarketValue: Math.round(baseMarketValue),
      adjustedValue: Math.round(adjustedValue),
      confidenceScore,
      priceRange: [
        Math.round(adjustedValue * 0.85),
        Math.round(adjustedValue * 1.15)
      ],
      adjustments,
      marketListings: normalizedListings.map(listing => ({
        id: listing.id || `listing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        price: listing.price,
        mileage: listing.mileage || 0,
        source: listing.source,
        sourceType: getNormalizedSourceType(listing),
        url: getNormalizedUrl(listing) || '#',
        listingUrl: getNormalizedUrl(listing) || '#',
        dealerName: listing.dealerName || listing.dealer_name || '',
        location: listing.location || input.zipCode || '',
        condition: listing.condition || 'used',
        isCpo: listing.isCpo || listing.is_cpo || false,
        fetchedAt: listing.fetchedAt || listing.fetched_at || new Date().toISOString()
      })),
      valuationMethod,
      trustScore,
      sources: ['enhanced_valuation_engine'],
      meta: {
        listingsFound: normalizedListings.length,
        realListingsCount,
        exactVinMatch,
        fallbackUsed: normalizedListings.length < 3,
        processingTime: Date.now(),
        marketDataQuality: realListingsCount >= 5 ? 'excellent' : realListingsCount >= 3 ? 'good' : realListingsCount >= 1 ? 'limited' : 'none'
      }
    };

    console.log('✅ Enhanced valuation completed:', {
      estimatedValue: result.estimatedValue,
      confidence: result.confidenceScore,
      method: result.valuationMethod,
      listingsUsed: result.marketListings.length,
      realListings: realListingsCount
    });

    return result;

  } catch (error) {
    console.error('❌ Enhanced valuation engine error:', error);
    throw new Error(`Valuation calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to calculate median price
function calculateMedianPrice(prices: number[]): number {
  const sortedPrices = [...prices].sort((a, b) => a - b);
  const mid = Math.floor(sortedPrices.length / 2);
  
  if (sortedPrices.length % 2 === 0) {
    return (sortedPrices[mid - 1] + sortedPrices[mid]) / 2;
  } else {
    return sortedPrices[mid];
  }
}
