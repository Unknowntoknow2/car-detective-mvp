/**
 * Enhanced Modular Vehicle Valuation Engine
 * ML/AI-ready architecture with pluggable components
 * Enterprise-grade with audit trails and extensibility
 */

import { ValuationInput, ValuationResult, ValuationContext } from '../types/core';
import { MarketDataProvider } from '../providers/MarketDataProvider';
import { MLValuationModel } from '../ml/MLValuationModel';
import { ConditionAnalyzer } from '../analyzers/ConditionAnalyzer';
import { MileageAnalyzer } from '../analyzers/MileageAnalyzer';
import { MarketAnalyzer } from '../analyzers/MarketAnalyzer';
import { PriceAdjustmentEngine } from '../engines/PriceAdjustmentEngine';
import { ConfidenceEngine } from '../engines/ConfidenceEngine';
import { AuditLogger } from '../utils/AuditLogger';

export class ValuationEngine {
  private marketDataProvider: MarketDataProvider;
  private mlModel: MLValuationModel;
  private conditionAnalyzer: ConditionAnalyzer;
  private mileageAnalyzer: MileageAnalyzer;
  private marketAnalyzer: MarketAnalyzer;
  private adjustmentEngine: PriceAdjustmentEngine;
  private confidenceEngine: ConfidenceEngine;
  private auditLogger: AuditLogger;

  constructor(
    marketDataProvider: MarketDataProvider,
    mlModel?: MLValuationModel
  ) {
    this.marketDataProvider = marketDataProvider;
    this.mlModel = mlModel || new MLValuationModel();
    this.conditionAnalyzer = new ConditionAnalyzer();
    this.mileageAnalyzer = new MileageAnalyzer();
    this.marketAnalyzer = new MarketAnalyzer();
    this.adjustmentEngine = new PriceAdjustmentEngine();
    this.confidenceEngine = new ConfidenceEngine();
    this.auditLogger = new AuditLogger();
  }

  /**
   * Main valuation method - orchestrates the entire valuation process
   */
  async calculateValuation(input: ValuationInput): Promise<ValuationResult> {
    const context: ValuationContext = {
      startTime: Date.now(),
      input,
      debug: process.env.NODE_ENV === 'development'
    };

    try {
      this.auditLogger.logStart(context);

      // 1. Validate input data
      this.validateInput(input);

      // 2. Gather market data
      const marketData = await this.marketDataProvider.getMarketData({
        vin: input.vin,
        make: input.make,
        model: input.model,
        year: input.year,
        zipCode: input.zipCode,
        radius: input.searchRadius || 50
      });

      // 3. Calculate base valuation using ML model
      const baseValuation = await this.mlModel.predict({
        vehicleData: input,
        marketData,
        historicalData: marketData.historicalPrices
      });

      // 4. Apply condition analysis
      const conditionAdjustment = this.conditionAnalyzer.analyze({
        condition: input.condition,
        photos: input.photos,
        serviceHistory: input.serviceHistory,
        accidentHistory: input.accidentHistory
      });

      // 5. Apply mileage analysis
      const mileageAdjustment = this.mileageAnalyzer.analyze({
        mileage: input.mileage,
        year: input.year,
        vehicleType: input.bodyType
      });

      // 6. Apply market analysis
      const marketAdjustment = this.marketAnalyzer.analyze({
        localMarket: marketData.localListings,
        nationalMarket: marketData.nationalAverage,
        seasonality: marketData.seasonalTrends,
        demand: marketData.demandIndex
      });

      // 7. Calculate all adjustments
      const adjustments = this.adjustmentEngine.calculateAdjustments({
        baseValue: baseValuation.value,
        conditionAdjustment,
        mileageAdjustment,
        marketAdjustment,
        additionalFactors: input.additionalFactors
      });

      // 8. Calculate final value
      const finalValue = this.adjustmentEngine.applyAdjustments(
        baseValuation.value,
        adjustments
      );

      // 9. Calculate confidence score
      const confidence = this.confidenceEngine.calculateConfidence({
        dataQuality: marketData.quality,
        mlConfidence: baseValuation.confidence,
        marketDataAvailability: marketData.availability,
        adjustmentFactors: adjustments
      });

      // 10. Build result
      const result: ValuationResult = {
        id: this.generateValuationId(),
        estimatedValue: finalValue,
        priceRange: this.calculatePriceRange(finalValue, confidence.score),
        confidenceScore: confidence.score,
        valuationMethod: this.determineValuationMethod(marketData, baseValuation),
        
        baseValuation: {
          value: baseValuation.value,
          source: 'ML_MODEL',
          confidence: baseValuation.confidence
        },

        adjustments: adjustments.map(adj => ({
          factor: adj.factor,
          impact: adj.impact,
          description: adj.description,
          confidence: adj.confidence,
          category: adj.category
        })),

        marketInsights: {
          avgMarketplacePrice: marketData.averagePrice,
          listingCount: marketData.totalListings,
          priceVariance: marketData.priceVariance,
          demandIndex: marketData.demandIndex,
          timeOnMarket: marketData.averageTimeOnMarket,
          competitivePosition: this.determineCompetitivePosition(finalValue, marketData.averagePrice),
          priceRecommendation: this.generatePriceRecommendation(finalValue, marketData)
        },

        confidenceBreakdown: confidence.breakdown,

        metadata: {
          timestamp: new Date().toISOString(),
          processingTimeMs: Date.now() - context.startTime,
          version: '2.0.0',
          dataSourcesUsed: marketData.sourcesUsed
        }
      };

      this.auditLogger.logSuccess(context, result);
      return result;

    } catch (error) {
      this.auditLogger.logError(context, error);
      throw error;
    }
  }

