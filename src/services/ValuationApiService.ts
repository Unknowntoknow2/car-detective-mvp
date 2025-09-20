import { supabase } from '@/integrations/supabase/client';
import type { ValuationResult, AuditLog } from '@/types/vehicleData';
import type { MarketListing } from '@/types/marketListing';

export interface ValuationRequest {
  vin?: string;
  make: string;
  model: string;
  trim?: string;
  year: number;
  mileage?: number;
  zip_code?: string;
  condition?: string;
  features?: string[];
  requested_by?: 'web' | 'api' | 'internal';
  meta?: Record<string, any>;
}

// Re-export ValuationResult for backward compatibility
export type { ValuationResult };

export interface SourceStatus {
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'rate_limited' | 'blocked';
  success_rate?: number;
  last_accessed?: string;
  avg_response_time_ms?: number;
}

/**
 * Comprehensive Valuation API Service
 * Implements Phase 2 API endpoints with full backend integration
 */
export class ValuationApiService {
  
  /**
   * POST /api/valuation/request
   * Creates a new valuation request and returns request_id
   */
  static async createValuationRequest(requestData: ValuationRequest): Promise<{ 
    success: boolean; 
    request_id?: string; 
    error?: string 
  }> {
    try {
      console.log('📋 Creating valuation request:', requestData);

      const { data, error } = await supabase.functions.invoke('valuation-request', {
        body: requestData
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        request_id: data.request_id
      };

    } catch (error) {
      console.error('❌ Error creating valuation request:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * POST /api/valuation/aggregate
   * Triggers comprehensive market data aggregation using OpenAI web search
   */
  static async triggerAggregation(requestId: string, sources?: string[]): Promise<{
    success: boolean;
    total_comps?: number;
    sources_processed?: number;
    execution_time_ms?: number;
    comp_summary?: any;
    error?: string;
  }> {
    try {
      console.log('🚀 Triggering comprehensive aggregation for request:', requestId);

      // First get the request details
      const { data: requestData } = await supabase
        .from('valuation_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (!requestData) {
        throw new Error('Valuation request not found');
      }

      // Market aggregation feature has been removed
      console.log('ℹ️ Market aggregation feature removed from ValuationApiService');

      return {
        success: true,
        total_comps: 0,
        sources_processed: 0,
        execution_time_ms: 0,
        comp_summary: { message: 'Market aggregation feature removed' }
      };

    } catch (error) {
      console.error('❌ Error triggering aggregation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * GET /api/valuation/result/:request_id
   * Returns comprehensive valuation results and audit trail
   */
  static async getValuationResult(requestId: string): Promise<ValuationResult | null> {
    try {
      console.log('📊 Getting valuation result for:', requestId);

      const { data, error } = await supabase.functions.invoke('valuation-result', {
        body: { request_id: requestId }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to get valuation result');
      }

      // Transform the result to match our interface
      return {
        request_id: requestId,
        status: data.valuation_request.status,
        estimated_value: data.valuation_result?.estimated_value,
        confidence_score: data.valuation_result?.confidence_score,
        comp_count: data.summary.comp_count,
        market_listings: data.market_listings.map(this.transformMarketListing),
        audit_logs: data.audit_logs.map(this.transformAuditLog),
        price_range: data.valuation_result?.price_distribution ? {
          low: data.valuation_result.price_range_low,
          high: data.valuation_result.price_range_high,
          median: data.valuation_result.estimated_value
        } : undefined,
        source_breakdown: data.valuation_result?.source_breakdown
      };

    } catch (error) {
      console.error('❌ Error getting valuation result:', error);
      return null;
    }
  }

  /**
   * GET /api/valuation/sources
   * Returns all available sources and their status
   */
  static async getSourcesStatus(): Promise<{
    sources: SourceStatus[];
    statistics: {
      total_sources: number;
      active_sources: number;
      avg_success_rate: number;
    };
  } | null> {
    try {
      console.log('📊 Getting sources status');

      const { data, error } = await supabase.functions.invoke('valuation-sources');

      if (error) {
        throw new Error(error.message);
      }

      return {
        sources: data.sources,
        statistics: data.statistics
      };

    } catch (error) {
      console.error('❌ Error getting sources status:', error);
      return null;
    }
  }

  /**
   * Poll for valuation completion
   * Useful for frontend to track progress
   */
  static async pollValuationProgress(
    requestId: string, 
    onProgress?: (result: ValuationResult) => void,
    maxAttempts: number = 30,
    intervalMs: number = 2000
  ): Promise<ValuationResult | null> {
    let attempts = 0;

    const poll = async (): Promise<ValuationResult | null> => {
      const result = await this.getValuationResult(requestId);
      
      if (result) {
        onProgress?.(result);
        
        if (result.status === 'completed' || result.status === 'failed') {
          return result;
        }
      }

      attempts++;
      if (attempts >= maxAttempts) {
        console.warn('⏰ Polling timeout reached for request:', requestId);
        return result;
      }

      // Continue polling
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      return poll();
    };

    return poll();
  }

  /**
   * Transform database market listing to API format
   */
  private static transformMarketListing(listing: any): MarketListing {
    return {
      id: listing.id,
      source: listing.source,
      source_type: listing.source_type,
      price: listing.price,
      year: listing.year,
      make: listing.make,
      model: listing.model,
      trim: listing.trim,
      vin: listing.vin,
      mileage: listing.mileage,
      condition: listing.condition,
      dealer_name: listing.dealer_name,
      location: listing.location,
      listing_url: listing.listing_url,
      is_cpo: listing.is_cpo,
      fetched_at: listing.fetched_at,
      confidence_score: listing.confidence_score
    };
  }

  /**
   * Transform database audit log to API format
   */
  private static transformAuditLog(log: any): AuditLog {
    return {
      id: log.id,
      action: log.action || log.event,
      message: log.message || log.error_message,
      created_at: log.created_at,
      execution_time_ms: log.execution_time_ms,
      raw_data: log.raw_data || log.input_data || log.output_data
    };
  }

  /**
   * Validate VIN format
   */
  static isValidVin(vin: string): boolean {
    // Basic VIN validation (17 characters, alphanumeric except I, O, Q)
    const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/;
    return vinPattern.test(vin.toUpperCase());
  }

  /**
   * Get cached valuation if available
   */
  static async getCachedValuation(vin: string): Promise<ValuationResult | null> {
    try {
      // Look for recent valuation (within 7 days) for the same VIN
      const { data: recentRequests } = await supabase
        .from('valuation_requests')
        .select('id, created_at')
        .eq('vin', vin)
        .eq('status', 'completed')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

      if (recentRequests && recentRequests.length > 0) {
        console.log('🎯 Found cached valuation for VIN:', vin);
        return await this.getValuationResult(recentRequests[0].id);
      }

      return null;
    } catch (error) {
      console.error('❌ Error checking cached valuation:', error);
      return null;
    }
  }
}

export default ValuationApiService;