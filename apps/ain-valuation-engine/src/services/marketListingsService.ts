import type { MarketListing } from "@/types/marketListing";
interface CarGurusListing {
  id: string;
  price: number;
  mileage: number;
  year: number;
  makeName: string;
  modelName: string;
  trimName?: string;
  condition: string;
  city: string;
  state: string;
  listingDate?: string | Date;
  listingUrl?: string;
  sellerType: string;
  // Optionally, keep legacy fields if referenced elsewhere
  // make?: string;
  // model?: string;
  // trim?: string;
  // location?: string;
  // dealerName?: string;
  // photos?: Array<{ url: string }>;
  // detailsUrl?: string;
}
import { apiClient } from './apiClient';
import { VehicleData, VehicleCondition, ApiResponse } from '../types/ValuationTypes';

// Proper typing for external API responses
interface AutotraderListing {
  id: string;
  price: number;
  mileage: number;
  year: number;
  make: string;
  model: string;
  trim?: string;
  condition: string;
  location: {
    city: string;
    state: string;
    zipCode: string;
  };
  dealer: {
    name: string;
    phone?: string;
  };
  images?: string[];
  url?: string;
}

interface CarsComListing {
  listingId: string;
  askingPrice: number;
  mileage: number;
  year: number;
  make: string;
  model: string;
  trim?: string;
  condition: string;
  location: string;
  dealerName: string;
  photos?: Array<{ url: string }>;
  detailsUrl?: string;
}

interface AutotraderResponse {
  listings: AutotraderListing[];
  total: number;
  page: number;
}

interface CarsComResponse {
  listings: CarsComListing[];
  totalResults: number;
}

interface CarGurusResponse {
  data: CarGurusListing[];
  count: number;
}

export class MarketListingsService {
  private readonly autotraderApiKey = import.meta.env.VITE_AUTOTRADER_API_KEY;
  private readonly carsComApiKey = import.meta.env.VITE_CARSCOM_API_KEY;
  private readonly carGurusApiKey = import.meta.env.VITE_CARGURUS_API_KEY;

  async getMarketListings(
    vehicle: Partial<VehicleData>,
    radiusMiles: number = 100,
    maxResults: number = 100
  ): Promise<ApiResponse<MarketListing[]>> {
    try {
      // Parallel requests to multiple sources
      const [autotraderResults, carsComResults, carGurusResults] = await Promise.allSettled([
        this.getAutotraderListings(vehicle, radiusMiles, maxResults / 3),
        this.getCarsComListings(vehicle, radiusMiles, maxResults / 3),
        this.getCarGurusListings(vehicle, radiusMiles, maxResults / 3),
      ]);

      const allListings: MarketListing[] = [];

      // Process Autotrader results
      if (autotraderResults.status === 'fulfilled' && autotraderResults.value.ok) {
        allListings.push(...(autotraderResults.value.data || []));
      }

      // Process Cars.com results
      if (carsComResults.status === 'fulfilled' && carsComResults.value.ok) {
        allListings.push(...(carsComResults.value.data || []));
      }

      // Process CarGurus results
      if (carGurusResults.status === 'fulfilled' && carGurusResults.value.ok) {
        allListings.push(...(carGurusResults.value.data || []));
      }

      // Remove duplicates and sort by relevance
      const uniqueListings = this.deduplicateListings(allListings);
      const sortedListings = this.sortByRelevance(uniqueListings, vehicle);

      return {
        ok: true,
        data: sortedListings.slice(0, maxResults),
        metadata: {
          source: 'multiple_sources',
          timestamp: new Date(),
        },
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Failed to fetch market listings',
        metadata: {
          source: 'market_listings_service',
          timestamp: new Date(),
        },
      };
    }
  }

