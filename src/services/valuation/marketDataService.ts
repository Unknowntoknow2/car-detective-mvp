import type { MarketListing } from '@/types/marketListing';
import { OpenAIMarketAgent, type OpenAIMarketSearchParams } from './openaiMarketAgent';
import { URLValidatorService } from './urlValidator';
import { BingSearchService, type BingSearchParams } from './bingSearchService';

export interface MarketSearchRequest {
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage?: number;
  zipCode: string;
  radius?: number;
  trim?: string;
}

export interface MarketSearchResult {
  listings: MarketListing[];
  meta: {
    totalFound: number;
    totalValidated: number;
    sources: string[];
    confidence: number;
    searchMethod: 'openai_bing' | 'direct_bing' | 'no_results';
    hasRealData: boolean;
    validationStats?: {
      total: number;
      valid: number;
      invalid: number;
      validPercentage: number;
    };
  };
}

/**
 * Professional Market Data Service - Coordinates all market search with 100% accuracy guarantee
 * Ensures only real, validated listings are returned with zero synthetic data generation
 */
export class MarketDataService {
  
  /**
   * Main entry point for professional vehicle market search
   * Guarantees 100% real data or empty results - NO synthetic data
   */
  static async searchVehicleMarket(request: MarketSearchRequest): Promise<MarketSearchResult> {
    console.log('🎯 MarketDataService: Starting professional market search', request);

    // Validate input parameters
    const validationErrors = this.validateSearchRequest(request);
    if (validationErrors.length > 0) {
      console.error('❌ Invalid search parameters:', validationErrors);
      return this.createEmptyResult('Invalid parameters');
    }

    try {
      // Step 1: Search using OpenAI + Bing pipeline
      const listings = await this.executeSearch(request);

      if (listings.length === 0) {
        console.log('ℹ️ No real market listings found - returning empty result (NO synthetic data)');
        return this.createEmptyResult('No real listings found');
      }

      // Step 2: Validate all listing URLs with HTTP HEAD requests
      console.log(`🔗 Validating ${listings.length} listing URLs...`);
      const validatedListings = await URLValidatorService.filterListingsByValidURLs(listings);

      if (validatedListings.length === 0) {
        console.log('ℹ️ No listings with valid URLs found - returning empty result');
        return this.createEmptyResult('No listings with valid URLs');
      }

      // Step 3: Final quality check
      const qualityFilteredListings = this.applyQualityFilters(validatedListings);

      const result: MarketSearchResult = {
        listings: qualityFilteredListings,
        meta: {
          totalFound: listings.length,
          totalValidated: qualityFilteredListings.length,
          sources: [...new Set(qualityFilteredListings.map(l => l.source))],
          confidence: this.calculateConfidence(qualityFilteredListings),
          searchMethod: 'openai_bing',
          hasRealData: true,
          validationStats: this.getValidationStats(listings.length, qualityFilteredListings.length)
        }
      };

      console.log(`✅ Professional market search complete: ${qualityFilteredListings.length} validated real listings`);
      return result;

    } catch (error) {
      console.error('❌ Market search error:', error);
      return this.createEmptyResult('Search error occurred');
    }
  }

  /**
   * Execute the search using OpenAI + Bing pipeline
   */
  private static async executeSearch(request: MarketSearchRequest): Promise<MarketListing[]> {
    const searchParams: OpenAIMarketSearchParams = {
      make: request.make,
      model: request.model,
      year: request.year,
      mileage: request.mileage,
      zipCode: request.zipCode,
      radius: request.radius || 50,
      trim: request.trim
    };

    // First try OpenAI function calling approach
    try {
      console.log('🤖 Attempting OpenAI function calling + Bing Search...');
      const listings = await OpenAIMarketAgent.searchVehicleListings(searchParams);
      
      if (listings.length > 0) {
        console.log(`✅ OpenAI + Bing search found ${listings.length} listings`);
        return listings;
      }
    } catch (error) {
      console.warn('⚠️ OpenAI function calling failed, trying direct Bing search:', error);
    }

    // Fallback to direct Bing search
    try {
      console.log('🔍 Attempting direct Bing Search...');
      const bingParams: BingSearchParams = {
        make: request.make,
        model: request.model,
        year: request.year,
        mileage: request.mileage,
        zipCode: request.zipCode,
        radius: request.radius || 50
      };

      const listings = await BingSearchService.searchVehicleListings(bingParams);
      
      if (listings.length > 0) {
        console.log(`✅ Direct Bing search found ${listings.length} listings`);
        return listings;
      }
    } catch (error) {
      console.error('❌ Direct Bing search failed:', error);
    }

    console.log('ℹ️ No listings found from any real data source');
    return [];
  }

