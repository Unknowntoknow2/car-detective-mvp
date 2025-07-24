/**
 * Standardized logging utility for valuation flow tracing
 * Provides structured console logging for debugging and monitoring
 */

export interface ValuationLogEntry {
  timestamp: string;
  phase: 'vin-lookup' | 'follow-up' | 'valuation-engine' | 'results-display';
  vin: string;
  action: string;
  data: Record<string, any>;
  success: boolean;
  error?: string;
}

class ValuationLogger {
  private static instance: ValuationLogger;

  static getInstance(): ValuationLogger {
    if (!ValuationLogger.instance) {
      ValuationLogger.instance = new ValuationLogger();
    }
    return ValuationLogger.instance;
  }

  private formatLog(entry: ValuationLogEntry): void {
    const emoji = entry.success ? '✅' : '❌';
    const phaseColor = this.getPhaseColor(entry.phase);
    
    console.group(`${emoji} [${entry.phase.toUpperCase()}] ${entry.action}`);
    console.log(`🕐 Timestamp: ${entry.timestamp}`);
    console.log(`🚗 VIN: ${entry.vin}`);
    console.log(`📊 Success: ${entry.success}`);
    
    if (entry.error) {
      console.error(`🚨 Error: ${entry.error}`);
    }
    
    if (Object.keys(entry.data).length > 0) {
      console.log(`📋 Data:`, entry.data);
    }
    
    console.groupEnd();
  }

  private getPhaseColor(phase: string): string {
    const colors = {
      'vin-lookup': '#3B82F6',     // Blue
      'follow-up': '#10B981',      // Green  
      'valuation-engine': '#F59E0B', // Orange
      'results-display': '#8B5CF6'  // Purple
    };
    return colors[phase as keyof typeof colors] || '#6B7280';
  }

  log(entry: Omit<ValuationLogEntry, 'timestamp'>): void {
    const logEntry: ValuationLogEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };
    
    this.formatLog(logEntry);
  }

  // Convenience methods for common log types
  vinLookup(vin: string, action: string, data: Record<string, any>, success: boolean, error?: string): void {
    this.log({
      phase: 'vin-lookup',
      vin,
      action,
      data,
      success,
      error
    });
  }

  followUp(vin: string, action: string, data: Record<string, any>, success: boolean, error?: string): void {
    this.log({
      phase: 'follow-up',
      vin,
      action,
      data,
      success,
      error
    });
  }

  valuationEngine(vin: string, action: string, data: Record<string, any>, success: boolean, error?: string): void {
    this.log({
      phase: 'valuation-engine',
      vin,
      action,
      data,
      success,
      error
    });
  }

  resultsDisplay(vin: string, action: string, data: Record<string, any>, success: boolean, error?: string): void {
    this.log({
      phase: 'results-display',
      vin,
      action,
      data,
      success,
      error
    });
  }
}

export const valuationLogger = ValuationLogger.getInstance();