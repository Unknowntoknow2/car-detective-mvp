// Supabase Audit Log Client - Handles audit trail persistence
import { supabase } from "@/integrations/supabase/client";
import { EnhancedAuditLog } from "@/types/valuation";

export async function saveAuditLog(audit: EnhancedAuditLog): Promise<string> {
  try {
      vin: audit.vin,
      sources: audit.sources,
      confidence: audit.confidence_score,
      fallbackUsed: audit.fallbackUsed
    });

    const { data, error } = await supabase
      .from('valuation_audit_logs')
      .insert({
        vin: audit.vin,
        valuation_request_id: audit.valuationId,
        action: 'valuation_calculated',
        input_data: {
          vin: audit.vin,
          zip: audit.zip,
          mileage: audit.mileage,
          condition: audit.condition
        },
        output_data: {
          confidence_score: audit.confidence_score,
          sources: audit.sources,
          fallback_used: audit.fallbackUsed,
          quality: audit.quality
        },
        audit_data: audit,
        confidence_score: audit.confidence_score,
        sources_used: audit.sources,
        fallback_used: audit.fallbackUsed,
        quality_score: audit.quality,
        processing_time_ms: null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error saving audit log:', error);
      throw new Error(`Failed to save audit log: ${error.message}`);
    }

    return data.id;

  } catch (error) {
    console.error('❌ Critical error saving audit log:', error);
    // Return a placeholder ID rather than failing the entire valuation
    return 'audit_failed_' + Date.now();
  }
}

export async function getAuditLog(auditId: string): Promise<EnhancedAuditLog | null> {
  try {
    const { data, error } = await supabase
      .from('valuation_audit_logs')
      .select('*')
      .eq('id', auditId)
      .single();

    if (error) {
      console.error('❌ Error fetching audit log:', error);
      return null;
    }

    return data.audit_data as EnhancedAuditLog;

  } catch (error) {
    console.error('❌ Error getting audit log:', error);
    return null;
  }
}

export async function getValuationAuditHistory(vin: string): Promise<EnhancedAuditLog[]> {
  try {
    const { data, error } = await supabase
      .from('valuation_audit_logs')
      .select('*')
      .eq('vin', vin)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching audit history:', error);
      return [];
    }

    return data.map(log => log.audit_data as EnhancedAuditLog).filter(Boolean);

  } catch (error) {
    console.error('❌ Error getting audit history:', error);
    return [];
  }
}