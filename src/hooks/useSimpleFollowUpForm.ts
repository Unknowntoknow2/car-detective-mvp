
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
        if (process.env.NODE_ENV !== 'production') {
          console.log('🔍 Loading follow-up data for VIN:', vin);
        }
        
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
            .from('valuations')
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
              vin: vin // FIXED: Ensure VIN is preserved
            }));
          } else {
            console.log('⚠️ No valuation found to link for VIN:', vin);
            // Still preserve the VIN even if no valuation exists
            setFormData(prev => ({ 
              ...prev, 
              vin: vin
            }));
          }
        }
      } catch (error) {
        console.error('Error loading follow-up data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (vin) {
      loadData();
    } else {
      console.warn('⚠️ No VIN provided to useSimpleFollowUpForm');
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
        console.error('❌ Cannot save follow-up data without VIN');
        setSaveError('VIN required for saving');
        return false;
      }

      // CRITICAL: Validate condition is valid enum value and not empty
      const validConditions = ['excellent', 'good', 'fair', 'poor'];
      if (!dataToSave.condition || dataToSave.condition === '' || !validConditions.includes(dataToSave.condition)) {
        console.error('❌ Invalid condition value:', dataToSave.condition);
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
        console.log('🔗 Attempting to link follow-up to valuation via VIN:', vin);
        const { data: valuationData } = await supabase
          .from('valuations')
          .select('id')
          .eq('vin', vin)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (valuationData) {
          saveData.valuation_id = valuationData.id;
          console.log('✅ Linked to valuation:', valuationData.id);
        } else {
          console.log('⚠️ No valuation found to link for VIN:', vin);
        }
      }

      // Remove the form-only field before saving
      const { payoffAmount, ...dbData } = saveData;

      console.log('💾 Saving follow-up data:', {
        vin: dbData.vin,
        valuation_id: dbData.valuation_id,
        mileage: dbData.mileage,
        zip_code: dbData.zip_code,
        condition: dbData.condition
      });

      const { error } = await supabase
        .from('follow_up_answers')
        .upsert(dbData, { onConflict: 'vin' });

      if (error) {
        console.error('Save error details:', error);
        
        // Enhanced error classification
        if (error.message?.includes('follow_up_answers_condition_check')) {
          setSaveError('Please select a valid condition (excellent/good/fair/poor)');
        } else if (error.message?.includes('violates foreign key constraint')) {
          setSaveError('Data linking error - please refresh and try again');
        } else if (error.message?.includes('violates check constraint')) {
          setSaveError('Invalid data format - please check your entries');
        } else if (error.message?.includes('network') || error.code === 'ECONNRESET') {
          setSaveError('Network error - please check connection and try again');
        } else {
          setSaveError(`Save failed: ${error.message}`);
        }
        return false;
      }

      setLastSaveTime(new Date());
      setSaveError(null);
      console.log('✅ Follow-up data saved successfully');
      return true;
    } catch (error) {
      console.error('Save error caught:', error);
      
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
      vin: vin // FIXED: Always preserve the VIN
    }));
  }, [vin]);

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
    const hasValidCondition = formData.condition && ['excellent', 'good', 'fair', 'poor'].includes(formData.condition);
    
    return Boolean(hasValidZip && hasValidMileage && hasValidCondition);
  }, [formData]);

  // NEW: Complete submission function that links follow-up to valuation
  const submitFollowUpAndStartValuation = useCallback(async (): Promise<{ success: boolean; message: string; valuationId?: string; requiresValuation?: boolean }> => {
    try {
      if (!vin) {
        return { success: false, message: 'VIN required for valuation' };
      }

      // Validate required fields
      if (!formData.zip_code || !formData.mileage || !formData.condition) {
        return { success: false, message: 'Please complete all required fields (location, mileage, condition)' };
      }

      // 1. Check for existing valuation by VIN
      const { data: existingValuations } = await supabase
        .from('valuations')
        .select('id')
        .eq('vin', vin)
        .order('created_at', { ascending: false })
        .limit(1);

      let valuation_id: string | undefined = existingValuations?.[0]?.id ?? undefined;

      // 2. PHASE 2 FIX: If no valuation exists, create a valuation request
      if (!valuation_id) {
        console.log('🚀 No existing valuation found, creating valuation request for VIN:', vin);
        
        try {
          // Create valuation request using follow-up data
          const { data: newValuation, error: valuationError } = await supabase
            .from('valuations')
            .insert({
              vin: vin,
              make: formData.make,
              model: formData.model,
              year: formData.year,
              mileage: formData.mileage,
              condition: formData.condition,
              state: formData.zip_code,
              user_id: (await supabase.auth.getUser()).data.user?.id || null,
              estimated_value: 0, // Will be calculated later
              confidence_score: 0, // Will be calculated later
              source: 'followup_form',
              created_at: new Date().toISOString()
            })
            .select('id')
            .single();

          if (valuationError || !newValuation) {
            console.error('❌ Failed to create valuation:', valuationError);
            return { success: false, message: 'Failed to create valuation record' };
          }

          valuation_id = newValuation.id;
          console.log('✅ Created new valuation with ID:', valuation_id);
          
          // PHASE 3 FIX: Trigger valuation calculation immediately
          try {
            console.log('🧮 Triggering valuation calculation for:', valuation_id);
            
            // Call the valuation result edge function
            const { data: valuationResult, error: calcError } = await supabase.functions.invoke('valuation-result', {
              body: {
                vin: vin,
                followUpData: {
                  mileage: formData.mileage,
                  condition: formData.condition,
                  zip_code: formData.zip_code,
                  year: formData.year,
                  make: formData.make,
                  model: formData.model
                }
              }
            });

            if (calcError) {
              console.error('⚠️ Valuation calculation failed:', calcError);
              // Don't fail the submission, just log the error
            } else if (valuationResult && valuationResult.estimated_value > 0) {
              console.log('✅ Valuation calculated successfully:', valuationResult.estimated_value);
              
              // Update the valuation with calculated values
              await supabase
                .from('valuations')
                .update({
                  estimated_value: valuationResult.estimated_value,
                  confidence_score: valuationResult.confidence_score || 75,
                  updated_at: new Date().toISOString()
                })
                .eq('id', valuation_id);
            }
          } catch (calcError) {
            console.error('⚠️ Error during valuation calculation:', calcError);
            // Don't fail the submission, just log the error
          }
          
        } catch (error) {
          console.error('❌ Error creating valuation:', error);
          return { success: false, message: 'Failed to create valuation record' };
        }
      } else {
        console.log('✅ Found existing valuation:', valuation_id);
      }

      // 3. Save follow-up data with valuation_id link
      const completeFormData = {
        ...formData,
        vin,
        valuation_id,
        is_complete: true,
        completion_percentage: 100,
        updated_at: new Date().toISOString()
      };

      const saveResult = await saveFormData(completeFormData);
      
      if (!saveResult) {
        return { success: false, message: 'Failed to save follow-up data' };
      }

      return { 
        success: true, 
        message: 'Follow-up submitted and valuation complete',
        valuationId: valuation_id
      };

    } catch (error) {
      console.error('❌ Error in submitFollowUpAndStartValuation:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unexpected error during valuation process'
      };
    }
  }, [vin, formData, saveFormData]);

  return {
    formData,
    updateFormData,
    saveProgress,
    submitFollowUpAndStartValuation,
    isLoading,
    isSaving,
    saveError,
    lastSaveTime,
    isFormValid: isFormValid()
  };
}
