import { supabase } from '@/integrations/supabase/client';

export interface ValuationFeedbackData {
  userId: string;
  vin: string;
  zipCode: string;
  feedback: 'accurate' | 'off' | 'far_off';
  estimatedValue?: number;
  confidenceScore?: number;
  timestamp: number;
}

export async function submitValuationFeedback(data: ValuationFeedbackData) {
  try {
    console.log('💬 Submitting valuation feedback...', data);
    
    const { data: result, error } = await supabase
      .from('valuation_feedback')
      .insert({
        user_id: data.userId,
        vin: data.vin,
        zip_code: data.zipCode,
        feedback: data.feedback,
        estimated_value: data.estimatedValue,
        confidence_score: data.confidenceScore,
        created_at: new Date(data.timestamp).toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('❌ Error submitting feedback:', error);
      throw error;
    }

    console.log('✅ Feedback submitted successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to submit feedback:', error);
    throw error;
  }
}

export async function getUserFeedback(userId: string) {
  try {
    const { data, error } = await supabase
      .from('valuation_feedback')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching user feedback:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('❌ Failed to fetch user feedback:', error);
    throw error;
  }
}