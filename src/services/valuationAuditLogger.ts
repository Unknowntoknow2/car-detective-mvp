// Valuation Audit Logger - Enhanced audit trail system
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

export async function logValuationAudit(payload: ValuationAuditPayload): Promise<string> {
  try {
    console.log('📝 Logging valuation audit:', {
      source: payload.source,
      confidence: payload.confidence,
      listings_count: payload.listings_count,
      baseValue: payload.baseValue
    });

    const { data, error } = await supabase
      .from('valuation_audit_logs')
      .insert({
        vin: payload.input.vin,
        action: 'valuation_calculated',
        input_data: {
          vehicle: {
            vin: payload.input.vin,
            make: payload.input.make,
            model: payload.input.model,
            year: payload.input.year,
            mileage: payload.input.mileage,
            condition: payload.input.condition,
            zipCode: payload.input.zipCode
          }
        },
        output_data: {
          estimated_value: payload.baseValue + payload.adjustments.total_adjustments || 0,
          confidence_score: payload.confidence,
          base_value: payload.baseValue,
          adjustments: payload.adjustments,
          source: payload.source
        },
        audit_data: payload,
        confidence_score: payload.confidence,
        sources_used: [payload.source],
        fallback_used: payload.source !== 'market_listings',
        quality_score: payload.confidence,
        processing_time_ms: null,
        created_at: payload.timestamp
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error saving valuation audit:', error);
      return 'audit_error_' + Date.now();
    }

    console.log('✅ Valuation audit logged with ID:', data.id);
    return data.id;

  } catch (error) {
    console.error('❌ Critical error in audit logging:', error);
    return 'audit_failed_' + Date.now();
  }
}