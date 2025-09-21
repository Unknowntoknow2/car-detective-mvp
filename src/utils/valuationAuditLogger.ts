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
    
    // FIX #6: Use safe audit logging via edge function
    try {
      const { data: safeResponse, error: safeError } = await supabase.functions.invoke('safe-audit-logger', {
        body: {
          logData: {
            entityId: data.vin || `valuation_${Date.now()}`,
            action: `VALUATION_${status}`,
            inputData: {
              vin: data.vin,
              zipCode: data.zipCode,
              timestamp: new Date().toISOString(),
              ...data
            },
            outputData: {
              finalValue: data.finalValue,
              confidenceScore: data.confidenceScore,
              adjustments: data.adjustments,
              sources: data.sources,
              listingCount: data.listingCount,
              marketSearchStatus: data.marketSearchStatus,
              status
            },
            dataSources: data.sources || ['nhtsa', 'vin_enrichment'],
            processingTimeMs: Date.now(),
            userId: data.userId || null,
            sessionId: null,
            ipAddress: null,
            userAgent: null,
            complianceFlags: []
          }
        }
      });

      if (!safeError && safeResponse?.success) {
        return safeResponse.auditId;
      } else {
        console.warn('⚠️ Safe audit warning (non-blocking):', safeResponse?.warning || safeError?.message);
      }
    } catch (edgeErr) {
      console.warn('⚠️ Safe audit edge function unavailable (non-blocking):', edgeErr);
    }

    // Fallback: Console logging only (don't try direct DB inserts that violate RLS)
    console.warn('📝 Using console-only audit logging for:', { status, vin: data.vin, finalValue: data.finalValue });
    return `console_audit_${Date.now()}`;
    
  } catch (error) {
    console.error('❌ Complete audit logging failure (non-blocking):', error);
    return `audit_failed_${Date.now()}`;
  }
}

/**
 * Log individual valuation steps to the new valuation_audit_logs table
 */
export async function logValuationStep(
  step: string,
  vin: string,
  valuationRequestId: string,
  data: {
    adjustment?: number;
    finalValue?: number;
    baseValue?: number;
    adjustmentReason?: string;
    confidenceScore?: number;
    sources?: string[];
    [key: string]: any;
  },
  userId?: string,
  zipCode?: string
): Promise<void> {
  try {
    
    // Calculate adjustment percentage if we have both values
    const adjustmentPercentage = data.baseValue && data.baseValue > 0 && data.adjustment
      ? ((data.adjustment / data.baseValue) * 100)
      : 0;
    
    // Validate and clean valuationRequestId to ensure it's a valid UUID
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valuationRequestId);
    const cleanValuationRequestId = isValidUUID ? valuationRequestId : null;
    
    // Prepare audit log entry for the new valuation_audit_logs table
    const auditEntry = {
      user_id: userId || null,
      vin,
      zip_code: zipCode,
      step,
      adjustment: data.adjustment || 0,
      final_value: data.finalValue || 0,
      confidence_score: data.confidenceScore || 85,
      status: step === 'COMPLETE' || step === 'VALUATION_COMPLETE' ? 'COMPLETE' : 'IN_PROGRESS',
      timestamp: new Date().toISOString(),
      valuation_request_id: cleanValuationRequestId,
      adjustment_reason: data.adjustmentReason || data.reason || `Applied ${step}`,
      base_value: data.baseValue,
      adjustment_percentage: adjustmentPercentage,
      data_sources: data.sources || [],
      metadata: {
        step,
        vin,
        valuationRequestId,
        userId,
        zipCode,
        timestamp: Date.now(),
        ...data
      }
    };
    
    try {
      // Primary: Insert using admin client for service role access
      const { data: insertedData, error: dbError } = await supabaseAdmin
        .from('valuation_audit_logs')
        .insert(auditEntry)
        .select('id')
        .single();
      
      if (!dbError && insertedData) {
      } else {
        console.warn('⚠️ Primary audit failed:', dbError?.message);
        
        // Fallback: Try with regular client
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('valuation_audit_logs')
          .insert(auditEntry)
          .select('id')
          .single();
        
        if (fallbackError) {
          console.warn('⚠️ Fallback audit also failed:', fallbackError.message);
        } else {
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
  await logValuationStep(adjustment.label, vin, valuationRequestId, {
    adjustment: adjustment.amount,
    finalValue: adjustment.newValue,
    baseValue: adjustment.baseValue,
    adjustmentReason: adjustment.reason,
    valueChange: adjustment.newValue - adjustment.baseValue,
    percentageChange: ((adjustment.amount / adjustment.baseValue) * 100).toFixed(2)
  }, userId, zipCode);
}