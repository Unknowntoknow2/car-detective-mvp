import { supabase } from '@/integrations/supabase/client';

export interface ValuationRequestInput {
  vin: string;
  zipCode: string;
  mileage?: number;
  userId?: string;
  additionalData?: Record<string, any>;
  // Required vehicle data to satisfy database constraints
  make: string;
  model: string;
  year: number;
}

export interface ValuationRequestRecord {
  id: string;
  user_id: string | null;
  vin: string;
  zip_code: string;
  mileage: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Creates a valuation request record at the start of the valuation process
 * This ensures we have a request ID to track throughout the pipeline
 */
export async function createValuationRequest(input: ValuationRequestInput): Promise<ValuationRequestRecord | null> {
  const { data, error } = await supabase
    .from('valuation_requests')
    .insert({
      user_id: input.userId || null,
      vin: input.vin,
      zip_code: input.zipCode,
      mileage: input.mileage || null,
      make: input.make || 'UNKNOWN',
      model: input.model || 'UNKNOWN', 
      year: input.year || 2020,
      status: 'processing',
      additional_data: input.additionalData || {}
    })
    .select()
    .single();

  if (error) {
    return null;
  }
  return data;
}

/**
 * Updates a valuation request with completion data
 */
export async function completeValuationRequest(
  requestId: string, 
  finalValue: number, 
  confidenceScore: number,
  auditLogId?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('valuation_requests')
    .update({
      status: 'completed',
      final_value: finalValue,
      confidence_score: confidenceScore,
      audit_log_id: auditLogId,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId);

  if (error) {
    return false;
  }
  return true;
}

/**
 * Marks a valuation request as failed
 */
export async function failValuationRequest(requestId: string, errorMessage: string): Promise<boolean> {
  const { error } = await supabase
    .from('valuation_requests')
    .update({
      status: 'failed',
      error_message: errorMessage,
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId);

  if (error) {
    return false;
  }

  return true;
}