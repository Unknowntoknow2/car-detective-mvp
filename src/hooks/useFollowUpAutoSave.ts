
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
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isSavingRef = useRef(false);
  const lastSavedDataRef = useRef<string>('');

  const saveFormData = useCallback(async (dataToSave: FollowUpAnswers): Promise<boolean> => {
    // Prevent concurrent saves
    if (isSavingRef.current) {
      console.log('Save already in progress, skipping...');
      return false;
    }

    // Check if data has actually changed
    const currentDataString = JSON.stringify(dataToSave);
    if (currentDataString === lastSavedDataRef.current) {
      console.log('No changes detected, skipping save...');
      return true;
    }

    try {
      isSavingRef.current = true;
      setIsSaving(true);
      setSaveError(null);

      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

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

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        console.log('Save request was cancelled');
        return false;
      }

      if (error) {
        console.error('Auto-save error details:', error);
        
        // Enhanced error classification for auto-save
        if (error.message?.includes('condition_check')) {
          setSaveError('Invalid condition - please select excellent/good/fair/poor');
        } else if (error.message?.includes('foreign key')) {
          setSaveError('Data linking issue - please refresh page');
        } else if (error.message?.includes('network')) {
          setSaveError('Network issue - will retry automatically');
        } else {
          setSaveError(error.message);
        }
        return false;
      }

      // Update the last saved data reference
      lastSavedDataRef.current = currentDataString;
      setLastSaveTime(new Date());
      return true;
    } catch (error) {
      // Don't log error if it was an abort
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Save request was aborted');
        return false;
      }
      
      console.error('Save error:', error);
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
      return false;
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
      // Clear the abort controller reference once done
      if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
        abortControllerRef.current = null;
      }
    }
  }, [setSaveError, setIsSaving, setLastSaveTime]);

  const debouncedSave = useCallback((dataToSave: FollowUpAnswers) => {
    // Cancel any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Cancel any in-flight save request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Set new timeout with stable 500ms delay
    saveTimeoutRef.current = setTimeout(() => {
      saveFormData(dataToSave);
    }, 500);
  }, [saveFormData]);

  return {
    saveFormData,
    debouncedSave
  };
}
