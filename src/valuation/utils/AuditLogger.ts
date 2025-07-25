/**
 * Audit Logger - Enterprise-grade audit trail for valuations
 */

import { ValuationContext, ValuationResult } from '../types/core';

export interface AuditEntry {
  id: string;
  timestamp: string;
  event: 'valuation_start' | 'valuation_success' | 'valuation_error' | 'valuation_update';
  context: Partial<ValuationContext>;
  result?: Partial<ValuationResult>;
  error?: any;
  metadata: {
    userAgent?: string;
    ipAddress?: string;
    sessionId?: string;
    userId?: string;
    processingTimeMs?: number;
  };
}

export interface PerformanceMetrics {
  totalValuations: number;
  averageProcessingTime: number;
  successRate: number;
  errorRate: number;
  averageConfidenceScore: number;
  lastUpdated: string;
  dailyStats: DailyStats[];
}

export interface DailyStats {
  date: string;
  valuations: number;
  avgProcessingTime: number;
  successRate: number;
  avgConfidence: number;
}

export class AuditLogger {
  private auditEntries: AuditEntry[] = [];
  private maxEntries: number = 10000; // Keep last 10k entries in memory
  
  /**
   * Log valuation start
   */
  logStart(context: ValuationContext): void {
    const entry: AuditEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      event: 'valuation_start',
      context: {
        startTime: context.startTime,
        input: {
          vin: context.input.vin,
          make: context.input.make,
          model: context.input.model,
          year: context.input.year,
          zipCode: context.input.zipCode
        }
      },
      metadata: {
        sessionId: context.requestId,
        userId: context.userId
      }
    };

    this.addEntry(entry);
    
