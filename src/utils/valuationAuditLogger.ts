// Enhanced Valuation Audit Logger with Full Metadata Support
import { supabase } from "@/integrations/supabase/client";
import { createClient } from "@supabase/supabase-js";

// Create supabaseAdmin client for service role access
const supabaseAdmin = createClient(
  "https://xltxqqzattxogxtqrggt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTQ1NjEyNiwiZXhwIjoyMDYxMDMyMTI2fQ.aQOWzgaxKLHmI9uDwOJU0sW4yNhLvyHkdJCcQ5ZCr4k"
);

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
  step: string;
  value_at_step: number;
  adjustment_label?: string;
  adjustment_amount?: number;
  reason: string;
  vin: string;
  user_id?: string;
  zip_code?: string;
  timestamp: number;
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
  valuationRequestId: string,
  data: Record<string, any> = {},
  userId?: string,
  zipCode?: string
): Promise<void> {
  try {
    console.log(`📋 Enhanced Step [${step}]:`, { vin, valuationRequestId, ...data });
    
    // Create step metadata with all required fields
    const stepMetadata: ValuationStepMetadata = {
      step,
      value_at_step: data.newValue || data.finalValue || 0,
      adjustment_label: data.label || step.replace(/_/g, ' '),
      adjustment_amount: data.amount || 0,
      reason: data.reason || data.condition || data.fuelType || `${step} processing`,
      vin,
      user_id: userId,
      zip_code: zipCode,
      timestamp: Date.now()
    };
    
    // Prepare audit log entry for valuation_audit_logs table
    const auditEntry = {
      event: `VALUATION_STEP_${step}`,
      valuation_request_id: valuationRequestId,
      action: step,
      run_by: userId,
      input_data: {
        vin,
        step,
        timestamp: new Date().toISOString(),
        ...data
      },
      output_data: {
        ...data,
        stepMetadata
      },
      metadata: stepMetadata,
      audit_data: {
        step,
        vin,
        valuationRequestId,
        userId,
        zipCode,
        ...data
      },
      execution_time_ms: Date.now(),
      source: 'unified_valuation_engine',
      created_at: new Date().toISOString()
    };
    
    try {
      // Primary: Insert into valuation_audit_logs using admin client
      const { data: insertedData, error: dbError } = await supabaseAdmin
        .from('valuation_audit_logs')
        .insert(auditEntry)
        .select('id')
        .single();
      
      if (!dbError && insertedData) {
        console.log(`✅ Step audit logged to valuation_audit_logs:`, insertedData.id);
      } else {
        console.warn('⚠️ Primary audit failed:', dbError?.message);
        
        // Fallback: Try with regular client
        const { error: fallbackError } = await supabase
          .from('valuation_audit_logs')
          .insert(auditEntry);
        
        if (fallbackError) {
          console.warn('⚠️ Fallback audit also failed:', fallbackError.message);
        } else {
          console.log('✅ Fallback audit succeeded');
        }
      }
    } catch (error) {
      console.warn('⚠️ Complete step audit failed (non-blocking):', error);
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
  valuationRequestId: string,
  adjustment: {
    label: string;
    amount: number;
    reason: string;
    baseValue: number;
    newValue: number;
  },
  userId?: string,
  zipCode?: string
): Promise<void> {
  await logValuationStep('ADJUSTMENT_APPLIED', vin, valuationRequestId, {
    label: adjustment.label,
    amount: adjustment.amount,
    reason: adjustment.reason,
    baseValue: adjustment.baseValue,
    newValue: adjustment.newValue,
    valueChange: adjustment.newValue - adjustment.baseValue,
    percentageChange: ((adjustment.amount / adjustment.baseValue) * 100).toFixed(2)
  }, userId, zipCode);
}