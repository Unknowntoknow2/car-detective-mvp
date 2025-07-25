/**
 * Vehicle Listings API Connector Template
 * Supports multiple listing platforms with unified interface
 */

export interface VehicleListing {
  id: string;
  vin?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  
  // Vehicle details
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage: number;
  condition: 'new' | 'used' | 'certified' | 'damaged';
  
  // Location
  zipCode?: string;
  city?: string;
  state?: string;
  country: string;
  dealerName?: string;
  sellerType: 'dealer' | 'private' | 'fleet' | 'auction';
  
  // Additional info
  exteriorColor?: string;
  interiorColor?: string;
  fuelType?: string;
  transmission?: string;
  driveType?: string;
  bodyType?: string;
  
  // Listing details
  title: string;
  description?: string;
  features?: string[];
  photos?: string[];
  url: string;
  listedDate: string;
  lastUpdated?: string;
  daysOnMarket?: number;
  
  // Verification
  verified: boolean;
  carfaxAvailable?: boolean;
  autoCheckAvailable?: boolean;
  
  // Source info
  source: string;
  confidence: number;
}

export interface ListingSearchParams {
  make: string;
  model: string;
  year?: number;
  yearMin?: number;
  yearMax?: number;
  
  zipCode: string;
  radius?: number; // miles
  
  priceMin?: number;
  priceMax?: number;
  mileageMax?: number;
  
  condition?: ('new' | 'used' | 'certified')[];
  sellerType?: ('dealer' | 'private')[];
  
  features?: string[];
  limit?: number;
  offset?: number;
}

export interface ListingSearchResult {
  listings: VehicleListing[];
  totalCount: number;
  searchParams: ListingSearchParams;
  executionTimeMs: number;
  source: string;
}

export abstract class ListingConnector {
  protected name: string;
  protected apiKey?: string;
  protected baseUrl: string;
  protected rateLimit: { requests: number; windowMs: number };
  
  constructor(name: string, baseUrl: string, apiKey?: string) {
    this.name = name;
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.rateLimit = { requests: 60, windowMs: 60000 }; // Default: 60 requests per minute
  }

  abstract searchListings(params: ListingSearchParams): Promise<ListingSearchResult>;
  
  protected normalizePrice(price: string | number): number {
    if (typeof price === 'number') return price;
    return parseFloat(price.replace(/[^\d.]/g, '')) || 0;
  }

  protected normalizeMileage(mileage: string | number): number {
    if (typeof mileage === 'number') return mileage;
    return parseInt(mileage.replace(/[^\d]/g, '')) || 0;
  }

  protected calculateConfidence(listing: any): number {
    let confidence = 0.5; // Base confidence
    
    if (listing.vin && listing.vin.length === 17) confidence += 0.2;
    if (listing.price && listing.price > 0) confidence += 0.1;
    if (listing.mileage && listing.mileage >= 0) confidence += 0.1;
    if (listing.photos && listing.photos.length > 0) confidence += 0.05;
    if (listing.dealerName) confidence += 0.05;
    
    return Math.min(confidence, 0.95);
  }
}

/**
 * Cars.com API Connector
 */
export class CarsComConnector extends ListingConnector {
  constructor(apiKey: string) {
    super('Cars.com', 'https://api.cars.com/v1', apiKey);
  }

