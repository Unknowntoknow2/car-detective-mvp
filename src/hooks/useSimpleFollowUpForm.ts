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
        // First try to load by VIN
        let { data, error } = await supabase
          .from('follow_up_answers')
          .select('*')
          .eq('vin', vin)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading follow-up data:', error);
        } else if (data) {
          console.log('✅ Loaded existing follow-up data for VIN:', vin);
          const mappedData = {
            ...data,
            payoffAmount: data.payoff_amount || 0
          };
          setFormData(prev => ({ ...prev, ...mappedData }));
        } else {
          // If no data by VIN, try to link to existing valuation
          console.log('🔗 No follow-up data found, checking for valuation to link');
          const { data: valuationData } = await supabase
            .from('valuation_results')
            .select('id')
            .eq('vin', vin)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (valuationData) {
            console.log('✅ Found valuation to link:', valuationData.id);
            setFormData(prev => ({ 
              ...prev, 
              valuation_id: valuationData.id,
              vin: vin // Ensure VIN is preserved
            }));
          }
        }
      } catch (error) {
        console.error('Error loading follow-up data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [vin]);

  // Enhanced auto-save function with proper VIN linking
  const saveFormData = useCallback(async (dataToSave: FollowUpAnswers) => {
    try {
      setIsSaving(true);
      setSaveError(null);

      // Ensure VIN is always included
      const saveData = {
        ...dataToSave,
        vin: vin, // Force VIN to be correct
        payoff_amount: dataToSave.payoffAmount || 0,
        completion_percentage: Math.round((
          [dataToSave.zip_code, dataToSave.mileage, dataToSave.condition].filter(Boolean).length / 3
        ) * 100),
        is_complete: dataToSave.zip_code && dataToSave.mileage && dataToSave.condition,
        updated_at: new Date().toISOString()
      };

      // If no valuation_id, try to find and link one
      if (!saveData.valuation_id) {
        console.log('🔗 Attempting to link follow-up to valuation via VIN:', vin);
        const { data: valuationData } = await supabase
          .from('valuation_results')
          .select('id')
          .eq('vin', vin)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (valuationData) {
          saveData.valuation_id = valuationData.id;
          console.log('✅ Linked to valuation:', valuationData.id);
        }
      }

      // Remove the form-only field before saving
      const { payoffAmount, ...dbData } = saveData;

      console.log('💾 Saving follow-up data with VIN:', dbData.vin, 'valuation_id:', dbData.valuation_id);

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
      console.log('✅ Follow-up data saved successfully');
      return true;
    } catch (error) {
      console.error('Silent save error:', error);
      setSaveError('Connection issue - will retry automatically');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [vin]);

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