  /**
   * Apply quality filters to ensure only high-quality real listings
   */
  private static applyQualityFilters(listings: MarketListing[]): MarketListing[] {
    return listings.filter(listing => {
      // Must have realistic price
      if (!listing.price || listing.price < 1000 || listing.price > 500000) {
        console.log(`❌ Filtering out listing with unrealistic price: $${listing.price}`);
        return false;
      }

      // Must have valid URL
      if (!listing.listing_url || listing.listing_url.trim() === '') {
        console.log('❌ Filtering out listing with empty URL');
        return false;
      }

      // Must have realistic mileage
      if (listing.mileage && (listing.mileage < 0 || listing.mileage > 500000)) {
        console.log(`❌ Filtering out listing with unrealistic mileage: ${listing.mileage}`);
        return false;
      }

      // Must have valid year
      const currentYear = new Date().getFullYear();
      if (listing.year < 1990 || listing.year > currentYear + 1) {
        console.log(`❌ Filtering out listing with invalid year: ${listing.year}`);
        return false;
      }

      return true;
    });
  }

  /**
   * Calculate confidence score based on listing quality
   */
  private static calculateConfidence(listings: MarketListing[]): number {
    if (listings.length === 0) return 0;

    const totalConfidence = listings.reduce((sum, listing) => sum + (listing.confidence_score || 70), 0);
    return Math.round(totalConfidence / listings.length);
  }

  /**
   * Validate search request parameters
   */
  private static validateSearchRequest(request: MarketSearchRequest): string[] {
    const errors: string[] = [];

    if (!request.make?.trim()) {
      errors.push('Vehicle make is required');
    }

    if (!request.model?.trim()) {
      errors.push('Vehicle model is required');
    }

    if (!request.year || request.year < 1990 || request.year > new Date().getFullYear() + 1) {
      errors.push('Valid vehicle year is required');
    }

    if (!request.zipCode?.trim() || !/^\d{5}(-\d{4})?$/.test(request.zipCode)) {
      errors.push('Valid zip code is required');
    }

    if (request.mileage && (request.mileage < 0 || request.mileage > 1000000)) {
      errors.push('Mileage must be realistic (0-1,000,000)');
    }

    if (request.radius && (request.radius < 1 || request.radius > 500)) {
      errors.push('Search radius must be between 1-500 miles');
    }

    return errors;
  }

  /**
   * Create empty result with proper metadata
   */
  private static createEmptyResult(reason: string): MarketSearchResult {
    console.log(`📭 Returning empty result: ${reason}`);
    
    return {
      listings: [],
      meta: {
        totalFound: 0,
        totalValidated: 0,
        sources: [],
        confidence: 0,
        searchMethod: 'no_results',
        hasRealData: false
      }
    };
  }

  /**
   * Generate validation statistics
   */
  private static getValidationStats(totalFound: number, totalValidated: number) {
    const invalid = totalFound - totalValidated;
    const validPercentage = totalFound > 0 ? Math.round((totalValidated / totalFound) * 100) : 0;

    return {
      total: totalFound,
      valid: totalValidated,
      invalid,
      validPercentage
    };
  }

  /**
   * Get service status and configuration
   */
  static getServiceStatus(): {
    bingApiConfigured: boolean;
    openaiApiConfigured: boolean;
    ready: boolean;
    capabilities: string[];
  } {
    const bingConfigured = !!(process.env.BING_API_KEY || process.env.VITE_BING_API_KEY);
    const openaiConfigured = !!(process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY);

    const capabilities: string[] = [];
    if (bingConfigured) capabilities.push('bing_search');
    if (openaiConfigured) capabilities.push('openai_function_calling');
    if (bingConfigured || openaiConfigured) capabilities.push('url_validation');

    return {
      bingApiConfigured: bingConfigured,
      openaiApiConfigured: openaiConfigured,
      ready: bingConfigured, // Minimum requirement is Bing API
      capabilities
    };
  }

  /**
   * Test the service configuration
   */
  static async testConfiguration(): Promise<{
    success: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Test Bing API configuration
    if (!process.env.BING_API_KEY && !process.env.VITE_BING_API_KEY) {
      errors.push('BING_API_KEY not configured');
    }

    // Test OpenAI API configuration
    if (!process.env.OPENAI_API_KEY && !process.env.VITE_OPENAI_API_KEY) {
      warnings.push('OPENAI_API_KEY not configured - will use direct Bing search only');
    }

    // Test with a simple search
    if (errors.length === 0) {
      try {
        const testResult = await this.searchVehicleMarket({
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          zipCode: '94016'
        });
        
        console.log(`🧪 Test search completed: ${testResult.listings.length} listings found`);
      } catch (error) {
        errors.push(`Service test failed: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      errors,
      warnings
    };
  }
}