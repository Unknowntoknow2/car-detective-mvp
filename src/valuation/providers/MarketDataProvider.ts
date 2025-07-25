/**
 * Market Data Provider - Abstraction for various market data sources
 * Pluggable architecture for different data providers
 */

import { MarketDataRequest, MarketDataResponse, MarketListing } from '../types/core';

export abstract class MarketDataProvider {
  abstract getMarketData(request: MarketDataRequest): Promise<MarketDataResponse>;
  
  protected normalizeListings(rawListings: any[]): MarketListing[] {
    return rawListings.map(listing => this.normalizeListing(listing));
  }

  protected abstract normalizeListing(listing: any): MarketListing;
}

/**
 * Composite Market Data Provider - Aggregates multiple sources
 */
export class CompositeMarketDataProvider extends MarketDataProvider {
  private providers: MarketDataProvider[];

  constructor(providers: MarketDataProvider[]) {
    super();
    this.providers = providers;
  }

  async getMarketData(request: MarketDataRequest): Promise<MarketDataResponse> {
    const results = await Promise.allSettled(
      this.providers.map(provider => provider.getMarketData(request))
    );

    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<MarketDataResponse> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);

    if (successfulResults.length === 0) {
      throw new Error('No market data sources available');
    }

    return this.aggregateResults(successfulResults);
  }

  private aggregateResults(results: MarketDataResponse[]): MarketDataResponse {
    const allListings = results.flatMap(r => r.localListings);
    const averagePrices = results.map(r => r.averagePrice).filter(p => p > 0);
    const totalListings = results.reduce((sum, r) => sum + r.totalListings, 0);

    return {
      localListings: allListings,
      nationalAverage: averagePrices.reduce((sum, p) => sum + p, 0) / averagePrices.length,
      historicalPrices: results.flatMap(r => r.historicalPrices),
      seasonalTrends: results[0]?.seasonalTrends || [],
      demandIndex: averagePrices.reduce((sum, r) => sum + results.find(res => res.averagePrice === r)!.demandIndex, 0) / results.length,
      averagePrice: averagePrices.reduce((sum, p) => sum + p, 0) / averagePrices.length,
      totalListings,
      priceVariance: this.calculateVariance(allListings.map(l => l.price)),
      averageTimeOnMarket: results.reduce((sum, r) => sum + r.averageTimeOnMarket, 0) / results.length,
      quality: Math.min(...results.map(r => r.quality)),
      availability: Math.max(...results.map(r => r.availability)),
      sourcesUsed: results.flatMap(r => r.sourcesUsed)
    };
  }

  private calculateVariance(prices: number[]): number {
    if (prices.length === 0) return 0;
    const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
    return Math.sqrt(variance) / mean; // Coefficient of variation
  }

  protected normalizeListing(listing: any): MarketListing {
    throw new Error('CompositeMarketDataProvider should not normalize listings directly');
  }
}

/**
 * Cars.com Market Data Provider
 */
export class CarsComProvider extends MarketDataProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async getMarketData(request: MarketDataRequest): Promise<MarketDataResponse> {
    // Implementation would make actual API calls to Cars.com
    // This is a template structure
    
    const mockData: MarketDataResponse = {
      localListings: await this.fetchListings(request),
      nationalAverage: 25000,
      historicalPrices: [],
      seasonalTrends: [],
      demandIndex: 75,
      averagePrice: 24500,
      totalListings: 15,
      priceVariance: 0.12,
      averageTimeOnMarket: 25,
      quality: 0.9,
      availability: 0.8,
      sourcesUsed: ['cars.com']
    };

    return mockData;
  }

  private async fetchListings(request: MarketDataRequest): Promise<MarketListing[]> {
    // Mock implementation - replace with actual API calls
    return [
      {
        id: 'cars_1',
        price: 24500,
        mileage: 35000,
        year: request.year,
        make: request.make,
        model: request.model,
        location: request.zipCode,
        source: 'cars.com',
        listedDate: new Date().toISOString(),
        dealer: true
      }
    ];
  }

  protected normalizeListing(listing: any): MarketListing {
    return {
      id: listing.id || `cars_${Math.random().toString(36).substr(2, 9)}`,
      price: listing.price || 0,
      mileage: listing.mileage || 0,
      year: listing.year || 0,
      make: listing.make || '',
      model: listing.model || '',
      trim: listing.trim,
      condition: listing.condition,
      location: listing.location || '',
      source: 'cars.com',
      url: listing.url,
      listedDate: listing.listedDate || new Date().toISOString(),
      features: listing.features || [],
      dealer: listing.dealer || false,
      certified: listing.certified || false
    };
  }
}

/**
 * AutoTrader Market Data Provider
 */
export class AutoTraderProvider extends MarketDataProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async getMarketData(request: MarketDataRequest): Promise<MarketDataResponse> {
    // Template implementation
    const mockData: MarketDataResponse = {
      localListings: await this.fetchListings(request),
      nationalAverage: 25200,
      historicalPrices: [],
      seasonalTrends: [],
      demandIndex: 80,
      averagePrice: 24800,
      totalListings: 12,
      priceVariance: 0.10,
      averageTimeOnMarket: 22,
      quality: 0.85,
      availability: 0.75,
      sourcesUsed: ['autotrader.com']
    };

    return mockData;
  }

  private async fetchListings(request: MarketDataRequest): Promise<MarketListing[]> {
    // Mock implementation
    return [
      {
        id: 'at_1',
        price: 24800,
        mileage: 32000,
        year: request.year,
        make: request.make,
        model: request.model,
        location: request.zipCode,
        source: 'autotrader.com',
        listedDate: new Date().toISOString(),
        dealer: true
      }
    ];
  }

  protected normalizeListing(listing: any): MarketListing {
    return {
      id: listing.id || `at_${Math.random().toString(36).substr(2, 9)}`,
      price: listing.price || 0,
      mileage: listing.mileage || 0,
      year: listing.year || 0,
      make: listing.make || '',
      model: listing.model || '',
      trim: listing.trim,
      condition: listing.condition,
      location: listing.location || '',
      source: 'autotrader.com',
      url: listing.url,
      listedDate: listing.listedDate || new Date().toISOString(),
      features: listing.features || [],
      dealer: listing.dealer || false,
      certified: listing.certified || false
    };
  }
}