/**
 * Auction Data API Connector Template
 * Supports multiple auction platforms for vehicle pricing data
 */

export interface AuctionListing {
  id: string;
  vin?: string;
  
  // Vehicle details
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor' | 'salvage' | 'flood' | 'lemon';
  
  // Auction details
  auctionHouse: string;
  auctionDate: string;
  auctionStatus: 'upcoming' | 'live' | 'ended' | 'cancelled';
  auctionType: 'dealer' | 'public' | 'wholesale' | 'repo' | 'fleet';
  
  // Pricing
  currentBid?: number;
  reservePrice?: number;
  buyNowPrice?: number;
  finalPrice?: number;
  estimatedValue?: number;
  
  // Location
  location: string;
  sellerType: 'dealer' | 'bank' | 'fleet' | 'lease' | 'individual';
  
  // Condition details
  damageReport?: {
    primaryDamage?: string;
    secondaryDamage?: string;
    damageDescription?: string;
    hasKeys: boolean;
    runsAndDrives: boolean;
  };
  
  // Additional info
  title: string;
  description?: string;
  photos?: string[];
  url: string;
  
  // Source info
  source: string;
  confidence: number;
}

export interface AuctionSearchParams {
  make: string;
  model: string;
  year?: number;
  yearMin?: number;
  yearMax?: number;
  
  auctionType?: ('dealer' | 'public' | 'wholesale')[];
  condition?: string[];
  
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  
  includeEnded?: boolean;
  daysBack?: number; // For historical data
  
  limit?: number;
  offset?: number;
}

export interface AuctionSearchResult {
  listings: AuctionListing[];
  totalCount: number;
  averagePrice?: number;
  priceRange?: [number, number];
  searchParams: AuctionSearchParams;
  executionTimeMs: number;
  source: string;
}

export abstract class AuctionConnector {
  protected name: string;
  protected apiKey?: string;
  protected baseUrl: string;
  
  constructor(name: string, baseUrl: string, apiKey?: string) {
    this.name = name;
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  abstract searchAuctions(params: AuctionSearchParams): Promise<AuctionSearchResult>;
}

/**
 * Manheim Auction Connector
 */
export class ManheimConnector extends AuctionConnector {
  constructor(apiKey: string) {
    super('Manheim', 'https://api.manheim.com/v1', apiKey);
  }

  async searchAuctions(params: AuctionSearchParams): Promise<AuctionSearchResult> {
    if (!this.apiKey) {
      throw new Error('Manheim API key required');
    }

    const startTime = Date.now();
    
    try {
      const queryParams = this.buildManheimQuery(params);
      const response = await fetch(
        `${this.baseUrl}/auctions/search?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Manheim API error: ${response.statusText}`);
      }

      const data = await response.json();
      const listings = this.parseManheimListings(data.results || []);

      return {
        listings,
        totalCount: data.totalCount || listings.length,
        averagePrice: this.calculateAveragePrice(listings),
        priceRange: this.calculatePriceRange(listings),
        searchParams: params,
        executionTimeMs: Date.now() - startTime,
        source: 'Manheim'
      };

    } catch (error) {
      throw new Error(`Manheim search failed: ${error}`);
    }
  }

  private buildManheimQuery(params: AuctionSearchParams): string {
    const query = new URLSearchParams();
    
    query.append('make', params.make);
    query.append('model', params.model);
    
    if (params.year) {
      query.append('year', params.year.toString());
    } else {
      if (params.yearMin) query.append('yearFrom', params.yearMin.toString());
      if (params.yearMax) query.append('yearTo', params.yearMax.toString());
    }
    
    if (params.includeEnded) {
      query.append('includeEnded', 'true');
      if (params.daysBack) query.append('daysBack', params.daysBack.toString());
    }
    
    query.append('limit', (params.limit || 50).toString());
    query.append('offset', (params.offset || 0).toString());
    
    return query.toString();
  }

  private parseManheimListings(rawListings: any[]): AuctionListing[] {
    return rawListings.map(listing => ({
      id: listing.lotNumber || `manheim_${Math.random().toString(36).substr(2, 9)}`,
      vin: listing.vin,
      
      make: listing.make || '',
      model: listing.model || '',
      year: listing.year || 0,
      trim: listing.trim,
      mileage: listing.mileage || 0,
      condition: this.normalizeCondition(listing.condition),
      
      auctionHouse: 'Manheim',
      auctionDate: listing.saleDate || listing.auctionDate,
      auctionStatus: listing.status || 'ended',
      auctionType: listing.auctionType || 'dealer',
      
      currentBid: listing.currentBid,
      reservePrice: listing.reservePrice,
      buyNowPrice: listing.buyItNowPrice,
      finalPrice: listing.salePrice || listing.soldPrice,
      estimatedValue: listing.mmr, // Manheim Market Report value
      
      location: listing.location || listing.saleLocation,
      sellerType: listing.sellerType || 'dealer',
      
      damageReport: listing.condition ? {
        primaryDamage: listing.condition.primaryDamage,
        secondaryDamage: listing.condition.secondaryDamage,
        damageDescription: listing.condition.description,
        hasKeys: Boolean(listing.condition.hasKeys),
        runsAndDrives: Boolean(listing.condition.runsAndDrives)
      } : undefined,
      
      title: `${listing.year} ${listing.make} ${listing.model}`,
      description: listing.description,
      photos: listing.images || [],
      url: listing.lotUrl || '',
      
      source: 'Manheim',
      confidence: 0.9 // Manheim data is typically very reliable
    }));
  }

