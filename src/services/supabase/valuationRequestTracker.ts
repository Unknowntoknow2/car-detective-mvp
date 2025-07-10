import { supabase } from '@/integrations/supabase/client';

export interface ValuationRequestInput {
  vin: string;
  zipCode: string;
  mileage?: number;
  userId?: string;
  additionalData?: Record<string, any>;
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
  try {
    console.log('📝 Creating valuation request record:', input);
    
    const { data, error } = await supabase
      .from('valuation_requests')
      .insert({
        user_id: input.userId || null,
        vin: input.vin,
        zip_code: input.zipCode,
        mileage: input.mileage || null,
        status: 'processing',
        additional_data: input.additionalData || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating valuation request:', error);
      return null;
    }

    console.log('✅ Valuation request created with ID:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Failed to create valuation request:', error);
    return null;
  }
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
  try {
    console.log('✅ Completing valuation request:', requestId);
    
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
      console.error('❌ Error completing valuation request:', error);
      return false;
    }

    console.log('✅ Valuation request completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to complete valuation request:', error);
    return false;
  }
}

/**
 * Marks a valuation request as failed
 */
export async function failValuationRequest(requestId: string, errorMessage: string): Promise<boolean> {
  try {
    console.log('❌ Marking valuation request as failed:', requestId);
    
    const { error } = await supabase
      .from('valuation_requests')
      .update({
        status: 'failed',
        error_message: errorMessage,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (error) {
      console.error('❌ Error updating failed valuation request:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to update valuation request status:', error);
    return false;
  }
}