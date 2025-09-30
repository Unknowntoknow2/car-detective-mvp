
import { useState, useEffect, useCallback } from 'react';
import { runValuation } from '@/lib/ainClient';
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
    condition: 'good', // FIXED: Valid default condition
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
        if (import.meta.env.NODE_ENV !== 'production') {
          // No-op for non-production
        }
        
        // First try to load by VIN from database
        let { data, error } = await supabase
          .from('follow_up_answers')
          .select('*')
          .eq('vin', vin)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          // If database access fails, try localStorage fallback
          const localData = localStorage.getItem(`follow_up_data_${vin}`);
          if (localData) {
            try {
              const parsedData = JSON.parse(localData);
              const mappedData = {
                ...parsedData,
                payoffAmount: parsedData.payoff_amount || 0
              };
              setFormData(prev => ({ ...prev, ...mappedData }));
            } catch (e) {
              // Invalid localStorage data, ignore
            }
          }
        } else if (data) {
          const mappedData = {
            ...data,
            payoffAmount: data.payoff_amount || 0
          };
          setFormData(prev => ({ ...prev, ...mappedData }));
        } else {
          // No data from database, check localStorage
          const localData = localStorage.getItem(`follow_up_data_${vin}`);
          if (localData) {
            try {
              const parsedData = JSON.parse(localData);
              const mappedData = {
                ...parsedData,
                payoffAmount: parsedData.payoff_amount || 0
              };
              setFormData(prev => ({ ...prev, ...mappedData }));
            } catch (e) {
              // Invalid localStorage data, proceed with default flow
            }
          }
          
          // Try to link to existing valuation
          const { data: valuationData } = await supabase
            .from('valuation_results')
            .select('id')
            .eq('vin', vin)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (valuationData) {
            setFormData(prev => ({ 
              ...prev, 
              valuation_id: valuationData.id,
              vin: vin // FIXED: Ensure VIN is preserved
            }));
          } else {
            // Still preserve the VIN even if no valuation exists
            setFormData(prev => ({ 
              ...prev, 
              vin: vin
            }));
          }
        }
      } catch {
        // No-op for catch
      } finally {
        setIsLoading(false);
      }
    };

    if (vin) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [vin]);

  // Enhanced auto-save function with proper VIN linking
  const saveFormData = useCallback(async (dataToSave: FollowUpAnswers) => {
    try {
      setIsSaving(true);
      setSaveError(null);

      // FIXED: Validate required fields before save
      if (!vin) {
        setSaveError('VIN required for saving');
        return false;
      }

      // CRITICAL: Validate condition is valid enum value and not empty
      const validConditions = ['excellent', 'good', 'fair', 'poor'];
      if (!dataToSave.condition || dataToSave.condition === '' || !validConditions.includes(dataToSave.condition)) {
        setSaveError('Please select a valid vehicle condition');
        return false;
      }

      const saveData = {
        ...dataToSave,
        vin: vin, // FIXED: Force VIN to be correct and not null
        payoff_amount: dataToSave.payoffAmount || 0,
        completion_percentage: Math.round((
          [dataToSave.zip_code, dataToSave.mileage && dataToSave.mileage > 0, dataToSave.condition].filter(Boolean).length / 3
        ) * 100),
        is_complete: Boolean(dataToSave.zip_code && dataToSave.mileage && dataToSave.mileage > 0 && dataToSave.condition),
        updated_at: new Date().toISOString(),
        // Ensure JSONB fields have proper boolean types
        accidents: {
          ...dataToSave.accidents,
          hadAccident: Boolean(dataToSave.accidents?.hadAccident),
          repaired: Boolean(dataToSave.accidents?.repaired),
          frameDamage: Boolean(dataToSave.accidents?.frameDamage),
          airbagDeployment: Boolean(dataToSave.accidents?.airbagDeployment)
        },
        serviceHistory: {
          ...dataToSave.serviceHistory,
          hasRecords: Boolean(dataToSave.serviceHistory?.hasRecords),
          regularMaintenance: Boolean(dataToSave.serviceHistory?.regularMaintenance),
          dealerMaintained: Boolean(dataToSave.serviceHistory?.dealerMaintained)
        },
        modifications: {
          ...dataToSave.modifications,
          hasModifications: Boolean(dataToSave.modifications?.hasModifications),
          modified: Boolean(dataToSave.modifications?.modified),
          reversible: Boolean(dataToSave.modifications?.reversible)
        }
      };

      // If no valuation_id, try to find and link one
      if (!saveData.valuation_id) {
        const { data: valuationData } = await supabase
          .from('valuation_results')
          .select('id')
          .eq('vin', vin)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (valuationData) {
          saveData.valuation_id = valuationData.id;
        } else {
          // No-op for else
        }
      }

      // Remove the form-only field before saving
      const { payoffAmount, ...dbData } = saveData;
      
      // Check authentication before attempting save
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // For unauthenticated users, store data in localStorage as fallback
        localStorage.setItem(`follow_up_data_${vin}`, JSON.stringify(dbData));
        setLastSaveTime(new Date());
        setSaveError(null);
        return true;
      }

      const { error } = await supabase
        .from('follow_up_answers')
        .upsert(dbData, { onConflict: 'vin' });

      if (error) {
        // Enhanced error classification
        if (error.message?.includes('follow_up_answers_condition_check')) {
          setSaveError('Please select a valid condition (excellent/good/fair/poor)');
        } else if (error.message?.includes('violates foreign key constraint')) {
          setSaveError('Data linking error - please refresh and try again');
        } else if (error.message?.includes('violates check constraint')) {
          setSaveError('Invalid data format - please check your entries');
        } else if (error.message?.includes('network') || error.code === 'ECONNRESET') {
          setSaveError('Network error - please check connection and try again');
        } else if (error.code === '42501' || error.message?.includes('permission denied') || error.message?.includes('insufficient privileges')) {
          // Store in localStorage as fallback for auth issues
          localStorage.setItem(`follow_up_data_${vin}`, JSON.stringify(dbData));
          setLastSaveTime(new Date());
          setSaveError(null);
          return true;
        } else {
          setSaveError(`Save failed: ${error.message}`);
        }
        return false;
      }

      setLastSaveTime(new Date());
      setSaveError(null);
      return true;
    } catch (error) {
      // Enhanced error handling with user-friendly messages
      if (error instanceof Error) {
        if (error.message?.includes('condition_check')) {
          setSaveError('Please select a valid vehicle condition');
        } else if (error.message?.includes('foreign key')) {
          setSaveError('Data linking error - please refresh the page');
        } else if (error.message?.includes('network')) {
          setSaveError('Network error - please check your connection');
        } else {
          setSaveError(`Error: ${error.message}`);
        }
        } else {
          setSaveError('Unexpected error - please try again');
        }
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
    setFormData(prev => ({
      ...prev,
      ...updates,
      vin,
    }));
  }, [vin]);

  const saveProgress = useCallback(async () => {
    return await saveFormData({ ...formData, vin });
  }, [formData, saveFormData, vin]);

  const submitFollowUpAndStartValuation = useCallback(async () => {
    try {
      // 1) Find existing valuation by VIN
      const { data: existing } = await supabase
        .from('valuation_results')
        .select('id, estimated_value')
        .eq('vin', vin)
        .order('created_at', { ascending: false })
        .limit(1);

      let valuation_id: string | undefined = existing?.[0]?.id ?? undefined;

      // 2) Create a valuation record if none exists
      if (!valuation_id) {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id ?? null;

        const { data: newValuation, error: valuationError } = await supabase
          .from('valuation_results')
          .insert({
            vin,
            make: (formData as any).make || 'Unknown',
            model: (formData as any).model || 'Unknown',
            year: formData.year || new Date().getFullYear(),
            mileage: formData.mileage,
            condition: formData.condition,
            zip_code: formData.zip_code,
            user_id: userId,
            estimated_value: 0,
            confidence_score: 0,
            adjustments: null,
            vehicle_data: { source: 'followup_form' },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        if (valuationError || !newValuation) {
          return { success: false, message: 'Failed to create valuation record' } as const;
        }

        valuation_id = newValuation.id;
      }

      // 3) Save follow-up data with valuation_id link
      const completeFormData: FollowUpAnswers = {
        ...formData,
        vin,
        valuation_id,
        is_complete: true,
        completion_percentage: 100,
        updated_at: new Date().toISOString() as any,
      } as any;

      const saveOk = await saveFormData(completeFormData);
      if (!saveOk) {
        return { success: false, message: 'Failed to save follow-up data' } as const;
      }

      // 4) Trigger valuation (best-effort)
      try {
        await runValuation({
          vin,
          make: (formData as any).make || 'Unknown',
          model: (formData as any).model || 'Unknown',
          year: formData.year || new Date().getFullYear(),
          mileage: formData.mileage,
          zip_code: formData.zip_code,
          condition: formData.condition as 'poor' | 'fair' | 'good' | 'very_good' | 'excellent',
          requested_by: 'followup_form',
        } as any);
      } catch {}

      return { success: true, message: 'Follow-up submitted and valuation started', valuationId: valuation_id } as const;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unexpected error during valuation process',
      } as const;
    }
  }, [vin, formData, saveFormData]);

  const isFormValid = Boolean(
    formData.zip_code && formData.mileage && formData.mileage > 0 && formData.condition
  );

  return {
    formData,
    updateFormData,
    saveProgress,
    submitFollowUpAndStartValuation,
    isLoading,
    isSaving,
    saveError,
    lastSaveTime,
    isFormValid: isFormValid
  };
}
