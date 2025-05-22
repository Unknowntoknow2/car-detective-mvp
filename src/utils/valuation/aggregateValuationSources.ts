
import { useMarketInsights } from '@/hooks/useMarketInsights';
import { getMileageAdjustment } from '@/utils/adjustments/mileageAdjustments';
import { getZipAdjustment, getRegionNameFromZip } from '@/utils/adjustments/locationAdjustments';

interface AggregatedValuationSource {
  averagePrices: {
    retail: number;
    auction: number;
    private: number;
    overall: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
  normalizedValue: number; // Value adjusted for mileage and location
  marketVelocity: 'slow' | 'moderate' | 'fast';
  demandScore: number; // 1-10 scale
  regionName: string;
  zipAdjustment: number;
  mileageAdjustment: number;
  topComps: Array<{
    title: string;
    price: number;
    source: string;
    mileage?: number;
    url?: string;
    distance?: number;
  }>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Aggregates valuation sources including auctions and marketplace listings
 * @param vin Vehicle Identification Number
 * @param zipCode ZIP code for location adjustments
 * @param mileage Vehicle mileage
 * @param condition Vehicle condition
 * @param make Vehicle make
 * @param model Vehicle model
 * @param year Vehicle year
 * @returns Aggregated valuation data
 */
export async function aggregateValuationSources(
  vin: string,
  zipCode: string,
  mileage: number,
  condition: string,
  make: string,
  model: string,
  year: number,
  basePrice: number
): Promise<AggregatedValuationSource> {
  // This function would normally make a single API call to our unified
  // valuation engine, but for now we'll use the existing hooks and utilities
  
  // Get market insights (listings + auctions)
  const marketInsights = await fetchMarketInsights(vin, make, model, year);
  
  // Calculate mileage adjustment
  const mileageAdjustment = getMileageAdjustment(mileage, basePrice);
  
  // Calculate ZIP code adjustment
  const zipAdjustment = await getZipAdjustment(zipCode, basePrice);
  
  // Get region name for display
  const regionName = getRegionNameFromZip(zipCode);
  
  // Calculate normalized value based on adjustments
  const normalizedValue = basePrice + mileageAdjustment + zipAdjustment;
  
  // Determine market velocity based on average time on market
  // This would normally come from market data, but we'll use a heuristic for now
  const marketVelocity = determineMarketVelocity(marketInsights, zipCode);
  
  // Calculate demand score
  const demandScore = calculateDemandScore(marketInsights, zipCode);
  
  // Get top comparables
  const topComps = getTopComparables(marketInsights, mileage, zipCode);
  
  // Calculate overall average price
  const retailWeight = 0.5;
  const auctionWeight = 0.3;
  const privateWeight = 0.2;
  
  const { retail, auction, private: privatePrice } = marketInsights.averagePrices;
  
  const overallAverage = 
    (retail * retailWeight) + 
    (auction * auctionWeight) + 
    (privatePrice * privateWeight);
  
  return {
    averagePrices: {
      ...marketInsights.averagePrices,
      overall: Math.round(overallAverage)
    },
    priceRange: marketInsights.priceRange,
    normalizedValue,
    marketVelocity,
    demandScore,
    regionName,
    zipAdjustment,
    mileageAdjustment,
    topComps,
    isLoading: marketInsights.isLoading,
    error: marketInsights.error
  };
}

/**
 * Fetches market insights using the existing hook logic
 * In a real implementation, this would be a direct API call
 */
async function fetchMarketInsights(vin: string, make: string, model: string, year: number) {
  // This would normally be a hook, but for direct use we'll make a fetch call
  // to our edge function
  
  try {
    const response = await fetch('https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch-market-intelligence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vin,
        make,
        model,
        year
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch market intelligence');
    }
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching market insights:', error);
    // Return default structure with error
    return {
      listings: [],
      auctions: [],
      averagePrices: { retail: 0, auction: 0, private: 0 },
      priceRange: { min: 0, max: 0 },
      isLoading: false,
      error: error.message || 'Failed to fetch market insights'
    };
  }
}

/**
 * Determines market velocity based on market data
 */
function determineMarketVelocity(marketInsights: any, zipCode: string): 'slow' | 'moderate' | 'fast' {
  // This would normally be calculated based on days-on-market data
  // For now, we'll use the ratio of listings to a threshold
  
  const listingCount = marketInsights.listings.length;
  
  if (listingCount >= 10) return 'fast';
  if (listingCount >= 5) return 'moderate';
  return 'slow';
}

/**
 * Calculates demand score on a scale of 1-10
 */
function calculateDemandScore(marketInsights: any, zipCode: string): number {
  // This would normally use a complex formula based on:
  // - Days on market
  // - Listing volume vs. sales volume
  // - Price stability
  // For now, we'll use a simple heuristic
  
  const listingCount = marketInsights.listings.length;
  const auctionCount = marketInsights.auctions.length;
  
  // More activity = higher demand (simplified)
  const activityScore = Math.min(10, (listingCount + auctionCount) / 3);
  
  return Math.round(activityScore);
}

/**
 * Gets top comparable vehicles sorted by relevance
 */
function getTopComparables(marketInsights: any, targetMileage: number, targetZipCode: string) {
  // Combine listings and format auctions for comparison
  const allComps = [
    ...marketInsights.listings.map((l: any) => ({
      title: `${l.year} ${l.make} ${l.model}`,
      price: l.price,
      source: l.source,
      mileage: l.mileage,
      url: l.url,
      distance: 0 // Would normally calculate distance based on ZIP
    })),
    ...marketInsights.auctions.map((a: any) => ({
      title: `${a.year || 'Unknown'} ${a.make || 'Unknown'} ${a.model || 'Unknown'}`,
      price: parseFloat(a.price),
      source: a.source,
      mileage: parseInt(a.odometer, 10),
      url: '', // Auctions typically don't have public URLs
      distance: 0
    }))
  ];
  
  // Score comps by similarity to target vehicle
  const scoredComps = allComps.map(comp => {
    // Calculate mileage difference (as percentage)
    const mileageDiff = comp.mileage ? 
      Math.abs(comp.mileage - targetMileage) / targetMileage : 
      1; // Max difference if mileage unknown
    
    // Calculate similarity score (lower is better)
    const similarityScore = mileageDiff;
    
    return {
      ...comp,
      similarityScore
    };
  });
  
  // Sort by similarity and return top 5
  return scoredComps
    .sort((a, b) => a.similarityScore - b.similarityScore)
    .slice(0, 5)
    .map(({ similarityScore, ...comp }) => comp); // Remove the score from returned data
}
