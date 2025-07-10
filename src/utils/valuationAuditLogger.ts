// Valuation Audit Logger
import { supabase } from "@/integrations/supabase/client";

export interface AuditLogData {
  vin?: string;
  zipCode?: string;
  finalValue?: number;
  confidenceScore?: number;
  marketSearchStatus?: string;
  adjustments?: any[];
  sources?: string[];
  [key: string]: any;
}

/**
 * Log valuation audit trail for transparency and debugging
 */
export async function logValuationAudit(
  status: string,
  data: AuditLogData
): Promise<void> {
  try {
    console.log(`📊 Audit Log [${status}]:`, data);
    
    // Log to Supabase for persistence (if needed for compliance)
    const auditEntry = {
      action: 'VALUATION',
      entity_type: 'vehicle',
      entity_id: data.vin || 'unknown',
      input_data: {
        vin: data.vin,
        zipCode: data.zipCode,
        timestamp: new Date().toISOString()
      },
      output_data: {
        finalValue: data.finalValue,
        confidenceScore: data.confidenceScore,
        status,
        ...data
      },
      processing_time_ms: Date.now(),
      data_sources_used: data.sources || [],
      compliance_flags: []
    };
    
    // Only attempt to save if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('compliance_audit_log')
        .insert(auditEntry);
      
      if (error) {
        console.warn('Failed to save audit log to database:', error.message);
      }
    }
    
  } catch (error) {
    console.error('Error in audit logging:', error);
    // Don't throw - audit logging shouldn't break valuation
  }
}

/**
 * Log individual valuation steps for detailed tracking
 */
export async function logValuationStep(
  step: string,
  vin: string,
  data: Record<string, any> = {},
  userId?: string
): Promise<void> {
  try {
    console.log(`📋 Valuation Step [${step}]:`, { vin, ...data });
    
    const stepEntry = {
      action: `VALUATION_STEP_${step}`,
      entity_type: 'valuation_step',
      entity_id: vin,
      user_id: userId,
      input_data: {
        vin,
        step,
        timestamp: new Date().toISOString(),
        ...data
      },
      output_data: data,
      processing_time_ms: Date.now(),
      compliance_flags: []
    };
    
    // Only attempt to save if we have a valid session
    const { data: { user } } = await supabase.auth.getUser();
    if (user || userId) {
      const { error } = await supabase
        .from('compliance_audit_log')
        .insert(stepEntry);
      
      if (error) {
        console.warn('Failed to save step audit log:', error.message);
      }
    }
    
  } catch (error) {
    console.error('Error logging valuation step:', error);
  }
}

/**
 * Log valuation error for debugging
 */
export async function logValuationError(
  error: Error,
  input: any
): Promise<void> {
  console.error('🚨 Valuation Error:', {
    message: error.message,
    stack: error.stack,
    input
  });
  
  await logValuationAudit('ERROR', {
    error: error.message,
    input,
    timestamp: new Date().toISOString()
  });
}