  private async getAutotraderListings(
    vehicle: Partial<VehicleData>,
    radius: number,
    maxResults: number
  ): Promise<ApiResponse<MarketListing[]>> {
    if (!this.autotraderApiKey) {
      return this.getMockListings(vehicle, 'autotrader', maxResults);
    }

    const params = new URLSearchParams({
      make: vehicle.make || '',
      model: vehicle.model || '',
      year: vehicle.year?.toString() || '',
      zip: vehicle.zipCode || '90210',
      radius: radius.toString(),
      limit: maxResults.toString(),
    });

    const response = await apiClient.get<AutotraderResponse>(
      `https://api.autotrader.com/v2/listings?${params.toString()}`,
      {
        'X-API-Key': this.autotraderApiKey,
      }
    );

    if (!response.ok) {
      return {
        ok: false,
        error: response.error,
        metadata: response.metadata,
      };
    }

    const listings = response.data?.listings.map(this.transformAutotraderListing) || [];
    return {
      ok: true,
      data: listings,
      metadata: response.metadata,
    };
  }

  private async getCarsComListings(
    vehicle: Partial<VehicleData>,
    radius: number,
    maxResults: number
  ): Promise<ApiResponse<MarketListing[]>> {
    if (!this.carsComApiKey) {
      return this.getMockListings(vehicle, 'cars.com', maxResults);
    }

    const params = new URLSearchParams({
      make: vehicle.make || '',
      model: vehicle.model || '',
      year: vehicle.year?.toString() || '',
      zip: vehicle.zipCode || '90210',
      radius: radius.toString(),
      limit: maxResults.toString(),
    });

    const response = await apiClient.get<CarsComResponse>(
      `https://api.cars.com/v1/listings?${params.toString()}`,
      {
        'Authorization': `Bearer ${this.carsComApiKey}`,
      }
    );

    if (!response.ok) {
      return {
        ok: false,
        error: response.error,
        metadata: response.metadata,
      };
    }

    const listings = response.data?.listings.map(this.transformCarsComListing) || [];
    return {
      ok: true,
      data: listings,
      metadata: response.metadata,
    };
  }

  private async getCarGurusListings(
    vehicle: Partial<VehicleData>,
    radius: number,
    maxResults: number
  ): Promise<ApiResponse<MarketListing[]>> {
    if (!this.carGurusApiKey) {
      return this.getMockListings(vehicle, 'cargurus', maxResults);
    }

    const params = new URLSearchParams({
      make: vehicle.make || '',
      model: vehicle.model || '',
      year: vehicle.year?.toString() || '',
      zip: vehicle.zipCode || '90210',
      radius: radius.toString(),
      limit: maxResults.toString(),
    });

    const response = await apiClient.get<CarGurusResponse>(
      `https://api.cargurus.com/v1/listings?${params.toString()}`,
      {
        'X-API-Key': this.carGurusApiKey,
      }
    );

    if (!response.ok) {
      return {
        ok: false,
        error: response.error,
        metadata: response.metadata,
      };
    }

    const listings = response.data?.data.map(this.transformCarGurusListing) || [];
    return {
      ok: true,
      data: listings,
      metadata: response.metadata,
    };
  }

  private getMockListings(
    vehicle: Partial<VehicleData>,
    source: string,
    count: number
  ): Promise<ApiResponse<MarketListing[]>> {
    // Generate realistic mock data for testing/demo purposes
    const basePrice = this.estimateBasePrice(vehicle);
    const listings: MarketListing[] = [];

    for (let i = 0; i < count; i++) {
      const priceVariation = (Math.random() - 0.5) * 0.4; // ±20% variation
      const mileageVariation = Math.random() * 50000 + 10000; // 10k-60k miles

      listings.push({
        id: `${source}-${i}-${Date.now()}`,
        price: Math.round(basePrice * (1 + priceVariation)),
        mileage: Math.round(mileageVariation),
        year: vehicle.year || 2020,
        make: vehicle.make || 'Honda',
        model: vehicle.model || 'Civic',
        trim: vehicle.trim,
        location: this.randomLocation(),
        source: ((["Cars.com","CarGurus","Carvana","Edmunds","Craigslist","eBay Motors","EchoPark"].includes((source as any))) ? (source as any) : "Other"),
        dealer: '', // 70% dealer listings
      });
    }

    return Promise.resolve({
      ok: true,
      data: listings,
      metadata: {
        source: `${source}_mock`,
        timestamp: new Date(),
      },
    });
  }

