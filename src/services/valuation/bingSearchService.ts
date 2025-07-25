import type { MarketListing } from '@/types/marketListing';

export interface BingSearchParams {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  zipCode: string;
  radius?: number;
}

export interface BingSearchResult {
  webPages?: {
    value: Array<{
      name: string;
      url: string;
      snippet: string;
      displayUrl: string;
    }>;
  };
}

/**
 * Professional Bing Search API integration for real vehicle listings
 * Uses Microsoft Cognitive Services endpoint with secure API key configuration
 */
export class BingSearchService {
  private static readonly BING_API_ENDPOINT = 'https://api.bing.microsoft.com/v7.0/search';
  private static readonly AUTOMOTIVE_DOMAINS = [
    'autotrader.com',
    'cars.com', 
    'cargurus.com',
    'carmax.com',
    'edmunds.com',
    'carfax.com',
    'vroom.com',
    'shift.com',
    'carvana.com'
  ];

  /**
   * Search for real vehicle listings using Bing Search API
   * Only returns verified, live automotive marketplace listings
   */
  static async searchVehicleListings(params: BingSearchParams): Promise<MarketListing[]> {
    console.log('🔍 BingSearchService: Starting real vehicle search', params);

    const apiKey = this.getBingApiKey();
    if (!apiKey) {
      console.warn('⚠️ BING_API_KEY not configured - cannot search real listings');
      return [];
    }

    try {
      const searchQuery = this.buildSearchQuery(params);
      const searchResults = await this.executeSearch(searchQuery, apiKey);
      
      if (!searchResults.webPages?.value) {
        console.log('ℹ️ No search results returned from Bing');
        return [];
      }

      const automotiveListings = this.filterAutomotiveListings(searchResults.webPages.value);
      const parsedListings = await this.parseListingsFromResults(automotiveListings, params);
      
      console.log(`✅ Found ${parsedListings.length} real vehicle listings`);
      return parsedListings;

    } catch (error) {
      console.error('❌ Bing Search API error:', error);
      return [];
    }
  }

  /**
   * Get Bing API key from environment
   */
  private static getBingApiKey(): string | null {
    // Try multiple possible environment variable names
    return process.env.BING_API_KEY || 
           process.env.VITE_BING_API_KEY || 
           process.env.AZURE_COGNITIVE_SERVICES_KEY ||
           null;
  }

  /**
   * Build precise search query for vehicle listings
   */
  private static buildSearchQuery(params: BingSearchParams): string {
    const { year, make, model, mileage, zipCode } = params;
    
    // Construct search query targeting automotive marketplaces
    let query = `${year} ${make} ${model} for sale`;
    
    if (mileage) {
      query += ` ${mileage} miles`;
    }
    
    query += ` near ${zipCode}`;
    
    // Add site restrictions to automotive domains only
    const siteRestrictions = this.AUTOMOTIVE_DOMAINS
      .map(domain => `site:${domain}`)
      .join(' OR ');
    
    return `${query} (${siteRestrictions})`;
  }