  /**
   * Validate input data integrity
   */
  private validateInput(input: ValuationInput): void {
    if (!input.vin || input.vin.length !== 17) {
      throw new Error('Invalid VIN provided');
    }

    if (!input.year || input.year < 1900 || input.year > new Date().getFullYear() + 1) {
      throw new Error('Invalid vehicle year');
    }

    if (!input.mileage || input.mileage < 0 || input.mileage > 1000000) {
      throw new Error('Invalid mileage value');
    }

    if (!input.zipCode || !/^\d{5}(-\d{4})?$/.test(input.zipCode)) {
      throw new Error('Invalid ZIP code');
    }
  }

  /**
   * Generate unique valuation ID
   */
  private generateValuationId(): string {
    return `val_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calculate price range based on confidence
   */
  private calculatePriceRange(value: number, confidence: number): [number, number] {
    const variance = Math.max(0.05, (100 - confidence) / 100 * 0.2);
    return [
      Math.round(value * (1 - variance)),
      Math.round(value * (1 + variance))
    ];
  }

  /**
   * Determine which valuation method was primarily used
   */
  private determineValuationMethod(marketData: any, baseValuation: any): string {
    if (marketData.totalListings > 10 && marketData.quality > 0.8) {
      return 'MARKET_DATA_PRIMARY';
    } else if (baseValuation.confidence > 0.7) {
      return 'ML_MODEL_PRIMARY';
    } else {
      return 'HYBRID_APPROACH';
    }
  }

  /**
   * Determine competitive position
   */
  private determineCompetitivePosition(value: number, marketAverage: number): 'below_market' | 'at_market' | 'above_market' {
    const difference = (value - marketAverage) / marketAverage;
    if (difference < -0.05) return 'below_market';
    if (difference > 0.05) return 'above_market';
    return 'at_market';
  }

  /**
   * Generate pricing recommendation
   */
  private generatePriceRecommendation(value: number, marketData: any): string {
    const position = this.determineCompetitivePosition(value, marketData.averagePrice);
    
    switch (position) {
      case 'below_market':
        return 'This vehicle is priced competitively below market average, likely to sell quickly';
      case 'above_market':
        return 'This vehicle is priced above market average, may take longer to sell';
      default:
        return 'This vehicle is priced at market average, good balance of value and marketability';
    }
  }

  /**
   * Enable/disable ML model
   */
  setMLModel(model: MLValuationModel | null): void {
    this.mlModel = model || new MLValuationModel();
  }

  /**
   * Get engine performance metrics
   */
  async getPerformanceMetrics(): Promise<any> {
    return this.auditLogger.getMetrics();
  }

  /**
   * Batch valuation for multiple vehicles
   */
  async batchValuation(inputs: ValuationInput[]): Promise<ValuationResult[]> {
    const results = await Promise.allSettled(
      inputs.map(input => this.calculateValuation(input))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        // Return error result
        return {
          id: `error_${index}`,
          estimatedValue: 0,
          priceRange: [0, 0] as [number, number],
          confidenceScore: 0,
          valuationMethod: 'ERROR',
          baseValuation: {
            value: 0,
            source: 'ML_MODEL' as const,
            confidence: 0
          },
          adjustments: [],
          marketInsights: {
            avgMarketplacePrice: 0,
            listingCount: 0,
            priceVariance: 0,
            demandIndex: 0,
            timeOnMarket: 0,
            competitivePosition: 'at_market' as const
          },
          confidenceBreakdown: {
            dataQuality: 0,
            marketDataAvailability: 0,
            vehicleDataCompleteness: 0,
            mlModelConfidence: 0,
            overallConfidence: 0,
            factors: [],
            recommendations: [`Error: ${result.reason}`]
          },
          metadata: {
            timestamp: new Date().toISOString(),
            processingTimeMs: 0,
            version: '2.0.0',
            dataSourcesUsed: []
          }
        };
      }
    });
  }
}