
import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface UseFollowUpAutoSaveProps {
  formData: FollowUpAnswers;
  setSaveError: (error: string | null) => void;
  setIsSaving: (saving: boolean) => void;
  setLastSaveTime: (time: Date | null) => void;
}

export function useFollowUpAutoSave({
  formData,
  setSaveError,
  setIsSaving,
  setLastSaveTime
}: UseFollowUpAutoSaveProps) {
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const saveFormData = useCallback(async (dataToSave: FollowUpAnswers): Promise<boolean> => {
    try {
      setIsSaving(true);
      setSaveError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      const saveData = {
        ...dataToSave,
        user_id: user?.id,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('follow_up_answers')
        .upsert(saveData, {
          onConflict: 'vin,user_id'
        });

      if (error) {
        console.error('Save error:', error);
        setSaveError(error.message);
        return false;
      }

      setLastSaveTime(new Date());
      return true;
    } catch (error) {
      console.error('Save error:', error);
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [setSaveError, setIsSaving, setLastSaveTime]);

  const debouncedSave = useCallback((dataToSave: FollowUpAnswers) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveFormData(dataToSave);
    }, 1000);
  }, [saveFormData]);

  return {
    saveFormData,
    debouncedSave
  };
}
