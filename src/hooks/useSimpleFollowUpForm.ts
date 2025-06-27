
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
    payoffAmount: 0, // Keep this for form state
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
        } else if (data) {
          // Map database fields to form fields
          const mappedData = {
            ...data,
            payoffAmount: data.payoff_amount || 0 // Map database field to form field
          };
          setFormData(prev => ({ ...prev, ...mappedData }));
        }
      } catch (error) {
        console.error('Error loading follow-up data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [vin]);

  // Silent auto-save function with proper field mapping
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

      // Map form fields to database fields
      const saveData = {
        ...dataToSave,
        payoff_amount: dataToSave.payoffAmount || 0, // Map form field to database field
        completion_percentage: completionPercentage,
        is_complete: completionPercentage === 100,
        updated_at: new Date().toISOString()
      };

      // Remove the form-only field before saving
      const { payoffAmount, ...dbData } = saveData;

      const { error } = await supabase
        .from('follow_up_answers')
        .upsert(dbData, { onConflict: 'vin' });

      if (error) {
        console.error('Silent save error:', error);
        setSaveError('Connection issue - will retry automatically');
        return false;
      }

      setLastSaveTime(new Date());
      setSaveError(null);
      return true;
    } catch (error) {
      console.error('Silent save error:', error);
      setSaveError('Connection issue - will retry automatically');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Auto-save with retry logic (every 10 seconds)
  useEffect(() => {
    const timer = setInterval(async () => {
      if (!isLoading && formData.vin && (saveError || !lastSaveTime || Date.now() - lastSaveTime.getTime() > 10000)) {
        await saveFormData(formData);
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [formData, isLoading, saveFormData, saveError, lastSaveTime]);

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