    if (context.debug) {
      console.log('[AUDIT] Valuation started:', entry);
    }
  }

  /**
   * Log successful valuation
   */
  logSuccess(context: ValuationContext, result: ValuationResult): void {
    const processingTime = Date.now() - context.startTime;
    
    const entry: AuditEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      event: 'valuation_success',
      context: {
        startTime: context.startTime,
        input: {
          vin: context.input.vin,
          make: context.input.make,
          model: context.input.model,
          year: context.input.year
        }
      },
      result: {
        id: result.id,
        estimatedValue: result.estimatedValue,
        confidenceScore: result.confidenceScore,
        valuationMethod: result.valuationMethod
      },
      metadata: {
        sessionId: context.requestId,
        userId: context.userId,
        processingTimeMs: processingTime
      }
    };

    this.addEntry(entry);
    
    if (context.debug) {
      console.log('[AUDIT] Valuation completed:', entry);
    }

    // Log to external systems if configured
    this.sendToExternalAudit(entry);
  }

  /**
   * Log valuation error
   */
  logError(context: ValuationContext, error: any): void {
    const processingTime = Date.now() - context.startTime;
    
    const entry: AuditEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      event: 'valuation_error',
      context: {
        startTime: context.startTime,
        input: {
          vin: context.input.vin,
          make: context.input.make,
          model: context.input.model,
          year: context.input.year
        }
      },
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      metadata: {
        sessionId: context.requestId,
        userId: context.userId,
        processingTimeMs: processingTime
      }
    };

    this.addEntry(entry);
    
    console.error('[AUDIT] Valuation error:', entry);
    
    // Send error to monitoring systems
    this.sendErrorToMonitoring(entry);
  }

  /**
   * Get performance metrics
   */
  async getMetrics(): Promise<PerformanceMetrics> {
    const entries = this.auditEntries;
    const successEntries = entries.filter(e => e.event === 'valuation_success');
    const errorEntries = entries.filter(e => e.event === 'valuation_error');
    const totalValuations = successEntries.length + errorEntries.length;

    const metrics: PerformanceMetrics = {
      totalValuations,
      averageProcessingTime: this.calculateAverageProcessingTime(successEntries),
      successRate: totalValuations > 0 ? (successEntries.length / totalValuations) * 100 : 0,
      errorRate: totalValuations > 0 ? (errorEntries.length / totalValuations) * 100 : 0,
      averageConfidenceScore: this.calculateAverageConfidence(successEntries),
      lastUpdated: new Date().toISOString(),
      dailyStats: this.calculateDailyStats(entries)
    };

    return metrics;
  }

  /**
   * Get audit entries with filters
   */
  getAuditEntries(filters?: {
    event?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
  }): AuditEntry[] {
    let filteredEntries = [...this.auditEntries];

    if (filters) {
      if (filters.event) {
        filteredEntries = filteredEntries.filter(e => e.event === filters.event);
      }
      
      if (filters.userId) {
        filteredEntries = filteredEntries.filter(e => e.metadata.userId === filters.userId);
      }
      
      if (filters.dateFrom) {
        filteredEntries = filteredEntries.filter(e => e.timestamp >= filters.dateFrom!);
      }
      
      if (filters.dateTo) {
        filteredEntries = filteredEntries.filter(e => e.timestamp <= filters.dateTo!);
      }
      
      if (filters.limit) {
        filteredEntries = filteredEntries.slice(-filters.limit);
      }
    }

    return filteredEntries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  /**
   * Export audit data
   */
  exportAuditData(format: 'json' | 'csv' = 'json'): string {
    const entries = this.auditEntries;
    
    if (format === 'json') {
      return JSON.stringify(entries, null, 2);
    } else {
      // CSV format
      const headers = ['id', 'timestamp', 'event', 'vin', 'estimatedValue', 'confidenceScore', 'processingTimeMs', 'userId'];
      const csvRows = [headers.join(',')];
      
      for (const entry of entries) {
        const row = [
          entry.id,
          entry.timestamp,
          entry.event,
          entry.context.input?.vin || '',
          entry.result?.estimatedValue || '',
          entry.result?.confidenceScore || '',
          entry.metadata.processingTimeMs || '',
          entry.metadata.userId || ''
        ];
        csvRows.push(row.join(','));
      }
      
      return csvRows.join('\n');
    }
  }

  /**
   * Clear old audit entries
   */
  cleanup(retentionDays: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    const cutoffIso = cutoffDate.toISOString();
    
    const initialCount = this.auditEntries.length;
    this.auditEntries = this.auditEntries.filter(entry => entry.timestamp > cutoffIso);
    const removedCount = initialCount - this.auditEntries.length;
    
    console.log(`[AUDIT] Cleaned up ${removedCount} old audit entries`);
  }

  // Private methods
  private addEntry(entry: AuditEntry): void {
    this.auditEntries.push(entry);
    
    // Keep only the most recent entries
    if (this.auditEntries.length > this.maxEntries) {
      this.auditEntries = this.auditEntries.slice(-this.maxEntries);
    }
  }

  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateAverageProcessingTime(entries: AuditEntry[]): number {
    const timings = entries
      .map(e => e.metadata.processingTimeMs)
      .filter((time): time is number => typeof time === 'number');
    
    return timings.length > 0 
      ? timings.reduce((sum, time) => sum + time, 0) / timings.length
      : 0;
  }

  private calculateAverageConfidence(entries: AuditEntry[]): number {
    const confidenceScores = entries
      .map(e => e.result?.confidenceScore)
      .filter((score): score is number => typeof score === 'number');
    
    return confidenceScores.length > 0
      ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length
      : 0;
  }

  private calculateDailyStats(entries: AuditEntry[]): DailyStats[] {
    const dailyGroups: Record<string, AuditEntry[]> = {};
    
    for (const entry of entries) {
      const date = entry.timestamp.split('T')[0];
      if (!dailyGroups[date]) {
        dailyGroups[date] = [];
      }
      dailyGroups[date].push(entry);
    }

    const dailyStats: DailyStats[] = [];
    
    for (const [date, dayEntries] of Object.entries(dailyGroups)) {
      const valuationEntries = dayEntries.filter(e => 
        e.event === 'valuation_success' || e.event === 'valuation_error'
      );
      const successEntries = dayEntries.filter(e => e.event === 'valuation_success');
      
      if (valuationEntries.length > 0) {
        dailyStats.push({
          date,
          valuations: valuationEntries.length,
          avgProcessingTime: this.calculateAverageProcessingTime(successEntries),
          successRate: (successEntries.length / valuationEntries.length) * 100,
          avgConfidence: this.calculateAverageConfidence(successEntries)
        });
      }
    }

    return dailyStats.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30); // Last 30 days
  }

  private async sendToExternalAudit(entry: AuditEntry): Promise<void> {
    // TODO: Implement external audit system integration
    // This could send to services like:
    // - Elasticsearch for log aggregation
    // - AWS CloudWatch for monitoring
    // - Custom audit service
    
    if (process.env.AUDIT_WEBHOOK_URL) {
      try {
        await fetch(process.env.AUDIT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
        });
      } catch (error) {
        console.warn('[AUDIT] Failed to send to external audit system:', error);
      }
    }
  }

  private async sendErrorToMonitoring(entry: AuditEntry): Promise<void> {
    // TODO: Implement error monitoring integration
    // This could send to services like:
    // - Sentry for error tracking
    // - DataDog for monitoring
    // - Custom monitoring service
    
    if (process.env.ERROR_MONITORING_URL) {
      try {
        await fetch(process.env.ERROR_MONITORING_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: entry.error,
            context: entry.context,
            metadata: entry.metadata
          })
        });
      } catch (error) {
        console.warn('[AUDIT] Failed to send error to monitoring system:', error);
      }
    }
  }
}