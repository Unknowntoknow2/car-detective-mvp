/**
 * Valuation Engine Factory - Easy instantiation and configuration
 */

import { ValuationEngine } from './engine/ValuationEngine';
import { MarketDataProvider, CompositeMarketDataProvider, CarsComProvider, AutoTraderProvider } from './providers/MarketDataProvider';
import { MLValuationModel, DefaultMLModel, TensorFlowMLModel, CloudMLModel } from './ml/MLValuationModel';

export interface ValuationEngineConfig {
  // Market data providers
  marketDataProviders?: {
    carsComApiKey?: string;
    autoTraderApiKey?: string;
    customProviders?: MarketDataProvider[];
  };
  
  // ML model configuration
  mlModel?: {
    type: 'default' | 'tensorflow' | 'cloud';
    config?: {
      modelPath?: string;
      apiEndpoint?: string;
      apiKey?: string;
    };
  };
  
  // Feature flags
  features?: {
    enablePhotAnalysis?: boolean;
    enableServiceHistoryAnalysis?: boolean;
    enableMarketTrends?: boolean;
    enableBatchProcessing?: boolean;
  };
  
  // Environment settings
  environment?: 'development' | 'staging' | 'production';
  debug?: boolean;
}

export class ValuationEngineFactory {
  
  /**
   * Create a production-ready valuation engine
   */
  static createProductionEngine(config: ValuationEngineConfig): ValuationEngine {
    const marketDataProvider = this.createMarketDataProvider(config);
    const mlModel = this.createMLModel(config);
    
    const engine = new ValuationEngine(marketDataProvider, mlModel);
    
    // Configure for production
    if (config.environment === 'production') {
      this.configureForProduction(engine, config);
    }
    
    return engine;
  }

  /**
   * Create a development/testing engine with mocked data
   */
  static createDevelopmentEngine(): ValuationEngine {
    const mockProvider = new MockMarketDataProvider();
    const defaultModel = new DefaultMLModel();
    
    return new ValuationEngine(mockProvider, defaultModel);
  }

  /**
   * Create engine with specific providers (for testing)
   */
  static createCustomEngine(
    marketDataProvider: MarketDataProvider,
    mlModel?: MLValuationModel
  ): ValuationEngine {
    return new ValuationEngine(marketDataProvider, mlModel);
  }

  /**
   * Create engine with default configuration
   */
  static createDefaultEngine(): ValuationEngine {
    const config: ValuationEngineConfig = {
      mlModel: { type: 'default' },
      environment: 'development',
      debug: true
    };
    
    return this.createProductionEngine(config);
  }

  private static createMarketDataProvider(config: ValuationEngineConfig): MarketDataProvider {
    const providers: MarketDataProvider[] = [];
    
    // Add configured providers
    if (config.marketDataProviders?.carsComApiKey) {
      providers.push(new CarsComProvider(config.marketDataProviders.carsComApiKey));
    }
    
    if (config.marketDataProviders?.autoTraderApiKey) {
      providers.push(new AutoTraderProvider(config.marketDataProviders.autoTraderApiKey));
    }
    
    // Add custom providers
    if (config.marketDataProviders?.customProviders) {
      providers.push(...config.marketDataProviders.customProviders);
    }
    
    // Fallback to mock provider for development
    if (providers.length === 0) {
      providers.push(new MockMarketDataProvider());
    }
    
    return new CompositeMarketDataProvider(providers);
  }

  private static createMLModel(config: ValuationEngineConfig): MLValuationModel {
    const mlConfig = config.mlModel || { type: 'default' };
    
    switch (mlConfig.type) {
      case 'tensorflow':
        const tfModel = new TensorFlowMLModel();
        if (mlConfig.config?.modelPath) {
          tfModel.loadModel(mlConfig.config.modelPath);
        }
        return tfModel;
        
      case 'cloud':
        if (!mlConfig.config?.apiEndpoint || !mlConfig.config?.apiKey) {
          console.warn('Cloud ML config incomplete, falling back to default model');
          return new DefaultMLModel();
        }
        return new CloudMLModel(mlConfig.config.apiEndpoint, mlConfig.config.apiKey);
        
      case 'default':
      default:
        return new DefaultMLModel();
    }
  }

