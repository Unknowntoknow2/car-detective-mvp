
import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { toast } from 'sonner';

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
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Prepare safe data for database save
  const prepareSafeDataForSave = useCallback((dataToSave: FollowUpAnswers) => {
    const userId = dataToSave.user_id || null;
    console.log('👤 Saving with user_id:', userId || 'anonymous');
    
    return {
      vin: dataToSave.vin,
      user_id: userId,
      valuation_id: dataToSave.valuation_id,
      zip_code: dataToSave.zip_code,
      mileage: dataToSave.mileage,
      condition: dataToSave.condition,
      year: dataToSave.year,
      accidents: dataToSave.accidents,
      transmission: dataToSave.transmission,
      title_status: dataToSave.title_status,
      previous_use: dataToSave.previous_use,
      serviceHistory: dataToSave.serviceHistory,
      previous_owners: dataToSave.previous_owners,
      tire_condition: dataToSave.tire_condition,
      exterior_condition: dataToSave.exterior_condition,
      interior_condition: dataToSave.interior_condition,
      brake_condition: dataToSave.brake_condition,
      dashboard_lights: dataToSave.dashboard_lights,
      modifications: dataToSave.modifications,
      features: dataToSave.features,
      additional_notes: dataToSave.additional_notes,
      completion_percentage: dataToSave.completion_percentage,
      is_complete: dataToSave.is_complete,
      loan_balance: dataToSave.loan_balance,
      payoff_amount: dataToSave.payoffAmount,
      service_history: dataToSave.serviceHistory?.description || null,
      updated_at: new Date().toISOString()
    };
  }, []);

  // Enhanced save function with better error handling
  const saveFormData = useCallback(async (dataToSave: FollowUpAnswers) => {
    if (!dataToSave.vin) {
      const errorMsg = 'No VIN provided for saving';
      setSaveError(errorMsg);
      return false;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      console.log('🔐 Upserting follow_up_answers...');
      
      const saveData = prepareSafeDataForSave(dataToSave);
      console.log('🧪 Upsert payload VIN:', saveData.vin, 'valuation_id:', saveData.valuation_id || 'missing');
      
      const { error } = await supabase
        .from('follow_up_answers')
        .upsert(saveData, {
          onConflict: 'vin'
        });

      if (error) {
        console.error('❌ Upsert failed — RLS or schema constraint? Error:', error.message);
        console.error('Save error details:', error);
        
        // Enhanced error handling for specific cases
        let userFriendlyError = 'Save failed. ';
        
        if (error.message.includes('row-level security')) {
          userFriendlyError += 'Permission denied. Please try refreshing the page.';
        } else if (error.message.includes('column') && error.message.includes('does not exist')) {
          userFriendlyError += 'Database schema mismatch detected.';
        } else if (error.message.includes('invalid input syntax')) {
          userFriendlyError += 'Invalid data format detected.';
        } else if (error.code === '23505') {
          userFriendlyError += 'Duplicate entry detected.';
        } else {
          userFriendlyError += 'Please check your connection and try again.';
        }
        
        setSaveError(userFriendlyError);
        return false;
      }

      // Success
      console.log('✔️ Success');
      setSaveError(null);
      setLastSaveTime(new Date());
      retryCountRef.current = 0;
      
      // Clear localStorage backup on successful save
      try {
        localStorage.removeItem(`followup_backup_${dataToSave.vin}`);
      } catch (error) {
        console.warn('Failed to clear backup:', error);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving follow-up data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Connection error occurred';
      setSaveError(`Save failed: ${errorMessage}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [prepareSafeDataForSave, setSaveError, setIsSaving, setLastSaveTime]);

  // Enhanced debounced save with retry logic
  const debouncedSave = useCallback((data: FollowUpAnswers) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const success = await saveFormData(data);
        if (!success && retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          // Retry with exponential backoff
          setTimeout(() => debouncedSave(data), 1000 * Math.pow(2, retryCountRef.current));
        }
      } catch (error) {
        console.error('Auto-save error:', error);
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          setTimeout(() => debouncedSave(data), 1000 * Math.pow(2, retryCountRef.current));
        }
      }
    }, 1000);
  }, [saveFormData, maxRetries]);

  // Auto-save to localStorage as backup
  useEffect(() => {
    if (formData.vin && (formData.zip_code || formData.mileage > 0)) {
      try {
        localStorage.setItem(`followup_backup_${formData.vin}`, JSON.stringify(formData));
      } catch (error) {
        console.warn('Failed to save backup to localStorage:', error);
      }
    }
  }, [formData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    saveFormData,
    debouncedSave
  };
}
