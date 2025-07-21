
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EnhancedMarketListing {
  id: string;
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  trim?: string;
  price: number;
  mileage?: number;
  location?: string;
  condition?: string;
  source: string;
  source_type: string;
  listing_url: string;
  dealer_name?: string;
  is_cpo?: boolean;
  confidence_score?: number;
  fetched_at: string;
  title_status?: string;
  zip_code?: string;
  raw_data?: any;
  photos?: string[];
  features?: any;
  geo_distance_miles?: number;
  days_listed?: number;
  is_validated?: boolean;
  validation_errors?: string[];
}

export interface EnhancedMarketListingFilters {
  make?: string;
  model?: string;
  year?: number;
  zipCode?: string;
  maxDistance?: number;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  maxResults?: number;
  vin?: string;
}

export class EnhancedMarketListingService {
  /**
   * Fetch real market listings from the market_listings table
   */
  static async fetchRealMarketListings(filters: EnhancedMarketListingFilters): Promise<EnhancedMarketListing[]> {
    try {
      console.log('🔍 Fetching real market listings with filters:', filters);

      let query = supabase
        .from('market_listings')
        .select('*')
        .order('fetched_at', { ascending: false });

      // Apply filters
      if (filters.make) {
        query = query.ilike('make', `%${filters.make}%`);
      }
      if (filters.model) {
        query = query.ilike('model', `%${filters.model}%`);
      }
      if (filters.year) {
        query = query.eq('year', filters.year);
      }
      if (filters.zipCode) {
        query = query.eq('zip_code', filters.zipCode);
      }
      if (filters.condition) {
        query = query.eq('condition', filters.condition);
      }
      if (filters.vin) {
        query = query.eq('vin', filters.vin);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      // Limit results
      const limit = filters.maxResults || 20;
      query = query.limit(limit);

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching market listings:', error);
        toast.error('Failed to fetch market listings');
        return [];
      }

      if (!data || data.length === 0) {
        console.log('📭 No market listings found with current filters');
        return [];
      }

      // Transform data to EnhancedMarketListing format
      const transformedListings: EnhancedMarketListing[] = data.map(listing => ({
        id: listing.id,
        vin: listing.vin,
        make: listing.make,
        model: listing.model,
        year: listing.year,
        trim: listing.trim,
        price: listing.price,
        mileage: listing.mileage,
        location: listing.location,
        condition: listing.condition || 'used',
        source: listing.source,
        source_type: listing.source_type,
        listing_url: listing.listing_url,
        dealer_name: listing.dealer_name,
        is_cpo: listing.is_cpo || false,
        confidence_score: listing.confidence_score || 85,
        fetched_at: listing.fetched_at,
        title_status: listing.title_status || 'clean',
        zip_code: listing.zip_code,
        raw_data: listing.raw_data,
        photos: listing.photos || [],
        features: listing.features || {},
        geo_distance_miles: listing.geo_distance_miles,
        days_listed: listing.days_listed,
        is_validated: listing.is_validated || false,
        validation_errors: listing.validation_errors || []
      }));

      console.log(`✅ Successfully fetched ${transformedListings.length} real market listings`);
      return transformedListings;

    } catch (error) {
      console.error('❌ Critical error fetching real market listings:', error);
      toast.error('Failed to fetch market data');
      return [];
    }
  }

  /**
   * Search for similar vehicles in the market
   */
  static async searchSimilarVehicles(filters: EnhancedMarketListingFilters): Promise<EnhancedMarketListing[]> {
    console.log('🔍 Searching for similar vehicles...');
    
    // First try exact match
    const exactMatch = await this.fetchRealMarketListings(filters);
    if (exactMatch.length > 0) {
      console.log(`✅ Found ${exactMatch.length} exact matches`);
      return exactMatch;
    }

    // If no exact match, try broader search
    const broaderFilters = {
      ...filters,
      year: undefined, // Remove year filter for broader search
      maxResults: filters.maxResults || 50
    };

    const broaderResults = await this.fetchRealMarketListings(broaderFilters);
    
    // Filter by year range if original year was specified
    if (filters.year && broaderResults.length > 0) {
      const yearRange = 2; // +/- 2 years
      const filteredByYear = broaderResults.filter(listing => 
        listing.year && 
        Math.abs(listing.year - filters.year!) <= yearRange
      );
      
      console.log(`✅ Found ${filteredByYear.length} similar vehicles within ${yearRange} years`);
      return filteredByYear;
    }

    console.log(`✅ Found ${broaderResults.length} similar vehicles`);
    return broaderResults;
  }

