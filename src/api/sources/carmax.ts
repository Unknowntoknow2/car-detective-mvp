import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface CarMaxSearchQuery {
  year: number;
  make: string;
  model: string;
  trim?: string;
  zip?: string;
  mileage?: number;
  maxPrice?: number;
  minPrice?: number;
}

export interface CarMaxListing {
  price: number;
  vin?: string;
  mileage?: number;
  dealer: string;
  location: string;
  link: string;
  cpo: boolean;
  date_listed?: string;
  features?: string[];
  condition?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
}

export class CarMaxSource {
  private static readonly SOURCE_NAME = 'CarMax';
  private static readonly SOURCE_TYPE = 'big_box';
  private static readonly BASE_URL = 'https://www.carmax.com/cars';

  /**
   * Search CarMax inventory using OpenAI API for web search
   */
  static async searchInventory(
    query: CarMaxSearchQuery,
    requestId: string
  ): Promise<CarMaxListing[]> {
    try {
      logger.log('🔍 Searching CarMax for:', query);

      // Log the search attempt
      await supabase
        .from('valuation_audit_logs')
        .insert({
          valuation_request_id: requestId,
          action: 'source_search_start',
          message: `Starting CarMax search for ${query.year} ${query.make} ${query.model}`,
          raw_data: { query, source: this.SOURCE_NAME }
        });

      // Call the valuation-aggregate function with CarMax-specific parameters
      const { data, error } = await supabase.functions.invoke('valuation-aggregate', {
        body: {
          request_id: requestId,
          source_filter: 'carmax',
          search_query: this.buildSearchQuery(query)
        }
      });

      if (error) {
        throw new Error(`CarMax search failed: ${error.message}`);
      }

      // Parse and return listings
      const listings = this.parseListings(data?.comps || [], query);
      
      // Log successful search
      await supabase
        .from('valuation_audit_logs')
        .insert({
          valuation_request_id: requestId,
          action: 'source_search_complete',
          message: `CarMax search completed: ${listings.length} listings found`,
          raw_data: { 
            listings_count: listings.length,
            source: this.SOURCE_NAME,
            query
          }
        });

      return listings;

    } catch (error) {
      console.error('❌ CarMax search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Log the error
      await supabase
        .from('valuation_audit_logs')
        .insert({
          valuation_request_id: requestId,
          action: 'source_search_error',
          message: `CarMax search failed: ${errorMessage}`,
          raw_data: { 
            error: errorMessage,
            source: this.SOURCE_NAME,
            query
          }
        });

      return [];
    }
  }

  /**
   * Build the search query string for OpenAI
   */
  private static buildSearchQuery(query: CarMaxSearchQuery): string {
    let searchTerms = `${query.year} ${query.make} ${query.model}`;
    
    if (query.trim) {
      searchTerms += ` ${query.trim}`;
    }

    let locationFilter = '';
    if (query.zip) {
      locationFilter = ` near ${query.zip}`;
    }

    let priceFilter = '';
    if (query.maxPrice) {
      priceFilter = ` under $${query.maxPrice}`;
    }

    return `Find listings for a ${searchTerms}${locationFilter}${priceFilter} on site:carmax.com. Return price, VIN, mileage, dealer, link, CPO status.`;
  }

  /**
   * Parse OpenAI response into structured CarMax listings
   */
  private static parseListings(rawComps: any[], query: CarMaxSearchQuery): CarMaxListing[] {
    return rawComps
      .filter(comp => comp.price && parseFloat(comp.price.toString().replace(/[^\d.]/g, '')) > 0)
      .map(comp => ({
        price: parseFloat(comp.price.toString().replace(/[^\d.]/g, '')),
        vin: comp.vin,
        mileage: comp.mileage ? parseInt(comp.mileage.toString().replace(/[^\d]/g, '')) : undefined,
        dealer: comp.dealer_name || 'CarMax',
        location: comp.location || 'Unknown',
        link: comp.listing_url || this.BASE_URL,
        cpo: comp.is_cpo === true || comp.is_cpo === 'true',
        date_listed: comp.date_listed,
        features: comp.features || [],
        condition: comp.condition || 'Used',
        year: query.year,
        make: query.make,
        model: query.model,
        trim: query.trim
      }))
      .slice(0, 10); // Limit to 10 listings per source
  }

  /**
   * Get CarMax source status and performance metrics
   */
  static async getSourceStatus(): Promise<{
    name: string;
    type: string;
    status: string;
    last_check?: string;
    success_rate?: number;
  }> {
    try {
      // Get recent performance data from audit logs
      const { data: recentLogs } = await supabase
        .from('valuation_audit_logs')
        .select('*')
        .eq('action', 'source_search_complete')
        .contains('raw_data', { source: this.SOURCE_NAME })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      const successfulSearches = recentLogs?.filter(log => 
        log.raw_data?.listings_count > 0
      ).length || 0;

      const totalSearches = recentLogs?.length || 0;
      const successRate = totalSearches > 0 ? (successfulSearches / totalSearches) * 100 : 0;

      return {
        name: this.SOURCE_NAME,
        type: this.SOURCE_TYPE,
        status: 'active',
        last_check: recentLogs?.[0]?.created_at,
        success_rate: Math.round(successRate)
      };
    } catch (error) {
      console.error('❌ Error getting CarMax status:', error);
      return {
        name: this.SOURCE_NAME,
        type: this.SOURCE_TYPE,
        status: 'error'
      };
    }
  }
}

export default CarMaxSource;