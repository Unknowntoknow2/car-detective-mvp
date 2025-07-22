
import { supabase } from "@/integrations/supabase/client";
import { EnhancedMarketListingService, type EnhancedMarketListing } from "./enhancedMarketListingService";
import { toast } from "sonner";

export interface MarketDataResult {
  listings: EnhancedMarketListing[];
  averagePrice: number;
  confidenceScore: number;
  dataSource: string;
  searchStrategy: string;
}

export interface MarketDataFilters {
  make: string;
  model: string;
  year: number;
  zipCode: string;
  vin?: string;
  maxDistance?: number;
  condition?: string;
}

/**
 * Enhanced market data service that fetches real listings from the database
 */
export class MarketDataService {
  
  /**
   * Fetch comprehensive market data for a vehicle
   */
  static async fetchMarketData(filters: MarketDataFilters): Promise<MarketDataResult> {
    try {
      console.log('🏪 Fetching market data with filters:', filters);

      // Try to fetch exact matches first
      const exactListings = await EnhancedMarketListingService.fetchRealMarketListings({
        make: filters.make,
        model: filters.model,
        year: filters.year,
        zipCode: filters.zipCode,
        vin: filters.vin,
        maxResults: 20
      });

      if (exactListings.length > 0) {
        console.log(`✅ Found ${exactListings.length} exact market matches`);
        return this.processMarketData(exactListings, 'exact_match');
      }

      // If no exact matches, try similar vehicles
      const similarListings = await EnhancedMarketListingService.searchSimilarVehicles({
        make: filters.make,
        model: filters.model,
        year: filters.year,
        zipCode: filters.zipCode,
        maxResults: 30
      });

      if (similarListings.length > 0) {
        console.log(`✅ Found ${similarListings.length} similar market listings`);
        return this.processMarketData(similarListings, 'similar_vehicles');
      }

      // If still no matches, try broader search
      const broaderListings = await EnhancedMarketListingService.fetchRealMarketListings({
        make: filters.make,
        maxResults: 50
      });

      if (broaderListings.length > 0) {
        console.log(`✅ Found ${broaderListings.length} broader market listings`);
        return this.processMarketData(broaderListings, 'broader_search');
      }

      // No real data found
      console.log('📭 No market data found, returning empty result');
      return {
        listings: [],
        averagePrice: 0,
        confidenceScore: 0,
        dataSource: 'no_data',
        searchStrategy: 'none'
      };

    } catch (error) {
      console.error('❌ Error fetching market data:', error);
      toast.error('Failed to fetch market data');
      return {
        listings: [],
        averagePrice: 0,
        confidenceScore: 0,
        dataSource: 'error',
        searchStrategy: 'failed'
      };
    }
  }

  /**
   * Process raw market listings into structured data
   */
  private static processMarketData(listings: EnhancedMarketListing[], strategy: string): MarketDataResult {
    // Filter out invalid listings
    const validListings = listings.filter(listing => 
      EnhancedMarketListingService.validateListing(listing)
    );

    if (validListings.length === 0) {
      return {
        listings: [],
        averagePrice: 0,
        confidenceScore: 0,
        dataSource: 'invalid_data',
        searchStrategy: strategy
      };
    }

    // Calculate average price
    const prices = validListings.map(l => l.price);
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    // Calculate confidence score based on data quality
    let confidenceScore = 50; // Base confidence

    // Boost confidence for more listings
    if (validListings.length >= 10) confidenceScore += 20;
    else if (validListings.length >= 5) confidenceScore += 10;
    else if (validListings.length >= 2) confidenceScore += 5;

    // Boost confidence for exact matches
    if (strategy === 'exact_match') confidenceScore += 20;
    else if (strategy === 'similar_vehicles') confidenceScore += 10;

    // Boost confidence for recent listings
    const recentListings = validListings.filter(listing => {
      const listingDate = new Date(listing.fetched_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return listingDate > thirtyDaysAgo;
    });

    if (recentListings.length > validListings.length * 0.7) {
      confidenceScore += 15;
    }

    // Cap confidence at 95%
    confidenceScore = Math.min(confidenceScore, 95);

    console.log(`📊 Processed ${validListings.length} valid listings, average price: $${Math.round(averagePrice)}, confidence: ${confidenceScore}%`);

    return {
      listings: validListings,
      averagePrice: Math.round(averagePrice),
      confidenceScore,
      dataSource: 'market_listings_db',
      searchStrategy: strategy
    };
  }

  /**
   * Get market summary for a specific vehicle
   */
  static async getMarketSummary(filters: MarketDataFilters) {
    const marketData = await this.fetchMarketData(filters);
    
    if (marketData.listings.length === 0) {
      return {
        totalListings: 0,
        averagePrice: 0,
        medianPrice: 0,
        priceRange: { min: 0, max: 0 },
        confidence: 0,
        dataSource: marketData.dataSource
      };
    }

    const prices = marketData.listings.map(l => l.price);
    const sortedPrices = prices.sort((a, b) => a - b);
    const medianPrice = prices.length > 0 ? sortedPrices[Math.floor(sortedPrices.length / 2)] : 0;

    return {
      totalListings: marketData.listings.length,
      averagePrice: marketData.averagePrice,
      medianPrice: Math.round(medianPrice),
      priceRange: prices.length > 0 ? {
        min: Math.min(...prices),
        max: Math.max(...prices)
      } : { min: 0, max: 0 },
      confidence: marketData.confidenceScore,
      dataSource: marketData.dataSource
    };
  }
}