  /**
   * Get market summary statistics
   */
  static async getMarketSummary(filters: EnhancedMarketListingFilters): Promise<{
    averagePrice: number;
    medianPrice: number;
    priceRange: { min: number; max: number };
    totalListings: number;
    averageMileage: number;
    mostCommonCondition: string;
  }> {
    const listings = await this.fetchRealMarketListings(filters);
    
    if (listings.length === 0) {
      return {
        averagePrice: 0,
        medianPrice: 0,
        priceRange: { min: 0, max: 0 },
        totalListings: 0,
        averageMileage: 0,
        mostCommonCondition: 'unknown'
      };
    }

    const prices = listings.map(l => l.price).filter(p => p > 0);
    const mileages = listings.map(l => l.mileage).filter(m => m && m > 0);
    const conditions = listings.map(l => l.condition).filter(c => c);

    // Calculate statistics
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const sortedPrices = prices.sort((a, b) => a - b);
    const medianPrice = sortedPrices[Math.floor(sortedPrices.length / 2)];
    const averageMileage = mileages.reduce((sum, mileage) => sum + mileage!, 0) / mileages.length;
    
    // Find most common condition
    const conditionCounts = conditions.reduce((acc, condition) => {
      acc[condition!] = (acc[condition!] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonCondition = Object.entries(conditionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'unknown';

    return {
      averagePrice: Math.round(averagePrice),
      medianPrice: Math.round(medianPrice),
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      totalListings: listings.length,
      averageMileage: Math.round(averageMileage),
      mostCommonCondition
    };
  }

  /**
   * Validate and clean market listing data
   */
  static validateListing(listing: any): boolean {
    const requiredFields = ['price', 'source', 'listing_url'];
    const hasRequiredFields = requiredFields.every(field => 
      listing[field] !== null && listing[field] !== undefined && listing[field] !== ''
    );

    if (!hasRequiredFields) {
      console.warn('⚠️ Listing missing required fields:', listing);
      return false;
    }

    // Validate price range
    if (listing.price < 1000 || listing.price > 200000) {
      console.warn('⚠️ Listing price out of range:', listing.price);
      return false;
    }

    // Validate mileage if present
    if (listing.mileage && (listing.mileage < 0 || listing.mileage > 500000)) {
      console.warn('⚠️ Listing mileage out of range:', listing.mileage);
      return false;
    }

    return true;
  }

  /**
   * Get cached listings for performance
   */
  static async getCachedListings(filters: EnhancedMarketListingFilters): Promise<EnhancedMarketListing[]> {
    const cacheKey = JSON.stringify(filters);
    const cachedData = sessionStorage.getItem(`market_listings_${cacheKey}`);
    
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        const cacheTime = new Date(parsed.timestamp);
        const now = new Date();
        const cacheAgeMinutes = (now.getTime() - cacheTime.getTime()) / (1000 * 60);
        
        // Cache for 5 minutes
        if (cacheAgeMinutes < 5) {
          console.log('📦 Using cached market listings');
          return parsed.data;
        }
      } catch (error) {
        console.warn('⚠️ Failed to parse cached listings:', error);
      }
    }

    // Fetch fresh data
    const freshData = await this.fetchRealMarketListings(filters);
    
    // Cache the result
    try {
      sessionStorage.setItem(`market_listings_${cacheKey}`, JSON.stringify({
        data: freshData,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.warn('⚠️ Failed to cache listings:', error);
    }
    
    return freshData;
  }
}
