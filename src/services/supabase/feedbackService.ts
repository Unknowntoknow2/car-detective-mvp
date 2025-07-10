// Valuation Feedback Service - Handles user feedback on valuations
import { supabase } from '@/integrations/supabase/client';

export interface ValuationFeedback {
  valuationRequestId?: string;
  userId?: string;
  vin?: string;
  feedback?: string;
  actualSalePrice?: number;
  saleDate?: string;
  saleType?: string;
  bestOfferReceived?: number;
  accuracyRating?: number;
  wouldRecommend?: boolean;
  timestamp: number;
}

export async function saveValuationFeedback(feedback: ValuationFeedback) {
  try {
    console.log('💬 Saving valuation feedback...', feedback);
    
    const { data, error } = await supabase
      .from('user_valuation_feedback')
      .insert({
        valuation_request_id: feedback.valuationRequestId || null,
        user_id: feedback.userId || null,
        actual_sale_price: feedback.actualSalePrice || null,
        sale_date: feedback.saleDate || null,
        sale_type: feedback.saleType || null,
        best_offer_received: feedback.bestOfferReceived || null,
        feedback_notes: feedback.feedback || null,
        accuracy_rating: feedback.accuracyRating || null,
        would_recommend: feedback.wouldRecommend || null,
        created_at: new Date(feedback.timestamp).toISOString()
      });

    if (error) {
      console.error('❌ Error saving feedback:', error);
      throw error;
    }

    console.log('✅ Feedback saved successfully');
    return data;
  } catch (error) {
    console.error('❌ Failed to save feedback:', error);
    throw error;
  }
}

// Legacy alias for existing imports
export const submitValuationFeedback = saveValuationFeedback;

export async function getFeedbackStats(vin?: string) {
  try {
    let query = supabase
      .from('valuation_feedback')
      .select('rating, created_at');
    
    if (vin) {
      query = query.eq('vin', vin);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return {
      total: data?.length || 0,
      positive: data?.filter(f => f.rating === 'positive').length || 0,
      negative: data?.filter(f => f.rating === 'negative').length || 0,
      neutral: data?.filter(f => f.rating === 'neutral').length || 0
    };
  } catch (error) {
    console.error('❌ Failed to get feedback stats:', error);
    return { total: 0, positive: 0, negative: 0, neutral: 0 };
  }
}