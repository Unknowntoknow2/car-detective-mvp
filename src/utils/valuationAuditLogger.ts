// Enhanced Valuation Audit Logger with Full Metadata Support
import { supabase } from "@/integrations/supabase/client";

export interface AuditLogData {
  vin?: string;
  zipCode?: string;
  finalValue?: number;
  confidenceScore?: number;
  marketSearchStatus?: string;
  adjustments?: any[];
  sources?: string[];
  userId?: string;
  timestamp?: number;
  listingCount?: number;
  [key: string]: any;
}

export interface ValuationStepMetadata {
  label: string;
  amount: number;
  reason: string;
  timestamp: string;
  vin: string;
  userId?: string;
}

/**
 * Enhanced audit logging with service role fallback
 */
export async function logValuationAudit(
  status: string,
  data: AuditLogData
): Promise<string> {
  try {
    console.log(`📊 Enhanced Audit Log [${status}]:`, data);
    
    // First attempt: Use edge function for service role access
    try {
      const { data: edgeResponse, error: edgeError } = await supabase.functions.invoke('log-valuation-audit', {
        body: {
          vin: data.vin,
          action: status,
          input_data: {
            vin: data.vin,
            zipCode: data.zipCode,
            userId: data.userId,
            timestamp: new Date().toISOString()
          },
          output_data: {
            finalValue: data.finalValue,
            confidenceScore: data.confidenceScore,
            adjustments: data.adjustments,
            sources: data.sources,
            listingCount: data.listingCount,
            marketSearchStatus: data.marketSearchStatus,
            status
          },
          audit_data: data,
          confidence_score: data.confidenceScore,
          sources_used: data.sources || [],
          processing_time_ms: Date.now(),
          created_at: new Date().toISOString()
        }
      });

      if (!edgeError && edgeResponse?.success) {
        console.log('✅ Audit logged via edge function:', edgeResponse.id);
        return edgeResponse.id;
      } else {
        console.warn('⚠️ Edge function audit failed:', edgeError);
      }
    } catch (edgeErr) {
      console.warn('⚠️ Edge function unavailable:', edgeErr);
    }

    // Fallback 1: Direct database insert (compliance_audit_log)
    try {
      const auditEntry = {
        action: `VALUATION_${status}`,
        entity_type: 'valuation',
        entity_id: data.vin || crypto.randomUUID(),
        user_id: data.userId,
        input_data: {
          vin: data.vin,
          zipCode: data.zipCode,
          timestamp: new Date().toISOString(),
          ...data
        },
        output_data: {
          finalValue: data.finalValue,
          confidenceScore: data.confidenceScore,
          adjustments: data.adjustments,
          sources: data.sources,
          status
        },
        processing_time_ms: Date.now(),
        data_sources_used: data.sources || [],
        compliance_flags: []
      };
      
      const { data: insertedData, error: insertError } = await supabase
        .from('compliance_audit_log')
        .insert(auditEntry)
        .select('id')
        .single();
      
      if (!insertError && insertedData) {
        console.log('✅ Fallback audit logged:', insertedData.id);
        return insertedData.id;
      } else {
        console.warn('⚠️ Fallback audit failed:', insertError);
      }
    } catch (fallbackErr) {
      console.warn('⚠️ Fallback audit error:', fallbackErr);
    }

    // Fallback 2: Console logging only
    console.warn('📝 Using console-only audit logging for:', { status, vin: data.vin, finalValue: data.finalValue });
    return `console_audit_${Date.now()}`;
    
  } catch (error) {
    console.error('❌ Complete audit logging failure:', error);
    return `audit_failed_${Date.now()}`;
  }
}

/**
 * Log individual valuation steps with enhanced metadata
 */
export async function logValuationStep(
  step: string,
  vin: string,
  data: Record<string, any> = {},
  userId?: string
): Promise<void> {
  try {
    console.log(`📋 Enhanced Step [${step}]:`, { vin, ...data });
    
    // Enhanced step data with adjustment metadata
    const stepMetadata: ValuationStepMetadata = {
      label: data.label || step,
      amount: data.amount || 0,
      reason: data.reason || `${step} processing`,
      timestamp: new Date().toISOString(),
      vin,
      userId
    };
    
    const stepEntry = {
      action: `VALUATION_STEP_${step}`,
      entity_type: 'valuation_step',
      entity_id: vin,
      user_id: userId,
      input_data: {
        vin,
        step,
        stepMetadata,
        timestamp: new Date().toISOString(),
        ...data
      },
      output_data: {
        ...data,
        stepMetadata
      },
      processing_time_ms: Date.now(),
      compliance_flags: []
    };
    
    // Multi-layered persistence approach
    try {
      // Primary: Direct database insert
      const { error: dbError } = await supabase
        .from('compliance_audit_log')
        .insert(stepEntry);
      
      if (dbError) {
        console.warn('⚠️ Step audit DB failed, using fallback:', dbError.message);
        // Fallback: Store in localStorage for audit recovery
        const fallbackKey = `audit_step_${vin}_${step}_${Date.now()}`;
        localStorage.setItem(fallbackKey, JSON.stringify({ ...stepEntry, logged_at: new Date().toISOString() }));
      }
    } catch (error) {
      console.warn('⚠️ Step audit completely failed:', error);
    }
    
  } catch (error) {
    console.warn('⚠️ Error in step logging (non-blocking):', error);
  }
}

/**
 * Log valuation error with full context
 */
export async function logValuationError(
  error: Error,
  input: any
): Promise<void> {
  console.error('🚨 Enhanced Error Logging:', {
    message: error.message,
    stack: error.stack,
    input,
    timestamp: new Date().toISOString()
  });
  
  await logValuationAudit('ERROR', {
    error: error.message,
    stack: error.stack,
    input,
    vin: input?.vin,
    zipCode: input?.zipCode,
    userId: input?.userId,
    timestamp: Date.now()
  });
}

/**
 * Log adjustment application with full metadata
 */
export async function logAdjustmentStep(
  vin: string,
  adjustment: {
    label: string;
    amount: number;
    reason: string;
    baseValue: number;
    newValue: number;
  },
  userId?: string
): Promise<void> {
  const stepMetadata: ValuationStepMetadata = {
    label: adjustment.label,
    amount: adjustment.amount,
    reason: adjustment.reason,
    timestamp: new Date().toISOString(),
    vin,
    userId
  };

  await logValuationStep('ADJUSTMENT_APPLIED', vin, {
    label: adjustment.label,
    amount: adjustment.amount,
    reason: adjustment.reason,
    baseValue: adjustment.baseValue,
    newValue: adjustment.newValue,
    valueChange: adjustment.newValue - adjustment.baseValue,
    percentageChange: ((adjustment.amount / adjustment.baseValue) * 100).toFixed(2),
    stepMetadata
  }, userId);
}