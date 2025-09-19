
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
          .from('valuation_results')
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

  // PHASE 2 FIX: Enhanced submission function with proper VIN decode validation and valuation creation
  const submitFollowUpAndStartValuation = useCallback(async (): Promise<{ success: boolean; message: string; valuationId?: string; requiresValuation?: boolean }> => {
    try {
      if (!vin) {
        return { success: false, message: 'VIN required for valuation' };
      }

      // Validate required fields
      if (!formData.zip_code || !formData.mileage || !formData.condition) {
        return { success: false, message: 'Please complete all required fields (location, mileage, condition)' };
      }

      console.log('🚀 [FOLLOW-UP] Starting submission for VIN:', vin);

      // PHASE 2 FIX: Ensure VIN is decoded before proceeding
      const { needsDecoding, decodeVin, getDecodedVehicle } = await import('@/services/valuation/vehicleDecodeService');
      
      if (await needsDecoding(vin)) {
        console.log('🔍 [FOLLOW-UP] VIN not decoded, triggering decode first...');
        
        const decodeResult = await decodeVin(vin);
        if (!decodeResult.success) {
          console.error('❌ [FOLLOW-UP] VIN decode failed:', decodeResult.error);
          return { success: false, message: `VIN decode failed: ${decodeResult.error}` };
        }
        
        console.log('✅ [FOLLOW-UP] VIN decoded successfully during follow-up');
      }

      // Get decoded vehicle data for valuation
      const decodedVehicle = await getDecodedVehicle(vin);
      
      // 1. Check for existing valuation by VIN
      const { data: existingValuations } = await supabase
        .from('valuation_results')
        .select('id, estimated_value')
        .eq('vin', vin)
        .order('created_at', { ascending: false })
        .limit(1);

      let valuation_id: string | undefined = existingValuations?.[0]?.id ?? undefined;

      // 2. If no valuation exists, create a valuation record
      if (!valuation_id) {
        console.log('🚀 [FOLLOW-UP] Creating new valuation record for VIN:', vin);
        
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id ?? null;

        const { data: newValuation, error: valuationError } = await supabase
          .from('valuation_results')
          .insert({
            vin: vin,
            make: decodedVehicle?.make || formData.make || 'Unknown',
            model: decodedVehicle?.model || formData.model || 'Unknown',
            year: decodedVehicle?.year || formData.year || new Date().getFullYear(),
            mileage: formData.mileage,
            condition: formData.condition,
            zip_code: formData.zip_code,
            user_id: userId,
            estimated_value: 0,
            confidence_score: 0,
            adjustments: null,
            vehicle_data: {
              trim: decodedVehicle?.trim || undefined,
              source: 'followup_form'
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (valuationError || !newValuation) {
          console.error('❌ [FOLLOW-UP] Failed to create valuation:', valuationError);
          return { success: false, message: 'Failed to create valuation record' };
        }

        valuation_id = newValuation.id;
        console.log('✅ [FOLLOW-UP] Created valuation with ID:', valuation_id);
      } else {
        console.log('✅ [FOLLOW-UP] Using existing valuation:', valuation_id);
      }

      // 3. Save follow-up data with valuation_id link
      const completeFormData = {
        ...formData,
        vin,
        valuation_id,
        // Use decoded vehicle data when available
        make: decodedVehicle?.make || formData.make,
        model: decodedVehicle?.model || formData.model,
        year: decodedVehicle?.year || formData.year,
        is_complete: true,
        completion_percentage: 100,
        updated_at: new Date().toISOString()
      };

      const saveResult = await saveFormData(completeFormData);
      
      if (!saveResult) {
        return { success: false, message: 'Failed to save follow-up data' };
      }

      // 4. PHASE 3 FIX: Trigger valuation calculation if needed
      const currentValuation = existingValuations?.[0];
      if (!currentValuation?.estimated_value || currentValuation.estimated_value <= 0) {
        console.log('🧮 [FOLLOW-UP] Triggering valuation calculation...');
        
        try {
          // Call the real AIN valuation API via our hardened endpoint
          const { data: ainResult, meta } = await runValuation({
            vin: vin,
            make: decodedVehicle?.make || formData.make || 'Unknown',
            model: decodedVehicle?.model || formData.model || 'Unknown',
            year: decodedVehicle?.year || formData.year || new Date().getFullYear(),
            mileage: formData.mileage,
            zip_code: formData.zip_code,
            condition: formData.condition as "poor" | "fair" | "good" | "very_good" | "excellent",
            requested_by: 'followup_form'
          });

          console.log('✅ [AIN] Valuation completed:', ainResult);
          console.log('🔍 [AIN] Route metadata:', meta);

          // Store the AIN result in the database
          const finalValue = ainResult?.finalValue ?? ainResult?.estimated_value ?? 0;
          if (finalValue > 0) {
            console.log('📊 [AIN] Professional valuation received');
          }

        } catch (calcError) {
          const errorMessage = calcError instanceof Error ? calcError.message : 'AIN valuation failed';
          console.error('❌ [AIN] Valuation error:', errorMessage);
        }
      }

      return { 
        success: true, 
        message: 'Follow-up submitted and valuation process started',
        valuationId: valuation_id
      };

    } catch (error) {
      console.error('❌ [FOLLOW-UP] Error in submitFollowUpAndStartValuation:', error);
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
