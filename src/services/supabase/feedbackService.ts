// Valuation Feedback Service - Handles user feedback on valuations
import { supabase } from '@/integrations/supabase/client';

export interface ValuationFeedback {
  valuationId?: string;
  userId?: string;
  vin: string;
  zipCode?: string;
  rating?: 'positive' | 'negative' | 'neutral';
  feedback?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  timestamp: number;
}

export async function saveValuationFeedback(feedback: ValuationFeedback) {
  try {
    console.log('💬 Saving valuation feedback...', feedback);
    
    const { data, error } = await supabase
      .from('valuation_feedback')
      .insert({
        valuation_id: feedback.valuationId || null,
        user_id: feedback.userId || null,
        vin: feedback.vin,
        zip_code: feedback.zipCode || null,
        rating: feedback.rating || 'neutral',
        feedback_text: feedback.feedback || null,
        estimated_value: feedback.estimatedValue || null,
        confidence_score: feedback.confidenceScore || null,
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