import { supabase } from '@/integrations/supabase/client';

export interface SharedValuationData {
  userId?: string;
  vin: string;
  zipCode: string;
  finalValue: number;
  confidenceScore: number;
  shareLink: string;
  qrCode: string;
  timestamp: number;
}

export async function saveSharedValuation(data: SharedValuationData) {
  try {
    
    const { data: result, error } = await supabase
      .from('saved_valuations')
      .insert({
        user_id: data.userId || null,
        vin: data.vin,
        valuation: data.finalValue,
        confidence_score: data.confidenceScore,
        created_at: new Date(data.timestamp).toISOString(),
        // Store additional metadata in a JSON field if available
        // or create a separate shares table for this data
      });

    if (error) {
      console.error('❌ Error saving shared valuation:', error);
      throw error;
    }

    return result;
  } catch (error) {
    console.error('❌ Failed to save shared valuation:', error);
    throw error;
  }
}

export async function getSharedValuation(shareToken: string) {
  try {
    const { data, error } = await supabase
      .from('saved_valuations')
      .select('*')
      .eq('id', shareToken) // This would need to be adjusted based on actual schema
      .single();

    if (error) {
      console.error('❌ Error fetching shared valuation:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('❌ Failed to fetch shared valuation:', error);
    throw error;
  }
}

export async function incrementShareView(shareToken: string) {
  try {
    // Track share views - would need a proper shares table for this
    
    // For now, just log the view
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to track share view:', error);
    throw error;
  }
}