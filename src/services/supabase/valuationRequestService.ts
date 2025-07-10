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
      .from('valuations')
      .insert({
        user_id: data.userId || null,
        vin: data.vin,
        state: data.zipCode, // Using state field for ZIP code
        mileage: data.mileage,
        estimated_value: data.finalValue,
        base_value: data.baseValue,
        confidence_score: data.confidenceScore,
        market_search_status: data.marketSearchStatus,
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
      .from('valuations')
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