  private normalizeCondition(condition: any): AuctionListing['condition'] {
    if (!condition) return 'fair';
    
    const conditionStr = String(condition).toLowerCase();
    if (conditionStr.includes('excellent') || conditionStr.includes('like new')) return 'excellent';
    if (conditionStr.includes('good') || conditionStr.includes('clean')) return 'good';
    if (conditionStr.includes('fair') || conditionStr.includes('average')) return 'fair';
    if (conditionStr.includes('poor') || conditionStr.includes('rough')) return 'poor';
    if (conditionStr.includes('salvage') || conditionStr.includes('total loss')) return 'salvage';
    if (conditionStr.includes('flood') || conditionStr.includes('water')) return 'flood';
    if (conditionStr.includes('lemon') || conditionStr.includes('buyback')) return 'lemon';
    
    return 'fair'; // Default
  }

  private calculateAveragePrice(listings: AuctionListing[]): number {
    const pricesWithValues = listings
      .map(l => l.finalPrice || l.currentBid || l.estimatedValue)
      .filter((price): price is number => typeof price === 'number' && price > 0);
    
    return pricesWithValues.length > 0
      ? pricesWithValues.reduce((sum, price) => sum + price, 0) / pricesWithValues.length
      : 0;
  }

  private calculatePriceRange(listings: AuctionListing[]): [number, number] {
    const prices = listings
      .map(l => l.finalPrice || l.currentBid || l.estimatedValue)
      .filter((price): price is number => typeof price === 'number' && price > 0);
    
    if (prices.length === 0) return [0, 0];
    
    return [Math.min(...prices), Math.max(...prices)];
  }
}

/**
 * ADESA Auction Connector
 */
export class ADESAConnector extends AuctionConnector {
  constructor(apiKey: string) {
    super('ADESA', 'https://api.adesa.com/v2', apiKey);
  }

  async searchAuctions(params: AuctionSearchParams): Promise<AuctionSearchResult> {
    // ADESA implementation would go here
    // This is a template structure
    
    return {
      listings: [],
      totalCount: 0,
      searchParams: params,
      executionTimeMs: 0,
      source: 'ADESA'
    };
  }
}

/**
 * Copart Connector (Salvage/Insurance Auctions)
 */
export class CopartConnector extends AuctionConnector {
  constructor() {
    super('Copart', 'https://api.copart.com/v1');
  }

  async searchAuctions(params: AuctionSearchParams): Promise<AuctionSearchResult> {
    const startTime = Date.now();
    
    try {
      // Copart typically doesn't require API key for basic searches
      const queryParams = this.buildCopartQuery(params);
      const response = await fetch(
        `${this.baseUrl}/lots/search?${queryParams}`
      );

      if (!response.ok) {
        throw new Error(`Copart API error: ${response.statusText}`);
      }

      const data = await response.json();
      const listings = this.parseCopartListings(data.data?.results?.content || []);

      return {
        listings,
        totalCount: data.data?.results?.totalElements || listings.length,
        averagePrice: this.calculateAveragePrice(listings),
        priceRange: this.calculatePriceRange(listings),
        searchParams: params,
        executionTimeMs: Date.now() - startTime,
        source: 'Copart'
      };

    } catch (error) {
      throw new Error(`Copart search failed: ${error}`);
    }
  }

  private buildCopartQuery(params: AuctionSearchParams): string {
    const query = new URLSearchParams();
    
    query.append('make', params.make);
    query.append('model', params.model);
    
    if (params.year) {
      query.append('year', params.year.toString());
    }
    
    query.append('size', (params.limit || 50).toString());
    query.append('from', (params.offset || 0).toString());
    
    return query.toString();
  }

