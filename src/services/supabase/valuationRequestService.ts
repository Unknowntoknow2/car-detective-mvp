import { supabase } from '@/integrations/supabase/client';

export interface ValuationRequestData {
  userId?: string;
  vin: string;
  zipCode: string;
  mileage: number;
  finalValue: number;
  baseValue: number;
  confidenceScore: number;
  marketSearchStatus: 'success' | 'fallback' | 'error';
  timestamp: number;
}

export async function saveValuationRequest(data: ValuationRequestData) {
  try {
    console.log('💾 Saving valuation request to Supabase...', data);
    
    const { data: result, error } = await supabase
      .from('valuation_requests')
      .insert({
        user_id: data.userId || null,
        vin: data.vin,
        zip_code: data.zipCode,
        mileage: data.mileage,
        final_value: data.finalValue,
        confidence_score: data.confidenceScore,
        request_params: {
          baseValue: data.baseValue,
          marketSearchStatus: data.marketSearchStatus,
          timestamp: data.timestamp
        },
        status: 'completed',
        created_at: new Date(data.timestamp).toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('❌ Error saving valuation request:', error);
      throw error;
    }

    console.log('✅ Valuation request saved successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to save valuation request:', error);
    throw error;
  }
}

export async function getValuationRequest(id: string) {
  try {
    const { data, error } = await supabase
      .from('valuation_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error fetching valuation request:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('❌ Failed to fetch valuation request:', error);
    throw error;
  }
}