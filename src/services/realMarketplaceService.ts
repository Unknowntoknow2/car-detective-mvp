import { supabase } from "@/integrations/supabase/client";
import type { MarketListing } from "@/types/marketListing";

export interface RealMarketplaceParams {
  vin?: string;
  make: string;
  model: string;
  year: number;
  zipCode: string;
  maxResults?: number;
}

/**
 * Service for fetching REAL marketplace data (not AI-generated)
 */
export class RealMarketplaceService {
  
  /**
   * Fetch real market listings from scraped/verified sources only
   */
  static async fetchRealListings(params: RealMarketplaceParams): Promise<MarketListing[]> {
    
    try {
      // 1. First try to get verified scraped listings
      const scrapedListings = await this.getScrapedListings(params);
      if (scrapedListings.length > 0) {
        return scrapedListings;
      }

      // 2. Try enhanced market listings (if they contain real data)
      const enhancedListings = await this.getVerifiedEnhancedListings(params);
      if (enhancedListings.length > 0) {
        return enhancedListings;
      }

      // 3. If no real data available, return empty array instead of fake data
      return [];

    } catch (error) {
      console.error('❌ RealMarketplaceService error:', error);
      return [];
    }
  }

  /**
   * Get listings from scraped_listings table (real scraped data)
   */
  private static async getScrapedListings(params: RealMarketplaceParams): Promise<MarketListing[]> {
    try {
      let query = supabase
        .from('scraped_listings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(params.maxResults || 20);

      // Filter by VIN if available
      if (params.vin) {
        query = query.eq('vin', params.vin);
      } else {
        // Filter by make/model/year
        query = query
          .ilike('title', `%${params.make}%`)
          .ilike('title', `%${params.model}%`)
          .ilike('title', `%${params.year}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching scraped listings:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Transform to MarketListing format
      return data.map((listing: any) => ({
        id: listing.id,
        source: listing.platform || 'Scraped',
        source_type: 'scraped',
        price: listing.price || 0,
        year: this.extractYear(listing.title) || params.year,
        make: this.extractMake(listing.title) || params.make,
        model: this.extractModel(listing.title) || params.model,
        trim: '',
        vin: listing.vin || '',
        mileage: listing.mileage || 0,
        condition: 'used',
        dealer_name: undefined,
        location: listing.location || params.zipCode,
        listing_url: listing.url || '',
        is_cpo: false,
        fetched_at: listing.created_at,
        confidence_score: 95 // High confidence for real scraped data
      }));

    } catch (error) {
      console.error('Error in getScrapedListings:', error);
      return [];
    }
  }

  /**
   * Get verified enhanced listings (exclude AI-generated ones)
   */
  private static async getVerifiedEnhancedListings(params: RealMarketplaceParams): Promise<MarketListing[]> {
    try {
      let query = supabase
        .from('enhanced_market_listings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(params.maxResults || 20);

      // Exclude AI-generated listings
      query = query
        .not('id', 'like', 'ai-listing-%')
        .not('id', 'like', 'intelligent-%')
        .not('id', 'like', 'openai-%');

      // Filter by VIN if available
      if (params.vin) {
        query = query.eq('vin', params.vin);
      } else {
        // Filter by make/model/year
        query = query
          .ilike('make', params.make)
          .ilike('model', params.model)
          .eq('year', params.year);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching enhanced listings:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Transform to MarketListing format  
      return data.map((listing: any) => ({
        id: listing.id,
        source: listing.source || 'Enhanced',
        source_type: 'marketplace',
        price: listing.price || 0,
        year: listing.year || params.year,
        make: listing.make || params.make,
        model: listing.model || params.model,
        trim: listing.trim || '',
        vin: listing.vin || '',
        mileage: listing.mileage || 0,
        condition: listing.condition || 'used',
        dealer_name: listing.dealer_name,
        location: listing.location || params.zipCode,
        listing_url: listing.listing_url || '',
        is_cpo: listing.is_cpo || false,
        fetched_at: listing.fetched_at || listing.created_at,
        confidence_score: 90 // High confidence for verified data
      }));

    } catch (error) {
      console.error('Error in getVerifiedEnhancedListings:', error);
      return [];
    }
  }

  /**
   * Extract year from title string
   */
  private static extractYear(title: string): number | null {
    const yearMatch = title.match(/\b(19|20)\d{2}\b/);
    return yearMatch ? parseInt(yearMatch[0]) : null;
  }

  /**
   * Extract make from title string
   */
  private static extractMake(title: string): string | null {
    const makes = ['toyota', 'honda', 'nissan', 'ford', 'chevrolet', 'bmw', 'mercedes', 'audi'];
    const lowerTitle = title.toLowerCase();
    
    for (const make of makes) {
      if (lowerTitle.includes(make)) {
        return make.charAt(0).toUpperCase() + make.slice(1);
      }
    }
    return null;
  }

  /**
   * Extract model from title string
   */
  private static extractModel(title: string): string | null {
    const models = ['camry', 'corolla', 'accord', 'civic', 'altima', 'sentra', 'f150', 'silverado'];
    const lowerTitle = title.toLowerCase();
    
    for (const model of models) {
      if (lowerTitle.includes(model)) {
        return model.charAt(0).toUpperCase() + model.slice(1);
      }
    }
    return null;
  }
}