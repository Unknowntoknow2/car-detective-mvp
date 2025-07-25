/**
 * Enhanced Vehicle Valuation Module
 * Main entry point for the modular, ML/AI-ready valuation system
 */

// Core engine and types
export { ValuationEngine } from './engine/ValuationEngine';
export { ValuationEngineFactory, createValuationEngine, createDevelopmentEngine, ConfigPresets } from './ValuationEngineFactory';

// Types
export type {
  ValuationInput,
  ValuationResult,
  ValuationContext,
  VehiclePhoto,
  ServiceRecord,
  AccidentRecord,
  MarketListing,
  MLPredictionResult,
  ConditionAnalysisResult,
  MileageAnalysisResult,
  MarketAnalysisResult,
  PriceAdjustment,
  ConfidenceBreakdown,
  MarketDataRequest,
  MarketDataResponse
} from './types/core';

// Providers
export { MarketDataProvider, CompositeMarketDataProvider, CarsComProvider, AutoTraderProvider } from './providers/MarketDataProvider';

// ML Models
export { MLValuationModel, DefaultMLModel, TensorFlowMLModel, CloudMLModel } from './ml/MLValuationModel';

// Analyzers
export { ConditionAnalyzer } from './analyzers/ConditionAnalyzer';
export { MileageAnalyzer } from './analyzers/MileageAnalyzer';
export { MarketAnalyzer } from './analyzers/MarketAnalyzer';

// Engines
export { PriceAdjustmentEngine } from './engines/PriceAdjustmentEngine';
export { ConfidenceEngine } from './engines/ConfidenceEngine';

// Utilities
export { AuditLogger } from './utils/AuditLogger';

/**
 * Quick start example:
 * 
 * ```typescript
 * import { createValuationEngine } from '@/valuation';
 * 
 * const engine = createValuationEngine({
 *   environment: 'production',
 *   marketDataProviders: {
 *     carsComApiKey: 'your-api-key',
 *     autoTraderApiKey: 'your-api-key'
 *   },
 *   mlModel: {
 *     type: 'cloud',
 *     config: {
 *       apiEndpoint: 'https://your-ml-api.com',
 *       apiKey: 'your-ml-api-key'
 *     }
 *   }
 * });
 * 
 * const result = await engine.calculateValuation({
 *   vin: '1HGBH41JXMN109186',
 *   make: 'Honda',
 *   model: 'Civic',
 *   year: 2018,
 *   mileage: 45000,
 *   condition: 'good',
 *   zipCode: '90210'
 * });
 * 
 * console.log('Estimated Value:', result.estimatedValue);
 * console.log('Confidence Score:', result.confidenceScore);
 * ```
 */