
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { toast } from 'sonner';

export function useFollowUpAnswers(vin: string, valuationId?: string) {
  const [answers, setAnswers] = useState<FollowUpAnswers>({
    accidents: { hadAccident: false },
    modifications: { modified: false },
    dashboardLights: [],
    completionPercentage: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load existing answers
  useEffect(() => {
    if (!vin) return;
    
    const loadAnswers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('follow_up_answers')
          .select('*')
          .eq('vin', vin)
          .maybeSingle();

        if (error) {
          console.error('Error loading follow-up answers:', error);
          return;
        }

        if (data) {
          setAnswers({
            ...data,
            accidents: data.accidents || { hadAccident: false },
            modifications: data.modifications || { modified: false },
            dashboardLights: data.dashboard_lights || []
          });
        }
      } catch (error) {
        console.error('Error loading follow-up answers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnswers();
  }, [vin]);

  // Auto-save functionality
  const saveAnswers = async (updatedAnswers?: FollowUpAnswers) => {
    const answersToSave = updatedAnswers || answers;
    setSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to save your answers');
        return;
      }

      // Calculate completion percentage
      const totalFields = 13; // Total number of main fields
      let completedFields = 0;
      
      if (answersToSave.mileage) completedFields++;
      if (answersToSave.zipCode) completedFields++;
      if (answersToSave.condition) completedFields++;
      if (answersToSave.accidents?.hadAccident !== undefined) completedFields++;
      if (answersToSave.serviceHistory) completedFields++;
      if (answersToSave.maintenanceStatus) completedFields++;
      if (answersToSave.titleStatus) completedFields++;
      if (answersToSave.previousOwners) completedFields++;
      if (answersToSave.previousUse) completedFields++;
      if (answersToSave.tireCondition) completedFields++;
      if (answersToSave.dashboardLights?.length) completedFields++;
      if (answersToSave.frameDamage !== undefined) completedFields++;
      if (answersToSave.modifications?.modified !== undefined) completedFields++;

      const completionPercentage = Math.round((completedFields / totalFields) * 100);
      const isComplete = completionPercentage >= 80;

      const dataToSave = {
        ...answersToSave,
        user_id: user.id,
        completion_percentage: completionPercentage,
        is_complete: isComplete
      };

      const { error } = await supabase
        .from('follow_up_answers')
        .upsert(dataToSave, { 
          onConflict: 'vin,user_id' 
        });

      if (error) {
        console.error('Error saving follow-up answers:', error);
        toast.error('Failed to save answers');
        return false;
      }

      toast.success('Answers saved');
      return true;
    } catch (error) {
      console.error('Error saving follow-up answers:', error);
      toast.error('Failed to save answers');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateAnswers = (updates: Partial<FollowUpAnswers>) => {
    const newAnswers = { ...answers, ...updates };
    setAnswers(newAnswers);
    
    // Auto-save after a delay
    const timeoutId = setTimeout(() => {
      saveAnswers(newAnswers);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  return {
    answers,
    loading,
    saving,
    updateAnswers,
    saveAnswers
  };
}
