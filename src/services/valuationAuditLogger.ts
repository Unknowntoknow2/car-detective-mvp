// Valuation Audit Logger - Enhanced audit trail system with service role support
import { supabase } from "@/integrations/supabase/client";

export interface ValuationAuditPayload {
  source: string;
  input: any;
  baseValue: number;
  adjustments: Record<string, number>;
  confidence: number;
  listings_count: number;
  prices: number[];
  timestamp: string;
}

/**
 * Log valuation audit - Uses edge function for service role authentication
 */
export async function logValuationAudit(payload: ValuationAuditPayload): Promise<string> {
  try {
    console.log('📝 Logging valuation audit:', {
      source: payload.source,
      confidence: payload.confidence,
      listings_count: payload.listings_count,
      baseValue: payload.baseValue
    });

    // Prepare the enhanced data structure with pipeline tracking
    const auditData = {
      vin: payload.input?.vin || 'unknown',
      action: 'valuation_calculated',
      input_data: payload.input,
      output_data: {
        finalValue: payload.baseValue,
        adjustments: payload.adjustments,
        sources: Object.keys(payload.adjustments || {}),
        listingCount: payload.listings_count,
        prices: payload.prices
      },
      confidence_score: payload.confidence,
      sources_used: [`market_listings_${payload.listings_count}`],
      processing_time_ms: Date.now() - new Date(payload.timestamp).getTime(),
      created_at: payload.timestamp,
      // Enhanced audit metadata
      pipeline_metadata: {
        total_listings_fetched: payload.listings_count,
        valid_listings_processed: payload.listings_count,
        comp_set_inclusions: payload.listings_count,
        exclusion_reasons: [],
        fallback_method_used: payload.input?.fallback_method || 'none',
        quality_scores: payload.input?.quality_scores || []
      }
    };

    // Use edge function for service role access to bypass RLS
    const { data, error } = await supabase.functions.invoke('log-valuation-audit', {
      body: auditData
    });

    if (error) {
      console.error('❌ Error calling audit logging function:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      return 'audit_error_' + Date.now();
    }

    if (data?.success && data?.id) {
      console.log('✅ Valuation audit logged with ID:', data.id);
      return data.id;
    } else {
      console.error('❌ Audit logging function returned no ID:', data);
      return 'audit_error_' + Date.now();
    }

  } catch (error) {
    console.error('❌ Critical error in audit logging:', error);
    return 'audit_failed_' + Date.now();
  }
}

/**
 * Enhanced pipeline stage logging
 */
export async function logPipelineStage(
  stage: 'decode' | 'normalize' | 'match' | 'quality_score' | 'comp_inclusion',
  vin: string,
  auditId: string,
  metadata: {
    passed: boolean;
    reason?: string;
    data?: any;
    confidence?: number;
    timestamp?: string;
  }
): Promise<void> {
  try {
    console.log(`📊 Pipeline stage ${stage}:`, { vin, passed: metadata.passed, reason: metadata.reason });
    
    const stageData = {
      audit_id: auditId,
      vin: vin,
      stage: stage,
      passed: metadata.passed,
      fail_reason: metadata.reason,
      stage_data: metadata.data || {},
      confidence_score: metadata.confidence || 0,
      timestamp: metadata.timestamp || new Date().toISOString()
    };

    // Log to local storage for immediate availability
    const stageKey = `pipeline_stage_${auditId}_${stage}`;
    localStorage.setItem(stageKey, JSON.stringify(stageData));
    
    console.log(`✅ Pipeline stage ${stage} logged`);
  } catch (error) {
    console.error(`❌ Error logging pipeline stage ${stage}:`, error);
  }
}

/**
 * Fallback audit logging for when edge function is not available
 */
export async function logValuationAuditFallback(payload: ValuationAuditPayload): Promise<string> {
  try {
    console.log('📝 Fallback audit logging:', payload.source);
    
    // Store in local storage as fallback
    const auditId = 'local_audit_' + Date.now();
    const auditData = {
      id: auditId,
      ...payload,
      logged_at: new Date().toISOString()
    };
    
    localStorage.setItem(`audit_${auditId}`, JSON.stringify(auditData));
    console.log('✅ Audit logged locally:', auditId);
    
    return auditId;
  } catch (error) {
    console.error('❌ Even fallback audit logging failed:', error);
    return 'audit_failed_' + Date.now();
  }
}