  private static configureForProduction(engine: ValuationEngine, config: ValuationEngineConfig): void {
    // Production-specific configurations
    // - Set up monitoring
    // - Configure caching
    // - Set up error handling
    // - Configure audit logging
    
    console.log('Configuring valuation engine for production environment');
    
    // Example: Set up performance monitoring
    setInterval(async () => {
      const metrics = await engine.getPerformanceMetrics();
      console.log('[METRICS]', metrics);
    }, 300000); // Log metrics every 5 minutes
  }
}

/**
 * Mock Market Data Provider for development/testing
 */
class MockMarketDataProvider extends MarketDataProvider {
  async getMarketData(request: any): Promise<any> {
    // Return mock data for development
    return {
      localListings: [
        {
          id: 'mock_1',
          price: 24500,
          mileage: 35000,
          year: request.year,
          make: request.make,
          model: request.model,
          location: request.zipCode,
          source: 'mock',
          listedDate: new Date().toISOString(),
          dealer: true
        },
        {
          id: 'mock_2',
          price: 23800,
          mileage: 42000,
          year: request.year,
          make: request.make,
          model: request.model,
          location: request.zipCode,
          source: 'mock',
          listedDate: new Date().toISOString(),
          dealer: false
        }
      ],
      nationalAverage: 24000,
      historicalPrices: [
        { date: '2024-01-01', price: 25000, mileage: 30000, source: 'mock' },
        { date: '2024-02-01', price: 24500, mileage: 32000, source: 'mock' }
      ],
      seasonalTrends: [
        { month: 1, multiplier: 0.95, confidence: 0.8 },
        { month: 2, multiplier: 0.97, confidence: 0.8 },
        { month: 3, multiplier: 1.02, confidence: 0.8 },
        { month: 4, multiplier: 1.05, confidence: 0.8 },
        { month: 5, multiplier: 1.08, confidence: 0.8 },
        { month: 6, multiplier: 1.03, confidence: 0.8 },
        { month: 7, multiplier: 1.00, confidence: 0.8 },
        { month: 8, multiplier: 0.98, confidence: 0.8 },
        { month: 9, multiplier: 1.02, confidence: 0.8 },
        { month: 10, multiplier: 1.05, confidence: 0.8 },
        { month: 11, multiplier: 0.96, confidence: 0.8 },
        { month: 12, multiplier: 0.93, confidence: 0.8 }
      ],
      demandIndex: 75,
      averagePrice: 24150,
      totalListings: 2,
      priceVariance: 0.15,
      averageTimeOnMarket: 28,
      quality: 0.7,
      availability: 0.6,
      sourcesUsed: ['mock']
    };
  }

  protected normalizeListing(listing: any): any {
    return listing;
  }
}

/**
 * Easy-to-use helper functions
 */
export const createValuationEngine = (config?: ValuationEngineConfig) => {
  if (config) {
    return ValuationEngineFactory.createProductionEngine(config);
  } else {
    return ValuationEngineFactory.createDefaultEngine();
  }
};

export const createDevelopmentEngine = () => {
  return ValuationEngineFactory.createDevelopmentEngine();
};

/**
 * Configuration presets
 */
export const ConfigPresets = {
  development: {
    mlModel: { type: 'default' as const },
    environment: 'development' as const,
    debug: true,
    features: {
      enablePhotAnalysis: true,
      enableServiceHistoryAnalysis: true,
      enableMarketTrends: true,
      enableBatchProcessing: false
    }
  },
  
  staging: {
    mlModel: { type: 'default' as const },
    environment: 'staging' as const,
    debug: true,
    features: {
      enablePhotAnalysis: true,
      enableServiceHistoryAnalysis: true,
      enableMarketTrends: true,
      enableBatchProcessing: true
    }
  },
  
  production: {
    mlModel: { type: 'cloud' as const },
    environment: 'production' as const,
    debug: false,
    features: {
      enablePhotAnalysis: true,
      enableServiceHistoryAnalysis: true,
      enableMarketTrends: true,
      enableBatchProcessing: true
    }
  }
} as const;