  async searchListings(params: ListingSearchParams): Promise<ListingSearchResult> {
    if (!this.apiKey) {
      throw new Error('Cars.com API key required');
    }

    const startTime = Date.now();
    
    try {
      const queryParams = this.buildCarsComQuery(params);
      const response = await fetch(
        `${this.baseUrl}/listings/search?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Cars.com API error: ${response.statusText}`);
      }

      const data = await response.json();
      const listings = this.parseCarsComListings(data.listings || []);

      return {
        listings,
        totalCount: data.total_count || listings.length,
        searchParams: params,
        executionTimeMs: Date.now() - startTime,
        source: 'Cars.com'
      };

    } catch (error) {
      throw new Error(`Cars.com search failed: ${error}`);
    }
  }

  private buildCarsComQuery(params: ListingSearchParams): string {
    const query = new URLSearchParams();
    
    query.append('make', params.make);
    query.append('model', params.model);
    
    if (params.year) {
      query.append('year', params.year.toString());
    } else {
      if (params.yearMin) query.append('year_min', params.yearMin.toString());
      if (params.yearMax) query.append('year_max', params.yearMax.toString());
    }
    
    query.append('zip', params.zipCode);
    if (params.radius) query.append('radius', params.radius.toString());
    
    if (params.priceMin) query.append('price_min', params.priceMin.toString());
    if (params.priceMax) query.append('price_max', params.priceMax.toString());
    if (params.mileageMax) query.append('mileage_max', params.mileageMax.toString());
    
    query.append('limit', (params.limit || 25).toString());
    query.append('offset', (params.offset || 0).toString());
    
    return query.toString();
  }

  private parseCarsComListings(rawListings: any[]): VehicleListing[] {
    return rawListings.map(listing => ({
      id: listing.id || `cars_${Math.random().toString(36).substr(2, 9)}`,
      vin: listing.vin,
      price: this.normalizePrice(listing.price),
      originalPrice: listing.original_price ? this.normalizePrice(listing.original_price) : undefined,
      currency: 'USD',
      
      make: listing.make || '',
      model: listing.model || '',
      year: listing.year || 0,
      trim: listing.trim,
      mileage: this.normalizeMileage(listing.mileage),
      condition: listing.condition || 'used',
      
      zipCode: listing.zip,
      city: listing.city,
      state: listing.state,
      country: 'US',
      dealerName: listing.dealer_name,
      sellerType: listing.seller_type || 'dealer',
      
      exteriorColor: listing.exterior_color,
      interiorColor: listing.interior_color,
      fuelType: listing.fuel_type,
      transmission: listing.transmission,
      driveType: listing.drive_type,
      bodyType: listing.body_type,
      
      title: listing.title || `${listing.year} ${listing.make} ${listing.model}`,
      description: listing.description,
      features: listing.features || [],
      photos: listing.photos || [],
      url: listing.url || '',
      listedDate: listing.listed_date || new Date().toISOString(),
      lastUpdated: listing.last_updated,
      daysOnMarket: listing.days_on_market,
      
      verified: Boolean(listing.verified),
      carfaxAvailable: Boolean(listing.carfax_available),
      autoCheckAvailable: Boolean(listing.autocheck_available),
      
      source: 'Cars.com',
      confidence: this.calculateConfidence(listing)
    }));
  }
}

/**
 * AutoTrader API Connector
 */
export class AutoTraderConnector extends ListingConnector {
  constructor(apiKey: string) {
    super('AutoTrader', 'https://api.autotrader.com/v1', apiKey);
  }

  async searchListings(params: ListingSearchParams): Promise<ListingSearchResult> {
    if (!this.apiKey) {
      throw new Error('AutoTrader API key required');
    }

    const startTime = Date.now();
    
    try {
      const queryParams = this.buildAutoTraderQuery(params);
      const response = await fetch(
        `${this.baseUrl}/listings?${queryParams}`,
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`AutoTrader API error: ${response.statusText}`);
      }

      const data = await response.json();
      const listings = this.parseAutoTraderListings(data.results || []);

      return {
        listings,
        totalCount: data.totalResults || listings.length,
        searchParams: params,
        executionTimeMs: Date.now() - startTime,
        source: 'AutoTrader'
      };

    } catch (error) {
      throw new Error(`AutoTrader search failed: ${error}`);
    }
  }

  private buildAutoTraderQuery(params: ListingSearchParams): string {
    const query = new URLSearchParams();
    
    query.append('make', params.make);
    query.append('model', params.model);
    
    if (params.year) {
      query.append('yearFrom', params.year.toString());
      query.append('yearTo', params.year.toString());
    } else {
      if (params.yearMin) query.append('yearFrom', params.yearMin.toString());
      if (params.yearMax) query.append('yearTo', params.yearMax.toString());
    }
    
    query.append('zip', params.zipCode);
    if (params.radius) query.append('searchRadius', params.radius.toString());
    
    if (params.priceMin) query.append('minPrice', params.priceMin.toString());
    if (params.priceMax) query.append('maxPrice', params.priceMax.toString());
    if (params.mileageMax) query.append('maxMileage', params.mileageMax.toString());
    
    query.append('numRecords', (params.limit || 25).toString());
    query.append('startRecord', (params.offset || 0).toString());
    
    return query.toString();
  }

  private parseAutoTraderListings(rawListings: any[]): VehicleListing[] {
    return rawListings.map(listing => ({
      id: listing.id || `at_${Math.random().toString(36).substr(2, 9)}`,
      vin: listing.vin,
      price: this.normalizePrice(listing.pricingDetail?.salePrice || listing.price),
      currency: 'USD',
      
      make: listing.make || '',
      model: listing.model || '',
      year: listing.year || 0,
      trim: listing.trim,
      mileage: this.normalizeMileage(listing.mileage),
      condition: listing.condition || 'used',
      
      zipCode: listing.dealer?.zip,
      city: listing.dealer?.city,
      state: listing.dealer?.state,
      country: 'US',
      dealerName: listing.dealer?.name,
      sellerType: listing.dealer ? 'dealer' : 'private',
      
      exteriorColor: listing.exteriorColor,
      interiorColor: listing.interiorColor,
      fuelType: listing.fuelType,
      transmission: listing.transmission,
      driveType: listing.drivetrain,
      bodyType: listing.bodyStyle,
      
      title: listing.title || `${listing.year} ${listing.make} ${listing.model}`,
      description: listing.description,
      features: listing.features || [],
      photos: listing.images?.map((img: any) => img.url) || [],
      url: listing.link || '',
      listedDate: listing.firstSeen || new Date().toISOString(),
      
      verified: Boolean(listing.badgeList?.includes('Verified')),
      carfaxAvailable: Boolean(listing.hasCarfax),
      
      source: 'AutoTrader',
      confidence: this.calculateConfidence(listing)
    }));
  }
}

