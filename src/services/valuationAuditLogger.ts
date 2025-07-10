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

    // Use edge function for service role access to bypass RLS
    const { data, error } = await supabase.functions.invoke('log-valuation-audit', {
      body: payload
    });

    if (error) {
      console.error('❌ Error calling audit logging function:', error);
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