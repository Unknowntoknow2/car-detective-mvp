
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface UseSimpleFollowUpFormProps {
  vin: string;
  initialData?: Partial<FollowUpAnswers>;
}

export function useSimpleFollowUpForm({ vin, initialData }: UseSimpleFollowUpFormProps) {
  const [formData, setFormData] = useState<FollowUpAnswers>(() => ({
    vin,
    zip_code: '',
    mileage: 0,
    condition: '',
    year: initialData?.year || new Date().getFullYear(),
    accidents: {
      hadAccident: false,
      count: 0,
      severity: 'minor' as const,
      repaired: false,
      frameDamage: false
    },
    transmission: 'automatic',
    title_status: 'clean',
    previous_use: 'personal',
    serviceHistory: {
      hasRecords: false,
      frequency: 'unknown' as const,
      dealerMaintained: false,
      services: []
    },
    previous_owners: 1,
    tire_condition: 'good',
    exterior_condition: 'good',
    interior_condition: 'good',
    brake_condition: 'good',
    dashboard_lights: [],
    loan_balance: 0,
    payoffAmount: 0,
    modifications: {
      hasModifications: false,
      modified: false,
      types: []
    },
    features: [],
    additional_notes: '',
    completion_percentage: 0,
    is_complete: false,
    ...initialData
  }));

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load existing data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data, error } = await supabase
          .from('follow_up_answers')
          .select('*')
          .eq('vin', vin)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading follow-up data:', error);
          setSaveError('Failed to load existing data');
        } else if (data) {
          setFormData(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error('Error loading follow-up data:', error);
        setSaveError('Failed to load existing data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [vin]);

  // Silent auto-save function
  const saveFormData = useCallback(async (dataToSave: FollowUpAnswers) => {
    try {
      setIsSaving(true);
      setSaveError(null);

      // Calculate completion percentage
      const requiredFields = ['zip_code', 'mileage', 'condition'];
      const completedRequired = requiredFields.filter(field => {
        const value = dataToSave[field as keyof FollowUpAnswers];
        if (field === 'zip_code') return value && String(value).length === 5;
        if (field === 'mileage') return value && Number(value) > 0;
        return value && String(value).trim() !== '';
      }).length;
      
      const completionPercentage = Math.round((completedRequired / requiredFields.length) * 100);

      const saveData = {
        ...dataToSave,
        completion_percentage: completionPercentage,
        is_complete: completionPercentage === 100,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('follow_up_answers')
        .upsert(saveData, { onConflict: 'vin' });

      if (error) {
        console.error('Save error:', error);
        setSaveError('Failed to save progress');
        return false;
      }

      setLastSaveTime(new Date());
      return true;
    } catch (error) {
      console.error('Save error:', error);
      setSaveError('Failed to save progress');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Debounced save (60 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading && formData.vin) {
        saveFormData(formData);
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, [formData, isLoading, saveFormData]);

  // Update form data function
  const updateFormData = useCallback((updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  // Manual save function for tab changes
  const saveProgress = useCallback(async () => {
    if (!isLoading && formData.vin) {
      return await saveFormData(formData);
    }
    return false;
  }, [formData, isLoading, saveFormData]);

  // Check if form is valid for submission
  const isFormValid = useCallback(() => {
    const hasValidZip = formData.zip_code && formData.zip_code.length === 5 && /^\d{5}$/.test(formData.zip_code);
    const hasValidMileage = formData.mileage && formData.mileage > 0;
    const hasCondition = formData.condition && formData.condition.trim() !== '';
    
    return Boolean(hasValidZip && hasValidMileage && hasCondition);
  }, [formData]);

  return {
    formData,
    updateFormData,
    saveProgress,
    isLoading,
    isSaving,
    saveError,
    lastSaveTime,
    isFormValid: isFormValid()
  };
}
