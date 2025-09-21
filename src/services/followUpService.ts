
import { supabase } from '@/integrations/supabase/client';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { calculateCompletionPercentage, validateFormData, transformForValuation } from '@/utils/followUpDataHelpers';

export class FollowUpService {
  /**
   * Save or update follow-up answers
   */
  static async saveAnswers(formData: FollowUpAnswers): Promise<{ success: boolean; error?: string }> {
    try {
      const completion = calculateCompletionPercentage(formData);
      
      // Prepare data for saving with backward compatibility
      const saveData = {
        ...formData,
        completion_percentage: completion,
        updated_at: new Date().toISOString(),
        // Map serviceHistory.description to service_history for legacy compatibility
        service_history: formData.serviceHistory?.description || null
      };
      
      const { error } = await supabase
        .from('follow_up_answers')
        .upsert(saveData, {
          onConflict: 'vin'
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to save answers' };
    }
  }

  /**
   * Get follow-up answers by VIN
   */
  static async getAnswersByVin(vin: string): Promise<{ data?: FollowUpAnswers; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('follow_up_answers')
        .select('*')
        .eq('vin', vin)
        .maybeSingle();

      if (error) {
        return { error: error.message };
      }

      if (data) {
        // Migrate service_history string to serviceHistory object if needed
        let serviceHistory = data.serviceHistory;
        if (!serviceHistory && data.service_history) {
          serviceHistory = {
            hasRecords: Boolean(data.service_history),
            description: data.service_history,
            frequency: 'unknown',
            dealerMaintained: false,
            services: []
          };
        }

        return { 
          data: {
            ...data,
            serviceHistory: serviceHistory || {
              hasRecords: false,
              frequency: 'unknown',
              dealerMaintained: false,
              description: '',
              services: []
            }
          }
        };
      }

      return { data: undefined };
    } catch (error) {
      return { error: 'Failed to fetch answers' };
    }
  }

  /**
   * Submit completed follow-up for valuation
   */
  static async submitForValuation(formData: FollowUpAnswers): Promise<{ success: boolean; valuationId?: string; error?: string }> {
    try {
      // Validate form data
      const isValid = validateFormData(formData);
      if (!isValid) {
        return { success: false, error: 'Form validation failed' };
      }

      // Mark as complete and save
      const completedData = {
        ...formData,
        is_complete: true,
        completion_percentage: 100,
        updated_at: new Date().toISOString()
      };

      const saveResult = await this.saveAnswers(completedData);
      if (!saveResult.success) {
        return saveResult;
      }

      // Transform data for valuation calculation
      const valuationData = transformForValuation(completedData);

      // Here you would typically call the valuation calculation service
      return { success: true, valuationId: `val_${Date.now()}` };
    } catch (error) {
      return { success: false, error: 'Failed to submit for valuation' };
    }
  }

  /**
   * Get user's follow-up history
   */
  static async getUserHistory(userId?: string): Promise<{ data: FollowUpAnswers[]; error?: string }> {
    try {
      let query = supabase
        .from('follow_up_answers')
        .select('*')
        .order('updated_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: data || [] };
    } catch (error) {
      return { data: [], error: 'Failed to fetch history' };
    }
  }
}
