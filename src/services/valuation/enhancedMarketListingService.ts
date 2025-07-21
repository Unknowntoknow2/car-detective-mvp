import { supabase } from "@/integrations/supabase/client";

export interface EnhancedMarketListing {
  id?: string;
  vin?: string;
  valuation_request_id?: string;
  source: string;
  source_type: string;
  listing_url: string;
  price: number;
  mileage?: number;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  condition?: string;
  title_status?: string;
  location?: string;
  zip_code?: string;
  dealer_name?: string;
  is_cpo?: boolean;
  days_listed?: number;
  confidence_score?: number;
  geo_distance_miles?: number;
  listing_date?: string;
  fetched_at?: string;
  features?: Record<string, any>;
  photos?: string[];
  raw_data?: Record<string, any>;
  is_validated?: boolean;
  validation_errors?: string[];
}

export interface MarketSearchParams {
  vin?: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  zipCode: string;
  radius?: number;
  maxResults?: number;
}

export interface VinEnrichmentData {
  vin: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  fuel_type?: string;
  body_type?: string;
  msrp?: number;
  title_status?: string;
  title_history?: any[];
  accident_history?: any[];
  confidence_score?: number;
  data_sources?: string[];
}

export class EnhancedMarketListingService {
  /**
   * Fetch real market listings using multiple sources
   */
  static async fetchRealMarketListings(params: MarketSearchParams): Promise<EnhancedMarketListing[]> {
    try {
      console.log('Fetching real market listings with params:', params);
      
      // First, try VIN-specific search if VIN is provided
      if (params.vin) {
        const vinListings = await this.searchByVin(params.vin);
        if (vinListings.length > 0) {
          console.log(`Found ${vinListings.length} VIN-specific listings`);
          return vinListings;
        }
      }

      // Fallback to make/model/year search
      const generalListings = await this.searchByMakeModelYear(params);
      console.log(`Found ${generalListings.length} general listings`);
      
      return generalListings;
    } catch (error) {
      console.error('Error fetching real market listings:', error);
      return [];
    }
  }