/**
 * CarGurus API Connector
 */
export class CarGurusConnector extends ListingConnector {
  constructor(apiKey: string) {
    super('CarGurus', 'https://api.cargurus.com/v1', apiKey);
  }

  async searchListings(params: ListingSearchParams): Promise<ListingSearchResult> {
    // CarGurus implementation would go here
    // This is a template structure
    
    return {
      listings: [],
      totalCount: 0,
      searchParams: params,
      executionTimeMs: 0,
      source: 'CarGurus'
    };
  }
}

/**
 * Composite Listing Connector with aggregation
 */
export class CompositeListingConnector {
  private connectors: ListingConnector[];

  constructor(connectors: ListingConnector[]) {
    this.connectors = connectors;
  }

  async searchListings(params: ListingSearchParams): Promise<ListingSearchResult> {
    const startTime = Date.now();
    
    const results = await Promise.allSettled(
      this.connectors.map(connector => connector.searchListings(params))
    );

    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<ListingSearchResult> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);

    if (successfulResults.length === 0) {
      throw new Error('All listing connectors failed');
    }

    // Aggregate results
    const allListings = successfulResults.flatMap(result => result.listings);
    const deduplicatedListings = this.deduplicateListings(allListings);
    const totalCount = successfulResults.reduce((sum, result) => sum + result.totalCount, 0);

    return {
      listings: deduplicatedListings,
      totalCount,
      searchParams: params,
      executionTimeMs: Date.now() - startTime,
      source: successfulResults.map(r => r.source).join(', ')
    };
  }

  private deduplicateListings(listings: VehicleListing[]): VehicleListing[] {
    const seen = new Set<string>();
    const deduplicated: VehicleListing[] = [];

    for (const listing of listings) {
      // Create a key for deduplication
      const key = this.createDeduplicationKey(listing);
      
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(listing);
      }
    }

    return deduplicated;
  }

  private createDeduplicationKey(listing: VehicleListing): string {
    // Use VIN if available, otherwise use other identifying characteristics
    if (listing.vin) {
      return listing.vin;
    }
    
    return `${listing.year}_${listing.make}_${listing.model}_${listing.mileage}_${listing.price}_${listing.zipCode}`;
  }
}

// Factory function for easy setup
export function createListingConnector(config: {
  carsComApiKey?: string;
  autoTraderApiKey?: string;
  carGurusApiKey?: string;
  enabledSources?: ('cars' | 'autotrader' | 'cargurus')[];
}): CompositeListingConnector {
  const connectors: ListingConnector[] = [];
  const sources = config.enabledSources || ['cars', 'autotrader', 'cargurus'];

  for (const source of sources) {
    switch (source) {
      case 'cars':
        if (config.carsComApiKey) {
          connectors.push(new CarsComConnector(config.carsComApiKey));
        }
        break;
      case 'autotrader':
        if (config.autoTraderApiKey) {
          connectors.push(new AutoTraderConnector(config.autoTraderApiKey));
        }
        break;
      case 'cargurus':
        if (config.carGurusApiKey) {
          connectors.push(new CarGurusConnector(config.carGurusApiKey));
        }
        break;
    }
  }

  if (connectors.length === 0) {
    throw new Error('No listing connectors configured');
  }

  return new CompositeListingConnector(connectors);
}