  private estimateBasePrice(vehicle: Partial<VehicleData>): number {
    // Simple price estimation for mock data
    const currentYear = new Date().getFullYear();
    const age = Math.max(0, currentYear - (vehicle.year || currentYear));
    
    // Base MSRP estimates by make/model (simplified)
    const baseMsrp = 30000; // Default
    const depreciationRate = 0.15; // 15% per year
    
    return Math.round(baseMsrp * Math.pow(1 - depreciationRate, age));
  }

  private randomCondition(): VehicleCondition {
    const conditions = Object.values(VehicleCondition);
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  private randomLocation(): string {
    const locations = [
      'Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Houston, TX',
      'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
      'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL'
    ];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  private transformAutotraderListing(data: AutotraderListing): MarketListing {
    return {
      id: data.id,
      price: data.price,
      mileage: data.mileage,
      year: data.year,
      make: data.make,
      model: data.model,
      trim: data.trim,
      location: `${data.location.city}, ${data.location.state}`,
      source: 'Other',
      dealer: String(((data.dealer && (data.dealer.name || (data as any).dealerName)) || '')), // Convert to boolean based on dealer presence
    };
  }

  private transformCarsComListing(data: CarsComListing): MarketListing {
    return {
      id: data.listingId,
      price: data.askingPrice,
      mileage: data.mileage,
      year: data.year,
      make: data.make,
      model: data.model,
      trim: data.trim,
      location: data.location, // Cars.com provides location as string
      source: 'Cars.com',
      dealer: String(((data as any).dealerName) || ''), // Convert to boolean based on dealer name presence
    };
  }

  private transformCarGurusListing(data: CarGurusListing): MarketListing {
    return {
      price: data.price,
      mileage: data.mileage,
      year: data.year,
      make: data.makeName,
      model: data.modelName,
      trim: data.trimName,
      location: `${data.city}, ${data.state}`,
      id: String(((data as any).id ?? (data as any).listingId ?? (data as any).listingUrl ?? Date.now())), 
      source: 'CarGurus',
      dealer: ((data as any).sellerName || (data as any).dealerName || ''),
    };
  }

  private mapCondition(condition: string): VehicleCondition {
    const conditionMap: Record<string, VehicleCondition> = {
      'excellent': VehicleCondition.EXCELLENT,
      'very good': VehicleCondition.VERY_GOOD,
      'good': VehicleCondition.GOOD,
      'fair': VehicleCondition.FAIR,
      'poor': VehicleCondition.POOR,
    };

    const normalized = condition?.toLowerCase() || 'good';
    return conditionMap[normalized] || VehicleCondition.GOOD;
  }

  private deduplicateListings(listings: MarketListing[]): MarketListing[] {
    const seen = new Set();
    return listings.filter(listing => {
      const key = `${listing.make}-${listing.model}-${listing.year}-${listing.mileage}-${listing.price}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private sortByRelevance(listings: MarketListing[], vehicle: Partial<VehicleData>): MarketListing[] {
    return listings.sort((a, b) => {
      // Sort by similarity to target vehicle
      let scoreA = 0;
      let scoreB = 0;

      // Exact matches get higher scores
      if (a.make === vehicle.make) scoreA += 10;
      if (b.make === vehicle.make) scoreB += 10;
      
      if (a.model === vehicle.model) scoreA += 10;
      if (b.model === vehicle.model) scoreB += 10;

      if (a.year === vehicle.year) scoreA += 5;
      if (b.year === vehicle.year) scoreB += 5;

      // Prefer recent listings
      const daysOldA = (Date.now() - 0) / (1000 * 60 * 60 * 24);
      const daysOldB = (Date.now() - 0) / (1000 * 60 * 60 * 24);
      scoreA += Math.max(0, 30 - daysOldA) / 10;
      scoreB += Math.max(0, 30 - daysOldB) / 10;

      return scoreB - scoreA;
    });
  }
}

export const marketListingsService = new MarketListingsService();