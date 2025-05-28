
import { supabase } from '@/integrations/supabase/client';
import { FollowUpAnswers } from '@/types/follow-up-answers';

export const saveFollowUpAnswers = async (answers: FollowUpAnswers): Promise<void> => {
  console.log('💾 Saving follow-up answers:', answers);

  const { error } = await supabase
    .from('follow_up_answers')
    .upsert({
      vin: answers.vin,
      valuation_id: answers.valuation_id,
      user_id: answers.user_id,
      mileage: answers.mileage,
      zip_code: answers.zip_code,
      condition: answers.condition,
      accidents: answers.accidents,
      service_history: answers.service_history,
      maintenance_status: answers.maintenance_status,
      last_service_date: answers.last_service_date,
      title_status: answers.title_status,
      previous_owners: answers.previous_owners,
      previous_use: answers.previous_use,
      tire_condition: answers.tire_condition,
      dashboard_lights: answers.dashboard_lights,
      frame_damage: answers.frame_damage,
      modifications: answers.modifications,
      completion_percentage: answers.completion_percentage,
      is_complete: answers.is_complete,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'vin'
    });

  if (error) {
    console.error('❌ Error saving follow-up answers:', error);
    throw new Error('Failed to save follow-up answers');
  }

  console.log('✅ Follow-up answers saved successfully');
};

export const loadFollowUpAnswers = async (vin: string): Promise<FollowUpAnswers | null> => {
  console.log('📥 Loading follow-up answers for VIN:', vin);

  const { data, error } = await supabase
    .from('follow_up_answers')
    .select('*')
    .eq('vin', vin)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No data found, return null
      return null;
    }
    console.error('❌ Error loading follow-up answers:', error);
    throw new Error('Failed to load follow-up answers');
  }

  return data as FollowUpAnswers;
};