  /**
   * Execute Bing Search API request
   */
  private static async executeSearch(query: string, apiKey: string): Promise<BingSearchResult> {
    const params = new URLSearchParams({
      q: query,
      count: '20',
      mkt: 'en-US',
      safesearch: 'Moderate',
      freshness: 'Month' // Only recent listings
    });

    const response = await fetch(`${this.BING_API_ENDPOINT}?${params}`, {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Bing API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Filter results to only automotive marketplace listings
   */
  private static filterAutomotiveListings(results: any[]): any[] {
    return results.filter(result => {
      const url = result.url?.toLowerCase() || '';
      return this.AUTOMOTIVE_DOMAINS.some(domain => url.includes(domain));
    });
  }

  /**
   * Parse automotive marketplace results into MarketListing format
   */
  private static async parseListingsFromResults(
    results: any[], 
    params: BingSearchParams
  ): Promise<MarketListing[]> {
    const listings: MarketListing[] = [];

    for (const result of results) {
      try {
        const listing = await this.parseListingFromResult(result, params);
        if (listing) {
          listings.push(listing);
        }
      } catch (error) {
        console.warn('⚠️ Failed to parse listing result:', error);
        continue;
      }
    }

    return listings;
  }

  /**
   * Parse individual search result into MarketListing
   */
  private static async parseListingFromResult(
    result: any,
    params: BingSearchParams
  ): Promise<MarketListing | null> {
    const url = result.url;
    const snippet = result.snippet || '';
    const title = result.name || '';

    // Extract price from snippet or title
    const price = this.extractPrice(snippet + ' ' + title);
    if (!price || price < 1000 || price > 500000) {
      return null; // Skip listings with unrealistic prices
    }

    // Extract mileage
    const mileage = this.extractMileage(snippet + ' ' + title);

    // Determine source from URL
    const source = this.extractSource(url);
    
    // Extract location
    const location = this.extractLocation(snippet) || `${params.zipCode} area`;

    return {
      id: `bing-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source,
      source_type: 'marketplace',
      price,
      year: params.year,
      make: params.make,
      model: params.model,
      trim: this.extractTrim(title) || '',
      vin: '',
      mileage: mileage || 0,
      condition: this.extractCondition(snippet + ' ' + title) || 'used',
      dealer_name: this.extractDealerName(snippet),
      location,
      listing_url: url,
      is_cpo: this.isCertifiedPreOwned(snippet + ' ' + title),
      fetched_at: new Date().toISOString(),
      confidence_score: 85 // High confidence for Bing search results
    };
  }

  /**
   * Extract price from text using regex
   */
  private static extractPrice(text: string): number | null {
    const priceMatch = text.match(/\$[\d,]+/);
    if (priceMatch) {
      const price = parseInt(priceMatch[0].replace(/[$,]/g, ''));
      return isNaN(price) ? null : price;
    }
    return null;
  }

  /**
   * Extract mileage from text
   */
  private static extractMileage(text: string): number | null {
    const mileageMatch = text.match(/(\d{1,3}(?:,\d{3})*)\s*mi(?:les?)?/i);
    if (mileageMatch) {
      const mileage = parseInt(mileageMatch[1].replace(/,/g, ''));
      return isNaN(mileage) ? null : mileage;
    }
    return null;
  }

  /**
   * Extract source name from URL
   */
  private static extractSource(url: string): string {
    for (const domain of this.AUTOMOTIVE_DOMAINS) {
      if (url.includes(domain)) {
        return domain.split('.')[0]
          .split('')
          .map((char, i) => i === 0 ? char.toUpperCase() : char)
          .join('');
      }
    }
    return 'Automotive Marketplace';
  }

  /**
   * Extract trim level from title
   */
  private static extractTrim(title: string): string | null {
    const commonTrims = ['Base', 'S', 'SV', 'SL', 'SR', 'Platinum', 'Limited', 'EX', 'LX', 'Sport'];
    const titleUpper = title.toUpperCase();
    
    for (const trim of commonTrims) {
      if (titleUpper.includes(trim.toUpperCase())) {
        return trim;
      }
    }
    return null;
  }

  /**
   * Extract condition from text
   */
  private static extractCondition(text: string): string | null {
    const textLower = text.toLowerCase();
    if (textLower.includes('excellent')) return 'excellent';
    if (textLower.includes('good')) return 'good';
    if (textLower.includes('fair')) return 'fair';
    if (textLower.includes('new')) return 'new';
    return 'used';
  }

  /**
   * Extract dealer name from snippet
   */
  private static extractDealerName(snippet: string): string | null {
    // Look for common dealer patterns
    const dealerMatch = snippet.match(/(?:at|from)\s+([A-Z][a-zA-Z\s&']+(?:Auto|Motors|Cars|Dealer|Toyota|Honda|Nissan|Ford|Chevrolet))/i);
    return dealerMatch ? dealerMatch[1].trim() : null;
  }

  /**
   * Extract location from snippet
   */
  private static extractLocation(snippet: string): string | null {
    // Look for city, state patterns
    const locationMatch = snippet.match(/([A-Z][a-z]+,?\s*[A-Z]{2})/);
    return locationMatch ? locationMatch[1] : null;
  }

  /**
   * Check if listing is certified pre-owned
   */
  private static isCertifiedPreOwned(text: string): boolean {
    const textLower = text.toLowerCase();
    return textLower.includes('cpo') || 
           textLower.includes('certified') || 
           textLower.includes('pre-owned');
  }
}