  /**
   * Search for listings by VIN using multiple sources
   */
  private static async searchByVin(vin: string): Promise<EnhancedMarketListing[]> {
    const listings: EnhancedMarketListing[] = [];

    try {
      // Search existing listings first
      const { data: existingListings } = await supabase
        .from('enhanced_market_listings')
        .select('*')
        .eq('vin', vin)
        .gte('fetched_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .order('fetched_at', { ascending: false });

      if (existingListings && existingListings.length > 0) {
        console.log(`Found ${existingListings.length} cached VIN listings`);
        return existingListings as EnhancedMarketListing[];
      }

      // Call edge functions to fetch fresh data
      const sources = ['fetch-marketplace-data', 'openai-web-search'];
      
      for (const source of sources) {
        try {
          const { data, error } = await supabase.functions.invoke(source, {
            body: { 
              searchType: 'vin',
              vin: vin,
              includeUrl: true 
            }
          });

          if (error) {
            console.error(`Error from ${source}:`, error);
            continue;
          }

          if (data?.listings) {
            const sourceListings = this.parseListings(data.listings, source);
            listings.push(...sourceListings);
          }
        } catch (error) {
          console.error(`Failed to call ${source}:`, error);
        }
      }

      // Save new listings to database
      if (listings.length > 0) {
        await this.saveListings(listings);
      }

      return listings;
    } catch (error) {
      console.error('Error in VIN search:', error);
      return [];
    }
  }

  /**
   * Search for listings by make/model/year
   */
  private static async searchByMakeModelYear(params: MarketSearchParams): Promise<EnhancedMarketListing[]> {
    const listings: EnhancedMarketListing[] = [];

    try {
      // Check for recent cached results first
      const { data: cachedListings } = await supabase
        .from('enhanced_market_listings')
        .select('*')
        .eq('make', params.make)
        .eq('model', params.model)
        .eq('year', params.year)
        .gte('fetched_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
        .order('confidence_score', { ascending: false })
        .limit(params.maxResults || 20);

      if (cachedListings && cachedListings.length >= 5) {
        console.log(`Using ${cachedListings.length} cached listings`);
        return cachedListings as EnhancedMarketListing[];
      }

      // Fetch fresh data from multiple sources
      const searchQueries = [
        `${params.year} ${params.make} ${params.model} for sale near ${params.zipCode}`,
        `${params.year} ${params.make} ${params.model} used cars ${params.zipCode}`,
        `${params.make} ${params.model} ${params.year} CarGurus AutoTrader Cars.com`
      ];

      for (const query of searchQueries) {
        try {
          const { data, error } = await supabase.functions.invoke('openai-web-search', {
            body: { 
              query,
              zipCode: params.zipCode,
              make: params.make,
              model: params.model,
              year: params.year,
              includeListings: true
            }
          });

          if (error) {
            console.error('Error from openai-web-search:', error);
            continue;
          }

          if (data?.listings) {
            const sourceListings = this.parseListings(data.listings, 'web-search');
            listings.push(...sourceListings);
          }
        } catch (error) {
          console.error('Failed to call openai-web-search:', error);
        }
      }

      // Filter and validate listings
      const validListings = this.filterAndValidateListings(listings, params);
      
      // Save new listings
      if (validListings.length > 0) {
        await this.saveListings(validListings);
      }

      return validListings.slice(0, params.maxResults || 20);
    } catch (error) {
      console.error('Error in make/model/year search:', error);
      return [];
    }
  }

  /**
   * Parse listings from API response
   */
  private static parseListings(listings: any[], source: string): EnhancedMarketListing[] {
    return listings.map(listing => ({
      source: listing.source || source,
      source_type: 'marketplace',
      listing_url: listing.url || listing.listing_url || `https://example.com/listing-${Date.now()}`,
      price: parseFloat(listing.price?.toString().replace(/[^0-9.]/g, '') || '0'),
      mileage: listing.mileage ? parseInt(listing.mileage.toString().replace(/[^0-9]/g, '')) : undefined,
      year: listing.year || undefined,
      make: listing.make || undefined,
      model: listing.model || undefined,
      trim: listing.trim || undefined,
      condition: listing.condition || 'used',
      title_status: listing.title_status || 'unknown',
      location: listing.location || undefined,
      zip_code: listing.zip_code || undefined,
      dealer_name: listing.dealer_name || listing.dealer || undefined,
      confidence_score: listing.confidence_score || 75,
      geo_distance_miles: listing.distance || undefined,
      listing_date: listing.listing_date || undefined,
      features: listing.features || {},
      photos: listing.photos || [],
      raw_data: listing,
      vin: listing.vin || undefined
    }));
  }

  /**
   * Filter and validate listings for quality
   */
  private static filterAndValidateListings(
    listings: EnhancedMarketListing[], 
    params: MarketSearchParams
  ): EnhancedMarketListing[] {
    return listings.filter(listing => {
      // Price validation
      if (!listing.price || listing.price < 1000 || listing.price > 200000) {
        return false;
      }

      // Mileage validation (if provided)
      if (params.mileage && listing.mileage) {
        const mileageDiff = Math.abs(listing.mileage - params.mileage);
        const mileageRange = params.mileage * 0.3; // 30% range
        if (mileageDiff > mileageRange && mileageDiff > 20000) {
          return false;
        }
      }

      // URL validation
      if (!listing.listing_url || !listing.listing_url.startsWith('http')) {
        return false;
      }

      return true;
    }).sort((a, b) => (b.confidence_score || 0) - (a.confidence_score || 0));
  }

  /**
   * Save listings to database
   */
  private static async saveListings(listings: EnhancedMarketListing[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('enhanced_market_listings')
        .insert(listings);

      if (error) {
        console.error('Error saving listings:', error);
      } else {
        console.log(`Saved ${listings.length} listings to database`);
      }
    } catch (error) {
      console.error('Error in saveListings:', error);
    }
  }

  /**
   * Get VIN enrichment data
   */
  static async getVinEnrichment(vin: string): Promise<VinEnrichmentData | null> {
    try {
      // Check cache first
      const { data: cached } = await supabase
        .from('vin_enrichment_data')
        .select('*')
        .eq('vin', vin)
        .gte('last_updated', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // 30 days
        .single();

      if (cached) {
        return cached as VinEnrichmentData;
      }

      // Fetch fresh enrichment data
      const { data, error } = await supabase.functions.invoke('vin-enrichment-processor', {
        body: { vin }
      });

      if (error || !data) {
        console.error('Error fetching VIN enrichment:', error);
        return null;
      }

      // Save to cache
      const enrichmentData: VinEnrichmentData = {
        vin,
        ...data,
        data_sources: ['vin-enrichment-processor']
      };

      await supabase
        .from('vin_enrichment_data')
        .upsert(enrichmentData);

      return enrichmentData;
    } catch (error) {
      console.error('Error in getVinEnrichment:', error);
      return null;
    }
  }

  /**
   * Calculate title adjustment
   */
  static async getTitleAdjustment(titleStatus: string, baseValue: number): Promise<number> {
    try {
      const { data } = await supabase.rpc('get_title_adjustment', {
        title_status: titleStatus.toLowerCase(),
        base_value: baseValue
      });

      return data || 0;
    } catch (error) {
      console.error('Error calculating title adjustment:', error);
      return 0;
    }
  }

  /**
   * Audit market search for compliance
   */
  static async auditMarketSearch(params: {
    valuation_request_id?: string;
    vin?: string;
    search_type: string;
    search_params: Record<string, any>;
    listings_found: number;
    listings_validated: number;
    data_sources_used: string[];
    search_status: string;
    error_message?: string;
  }): Promise<void> {
    try {
      await supabase
        .from('market_search_audit')
        .insert({
          ...params,
          search_params: params.search_params,
          data_sources_used: params.data_sources_used
        });
    } catch (error) {
      console.error('Error auditing market search:', error);
    }
  }
}