  private parseCopartListings(rawListings: any[]): AuctionListing[] {
    return rawListings.map(listing => ({
      id: listing.lotNumber || `copart_${Math.random().toString(36).substr(2, 9)}`,
      vin: listing.vin,
      
      make: listing.make || '',
      model: listing.model || '',
      year: listing.year || 0,
      trim: listing.trim,
      mileage: listing.odometer || 0,
      condition: 'salvage', // Copart specializes in salvage
      
      auctionHouse: 'Copart',
      auctionDate: listing.saleDate,
      auctionStatus: listing.auctionStatus || 'upcoming',
      auctionType: 'public',
      
      currentBid: listing.currentBid,
      buyNowPrice: listing.buyItNowPrice,
      finalPrice: listing.soldPrice,
      estimatedValue: listing.estimatedRetailValue,
      
      location: listing.yardName || listing.location,
      sellerType: 'individual',
      
      damageReport: {
        primaryDamage: listing.primaryDamage,
        secondaryDamage: listing.secondaryDamage,
        damageDescription: listing.damageDescription,
        hasKeys: Boolean(listing.hasKeys),
        runsAndDrives: Boolean(listing.runAndDrive)
      },
      
      title: `${listing.year} ${listing.make} ${listing.model}`,
      description: listing.lotDetails,
      photos: listing.images || [],
      url: listing.lotUrl || '',
      
      source: 'Copart',
      confidence: 0.85
    }));
  }

  private calculateAveragePrice(listings: AuctionListing[]): number {
    const pricesWithValues = listings
      .map(l => l.finalPrice || l.currentBid || l.estimatedValue)
      .filter((price): price is number => typeof price === 'number' && price > 0);
    
    return pricesWithValues.length > 0
      ? pricesWithValues.reduce((sum, price) => sum + price, 0) / pricesWithValues.length
      : 0;
  }

  private calculatePriceRange(listings: AuctionListing[]): [number, number] {
    const prices = listings
      .map(l => l.finalPrice || l.currentBid || l.estimatedValue)
      .filter((price): price is number => typeof price === 'number' && price > 0);
    
    if (prices.length === 0) return [0, 0];
    
    return [Math.min(...prices), Math.max(...prices)];
  }
}

/**
 * Composite Auction Connector
 */
export class CompositeAuctionConnector {
  private connectors: AuctionConnector[];

  constructor(connectors: AuctionConnector[]) {
    this.connectors = connectors;
  }

  async searchAuctions(params: AuctionSearchParams): Promise<AuctionSearchResult> {
    const startTime = Date.now();
    
    const results = await Promise.allSettled(
      this.connectors.map(connector => connector.searchAuctions(params))
    );

    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<AuctionSearchResult> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);

    if (successfulResults.length === 0) {
      throw new Error('All auction connectors failed');
    }

    // Aggregate results
    const allListings = successfulResults.flatMap(result => result.listings);
    const totalCount = successfulResults.reduce((sum, result) => sum + result.totalCount, 0);
    
    // Calculate aggregate metrics
    const averagePrice = this.calculateAveragePrice(allListings);
    const priceRange = this.calculatePriceRange(allListings);

    return {
      listings: allListings,
      totalCount,
      averagePrice,
      priceRange,
      searchParams: params,
      executionTimeMs: Date.now() - startTime,
      source: successfulResults.map(r => r.source).join(', ')
    };
  }

  private calculateAveragePrice(listings: AuctionListing[]): number {
    const pricesWithValues = listings
      .map(l => l.finalPrice || l.currentBid || l.estimatedValue)
      .filter((price): price is number => typeof price === 'number' && price > 0);
    
    return pricesWithValues.length > 0
      ? pricesWithValues.reduce((sum, price) => sum + price, 0) / pricesWithValues.length
      : 0;
  }

  private calculatePriceRange(listings: AuctionListing[]): [number, number] {
    const prices = listings
      .map(l => l.finalPrice || l.currentBid || l.estimatedValue)
      .filter((price): price is number => typeof price === 'number' && price > 0);
    
    if (prices.length === 0) return [0, 0];
    
    return [Math.min(...prices), Math.max(...prices)];
  }
}

// Factory function for easy setup
export function createAuctionConnector(config: {
  manheimApiKey?: string;
  adesaApiKey?: string;
  includeCopart?: boolean;
  enabledSources?: ('manheim' | 'adesa' | 'copart')[];
}): CompositeAuctionConnector {
  const connectors: AuctionConnector[] = [];
  const sources = config.enabledSources || ['manheim', 'adesa', 'copart'];

  for (const source of sources) {
    switch (source) {
      case 'manheim':
        if (config.manheimApiKey) {
          connectors.push(new ManheimConnector(config.manheimApiKey));
        }
        break;
      case 'adesa':
        if (config.adesaApiKey) {
          connectors.push(new ADESAConnector(config.adesaApiKey));
        }
        break;
      case 'copart':
        if (config.includeCopart !== false) {
          connectors.push(new CopartConnector());
        }
        break;
    }
  }

  if (connectors.length === 0) {
    // At minimum, include Copart which doesn't require API key
    connectors.push(new CopartConnector());
  }

  return new CompositeAuctionConnector(connectors);
}