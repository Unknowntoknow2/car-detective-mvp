
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { TabValidation } from '@/components/followup/validation/TabValidation';
import { runCorrectedValuationPipeline } from '@/utils/valuation/correctedValuationPipeline';
import { toast } from 'sonner';
import { useFollowUpDataLoader } from './useFollowUpDataLoader';
import { useFollowUpAutoSave } from './useFollowUpAutoSave';

export function useFollowUpForm(vin: string, initialData?: Partial<FollowUpAnswers>) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  console.log('📥 Follow-up form initialized with VIN:', vin);
  console.log('📋 Initial data valuation_id:', initialData?.valuation_id || 'missing');

  const { formData: loadedData, setFormData, isLoading } = useFollowUpDataLoader({ 
    vin, 
    initialData 
  });

  // Initialize shared form instance with loaded data
  const formMethods = useForm<FollowUpAnswers>({
    defaultValues: loadedData,
    mode: 'onChange'
  });

  const { watch, setValue, getValues, formState } = formMethods;

  // Maintain current tab in sessionStorage
  const [currentTab, setCurrentTab] = useState(() => {
    return sessionStorage.getItem(`followup-tab-${vin}`) || 'basic';
  });

  // Update sessionStorage when tab changes
  const updateCurrentTab = useCallback((tabId: string) => {
    setCurrentTab(tabId);
    sessionStorage.setItem(`followup-tab-${vin}`, tabId);
  }, [vin]);

  // Memoize the current form values to prevent unnecessary re-renders
  const currentFormData = useMemo(() => {
    return getValues();
  }, [getValues, formState.isDirty]);

  // Initialize form values only once when data is loaded
  useEffect(() => {
    if (loadedData && Object.keys(loadedData).length > 0 && !isInitialized) {
      console.log('🔄 Initializing form with loaded data');
      Object.entries(loadedData).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof FollowUpAnswers, value, { shouldDirty: false });
        }
      });
      setIsInitialized(true);
    }
  }, [loadedData, setValue, isInitialized]);

  const { saveFormData, debouncedSave } = useFollowUpAutoSave({
    formData: currentFormData,
    setSaveError,
    setIsSaving,
    setLastSaveTime
  });

  // Stable update function that doesn't cause re-renders
  const updateFormData = useCallback((updates: Partial<FollowUpAnswers>) => {
    console.log('💬 Updating form data:', Object.keys(updates));
    
    // Update form values using setValue to maintain form state
    Object.entries(updates).forEach(([key, value]) => {
      setValue(key as keyof FollowUpAnswers, value, { shouldDirty: true });
    });

    const currentValues = getValues();
    const updated = {
      ...currentValues,
      ...updates
    };
    
    // Update completion percentage based on validation
    const completionPercentage = TabValidation.getOverallCompletion(updated);
    setValue('completion_percentage', completionPercentage, { shouldDirty: true });

    // Update the external form data state
    setFormData(updated);
    
    // Auto-save after updates (debounced)
    debouncedSave(updated);
  }, [setValue, getValues, setFormData, debouncedSave]);

  // Enhanced save function with better error handling
  const saveProgress = useCallback(async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      
      const currentFormData = getValues();
      const success = await saveFormData(currentFormData);
      
      if (success) {
        setLastSaveTime(new Date());
        console.log('✅ Progress saved successfully');
      } else {
        setSaveError('Failed to save progress');
      }
    } catch (error) {
      console.error('❌ Error saving progress:', error);
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  }, [getValues, saveFormData]);

  // Memoize form completion check to prevent unnecessary calculations
  const isFormValid = useMemo(() => {
    const data = currentFormData;
    const hasValidZip = Boolean(data.zip_code && data.zip_code.length === 5 && /^\d{5}$/.test(data.zip_code));
    const hasValidMileage = Boolean(data.mileage && data.mileage > 0);
    const hasCondition = Boolean(data.condition);
    
    return hasValidZip && hasValidMileage && hasCondition;
  }, [currentFormData]);

  const submitForm = useCallback(async () => {
    try {
      console.log('🚀 Starting follow-up form submission for VIN:', vin);
      
      const currentFormData = getValues();
      console.log('📤 Form submission year:', currentFormData.year);
      console.log('✅ Final submit triggered — is_complete: true, completion: 100%');
      
      // Validate required fields first
      if (!currentFormData.zip_code || !currentFormData.mileage) {
        toast.error('Please fill in ZIP code and mileage before completing valuation');
        return false;
      }

      setIsSaving(true);

      // Ensure valuation_id is linked before saving
      let resolvedValuationId = currentFormData.valuation_id;
      
      if (!resolvedValuationId) {
        console.log('🔗 Resolving missing valuation_id during submission for VIN:', vin);
        
        const { data: valuationData } = await supabase
          .from('valuation_results')
          .select('id')
          .eq('vin', vin)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (valuationData) {
          resolvedValuationId = valuationData.id;
          console.log('✅ Resolved valuation_id during submission:', resolvedValuationId);
        } else {
          console.warn('⚠️ No valuation found for VIN during submission - creating follow-up anyway');
        }
      }

      // Save the completed form data first with resolved valuation_id
      const saveSuccess = await saveFormData({
        ...currentFormData,
        valuation_id: resolvedValuationId,
        is_complete: true,
        completion_percentage: 100
      });

      if (!saveSuccess) {
        toast.error('Failed to save follow-up data. Please try again.');
        return false;
      }

      console.log('✅ Follow-up data saved successfully');

      // Get vehicle data for valuation
      const { data: decodedVehicle } = await supabase
        .from('decoded_vehicles')
        .select('*')
        .eq('vin', vin)
        .maybeSingle();

      if (decodedVehicle) {
        console.log('🧮 Running valuation with complete follow-up data');
        
        // Run valuation with complete follow-up data, using decoded vehicle year
        const valuationResult = await runCorrectedValuationPipeline({
          vin,
          make: decodedVehicle.make || 'Unknown',
          model: decodedVehicle.model || 'Unknown',
          year: decodedVehicle.year || currentFormData.year || new Date().getFullYear(),
          mileage: currentFormData.mileage,
          condition: currentFormData.condition,
          zipCode: currentFormData.zip_code,
          trim: decodedVehicle.trim,
          bodyType: decodedVehicle.bodyType,
          fuelType: decodedVehicle.fueltype,
          transmission: decodedVehicle.transmission,
          followUpAnswers: {
            ...currentFormData,
            valuation_id: resolvedValuationId,
            year: decodedVehicle.year || currentFormData.year
          }
        });

        if (valuationResult.success) {
          // Update the valuation result in database
          const { data: existingValuation } = await supabase
            .from('valuation_results')
            .select('id')
            .eq('vin', vin)
            .maybeSingle();

          if (existingValuation) {
            await supabase
              .from('valuation_results')
              .update({
                estimated_value: valuationResult.valuation.estimatedValue,
                confidence_score: valuationResult.valuation.confidenceScore,
                price_range_low: valuationResult.valuation.priceRange[0],
                price_range_high: valuationResult.valuation.priceRange[1],
                adjustments: valuationResult.valuation.adjustments,
                vin: vin,
                year: decodedVehicle.year || currentFormData.year,
                vehicle_data: {
                  ...decodedVehicle,
                  marketAnalysis: valuationResult.valuation.marketAnalysis,
                  riskFactors: valuationResult.valuation.riskFactors,
                  recommendations: valuationResult.valuation.recommendations,
                  followUpComplete: true
                },
                updated_at: new Date().toISOString()
              })
              .eq('id', existingValuation.id);

            console.log('✅ Updated existing valuation with refined follow-up data');
          }

          toast.success('Follow-up completed! Your valuation has been updated.');
          localStorage.setItem('latest_valuation_id', existingValuation?.id || 'completed');
        } else {
          console.warn('⚠️ Valuation calculation failed, but follow-up was saved');
          toast.success('Follow-up completed successfully!');
        }
      } else {
        console.warn('⚠️ No decoded vehicle data found for refined valuation');
        toast.success('Follow-up completed successfully!');
      }

      // Clear tab state on successful completion
      sessionStorage.removeItem(`followup-tab-${vin}`);
      return true;

    } catch (error) {
      console.error('❌ Error submitting follow-up form:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('row-level security')) {
          toast.error('Permission error. Please refresh the page and try again.');
        } else if (error.message.includes('network')) {
          toast.error('Network error. Please check your connection and try again.');
        } else {
          toast.error(`Failed to complete follow-up: ${error.message}`);
        }
      } else {
        toast.error('Failed to complete follow-up. Please try again.');
      }
      
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [vin, getValues, saveFormData]);

  return {
    formData: currentFormData,
    formMethods,
    currentTab,
    updateCurrentTab,
    updateFormData,
    saveFormData: saveProgress,
    submitForm,
    isLoading,
    isSaving,
    saveError,
    lastSaveTime,
    isFormValid
  };
}
