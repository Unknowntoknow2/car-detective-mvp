import { fetchMarketComps } from './marketSearchAgent';
import type { MarketListing } from '@/types/marketListing';

export interface EnhancedValuationResult {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  zipcode?: string;
  
  // Market listing data
  marketListings: MarketListing[];
  marketListingsCount: number;
  
  // Valuation metrics
  estimatedValue: number;
  confidence_score: number;
  isUsingFallbackMethod: boolean;
  
  // Processing metadata
  processedAt: string;
  dataSources: string[];
  
  // Backward compatibility
  error?: string;
  warnings?: string[];
}

export interface ValuationInput {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  zipcode?: string;
  radiusMiles?: number;
}

/**
 * Main valuation engine that processes vehicle data and returns comprehensive results
 * with real market listings integrated via marketSearchAgent.
 */
export async function processValuation(input: ValuationInput): Promise<EnhancedValuationResult> {
  const startTime = Date.now();
  console.log(`[valuationEngine] Processing valuation for: ${input.year} ${input.make} ${input.model}`);

  try {
    // Fetch real market listings using the marketSearchAgent
    const marketSearchResult = await fetchMarketComps({
      vin: input.vin,
      make: input.make,
      model: input.model,
      year: input.year,
      zipCode: input.zipcode || '10001', // Default fallback zip
      radiusMiles: input.radiusMiles || 50
    });

    const marketListings = marketSearchResult.listings || [];

    // Calculate estimated value from market listings
    const validPrices = marketListings
      .map((listing: MarketListing) => listing.price)
      .filter((price: number) => price && price > 0);
    
    const estimatedValue = validPrices.length > 0 
      ? Math.round(validPrices.reduce((sum: number, price: number) => sum + price, 0) / validPrices.length)
      : 0;

    // Calculate confidence score based on listing quality and quantity
    const confidence_score = calculateConfidenceScore(marketListings);
    
    // Determine if we're using fallback method
    const isUsingFallbackMethod = !marketSearchResult.success || marketListings.length === 0;
    
    const result: EnhancedValuationResult = {
      vin: input.vin,
      year: input.year,
      make: input.make,
      model: input.model,
      trim: input.trim,
      mileage: input.mileage,
      zipcode: input.zipcode,
      
      marketListings,
      marketListingsCount: marketListings.length,
      
      estimatedValue,
      confidence_score,
      isUsingFallbackMethod,
      
      processedAt: new Date().toISOString(),
      dataSources: marketSearchResult.sources || ['fallback'],
      
      warnings: isUsingFallbackMethod ? ['No market listings found - using fallback valuation'] : undefined,
      error: marketSearchResult.errors?.join('; ')
    };

    const processingTime = Date.now() - startTime;
    console.log(`[valuationEngine] Completed in ${processingTime}ms: ${marketListings.length} listings, confidence: ${confidence_score}%`);
    
    return result;

  } catch (error) {
    console.error('[valuationEngine] Processing failed:', error);
    
    // Return fallback result on error
    return {
      vin: input.vin,
      year: input.year,
      make: input.make,
      model: input.model,
      trim: input.trim,
      mileage: input.mileage,
      zipcode: input.zipcode,
      
      marketListings: [],
      marketListingsCount: 0,
      
      estimatedValue: 0,
      confidence_score: 0,
      isUsingFallbackMethod: true,
      
      processedAt: new Date().toISOString(),
      dataSources: ['fallback'],
      
      error: error instanceof Error ? error.message : 'Unknown valuation error'
    };
  }
}

/**
 * Calculate confidence score based on market listing data
 */
function calculateConfidenceScore(listings: MarketListing[]): number {
  if (listings.length === 0) return 0;
  
  // Base score from listing count (max 50 points)
  const countScore = Math.min(50, listings.length * 5);
  
  // Quality score from listing completeness (max 30 points)
  const qualityScore = listings.reduce((score, listing) => {
    let itemScore = 0;
    if (listing.price && listing.price > 0) itemScore += 10;
    if (listing.mileage && listing.mileage > 0) itemScore += 5;
    if (listing.listing_url || listing.listingUrl) itemScore += 5;
    if (listing.location) itemScore += 5;
    if (listing.source) itemScore += 5;
    return score + Math.min(30, itemScore);
  }, 0) / listings.length;
  
  // Source diversity bonus (max 20 points)
  const uniqueSources = new Set(listings.map(l => l.source)).size;
  const diversityScore = Math.min(20, uniqueSources * 10);
  
  return Math.min(100, Math.round(countScore + qualityScore + diversityScore));
}

// Legacy compatibility export
export const runValuation = processValuation;