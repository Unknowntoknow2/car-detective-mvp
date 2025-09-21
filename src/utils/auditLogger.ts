/**
 * Audit logging utility for valuation calculations
 * Ensures all valuation steps are traceable and auditable
 */

export interface ValuationAuditEntry {
  id: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  action: string;
  entityType: 'valuation' | 'adjustment' | 'calculation';
  entityId: string;
  inputData: Record<string, any>;
  outputData: Record<string, any>;
  dataSourcesUsed: string[];
  calculationMethod: string;
  confidenceFactors?: Record<string, number>;
  processingTimeMs?: number;
}

export class ValuationAuditLogger {
  private static instance: ValuationAuditLogger;
  private auditQueue: ValuationAuditEntry[] = [];

  static getInstance(): ValuationAuditLogger {
    if (!ValuationAuditLogger.instance) {
      ValuationAuditLogger.instance = new ValuationAuditLogger();
    }
    return ValuationAuditLogger.instance;
  }

  /**
   * Log a valuation calculation step
   */
  logValuationStep(entry: Omit<ValuationAuditEntry, 'id' | 'timestamp'>): void {
    const auditEntry: ValuationAuditEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...entry
    };

    this.auditQueue.push(auditEntry);
    
    // Log to console for development
      action: auditEntry.action,
      entityType: auditEntry.entityType,
      entityId: auditEntry.entityId,
      dataSourcesUsed: auditEntry.dataSourcesUsed,
      calculationMethod: auditEntry.calculationMethod
    });
  }

  /**
   * Log valuation data sources used
   */
  logDataSources(valuationId: string, sources: {
    name: string;
    type: 'market_listing' | 'msrp_data' | 'adjustment_factor' | 'market_trend';
    recordCount?: number;
    confidence?: number;
    lastUpdated?: string;
  }[]): void {
    this.logValuationStep({
      action: 'data_sources_recorded',
      entityType: 'valuation',
      entityId: valuationId,
      inputData: { sources },
      outputData: { 
        totalSources: sources.length,
        sourceTypes: sources.map(s => s.type)
      },
      dataSourcesUsed: sources.map(s => s.name),
      calculationMethod: 'data_source_audit'
    });
  }

  /**
   * Log market data usage
   */
  logMarketDataUsage(valuationId: string, marketData: {
    listingsCount: number;
    averagePrice: number;
    priceRange: [number, number];
    dataQuality: 'high' | 'medium' | 'low';
    sources: string[];
  }): void {
    this.logValuationStep({
      action: 'market_data_analyzed',
      entityType: 'calculation',
      entityId: `${valuationId}_market`,
      inputData: marketData,
      outputData: {
        averagePrice: marketData.averagePrice,
        dataQuality: marketData.dataQuality
      },
      dataSourcesUsed: marketData.sources,
      calculationMethod: 'market_analysis',
      confidenceFactors: {
        listingCount: marketData.listingsCount,
        dataQuality: marketData.dataQuality === 'high' ? 1 : marketData.dataQuality === 'medium' ? 0.7 : 0.4
      }
    });
  }

  /**
   * Log adjustment application
   */
  logAdjustment(valuationId: string, adjustment: {
    factor: string;
    impact: number;
    baseValue: number;
    adjustedValue: number;
    source: string;
    confidence: number;
  }): void {
    this.logValuationStep({
      action: 'adjustment_applied',
      entityType: 'adjustment',
      entityId: `${valuationId}_${adjustment.factor}`,
      inputData: {
        factor: adjustment.factor,
        baseValue: adjustment.baseValue,
        adjustmentAmount: adjustment.impact
      },
      outputData: {
        adjustedValue: adjustment.adjustedValue,
        impactPercentage: (adjustment.impact / adjustment.baseValue) * 100
      },
      dataSourcesUsed: [adjustment.source],
      calculationMethod: 'adjustment_application',
      confidenceFactors: {
        adjustmentConfidence: adjustment.confidence
      }
    });
  }

  /**
   * Get audit trail for a valuation
   */
  getAuditTrail(valuationId: string): ValuationAuditEntry[] {
    return this.auditQueue.filter(entry => 
      entry.entityId === valuationId || 
      entry.entityId.startsWith(`${valuationId}_`)
    );
  }

  /**
   * Clear audit queue (for testing or cleanup)
   */
  clearAuditQueue(): void {
    this.auditQueue = [];
  }

  /**
   * Get summary of data sources for a valuation
   */
  getDataSourceSummary(valuationId: string): {
    totalSources: number;
    sourceTypes: string[];
    calculationMethods: string[];
    hasRealMarketData: boolean;
    hasConfidenceData: boolean;
  } {
    const entries = this.getAuditTrail(valuationId);
    const allSources = entries.flatMap(e => e.dataSourcesUsed);
    const uniqueSources = [...new Set(allSources)];
    const calculationMethods = [...new Set(entries.map(e => e.calculationMethod))];
    
    return {
      totalSources: uniqueSources.length,
      sourceTypes: uniqueSources,
      calculationMethods,
      hasRealMarketData: entries.some(e => e.action === 'market_data_analyzed'),
      hasConfidenceData: entries.some(e => e.confidenceFactors && Object.keys(e.confidenceFactors).length > 0)
    };
  }
}

// Export singleton instance
export const auditLogger = ValuationAuditLogger.getInstance();