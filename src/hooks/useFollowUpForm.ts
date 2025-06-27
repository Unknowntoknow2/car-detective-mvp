import { useState, useEffect } from 'react';
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

  const { watch, setValue, getValues } = formMethods;

  // Watch all form fields for changes
  const watchedValues = watch();

  // Maintain current tab in sessionStorage
  const [currentTab, setCurrentTab] = useState(() => {
    return sessionStorage.getItem(`followup-tab-${vin}`) || 'basic';
  });

  // Update sessionStorage when tab changes
  const updateCurrentTab = (tabId: string) => {
    setCurrentTab(tabId);
    sessionStorage.setItem(`followup-tab-${vin}`, tabId);
  };

  // Sync form values with loadedData when it changes
  useEffect(() => {
    if (loadedData && Object.keys(loadedData).length > 0) {
      Object.entries(loadedData).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof FollowUpAnswers, value, { shouldDirty: false });
        }
      });
    }
  }, [loadedData, setValue]);

  // Sync watched values back to formData state
  useEffect(() => {
    if (watchedValues && Object.keys(watchedValues).length > 0) {
      const hasChanges = Object.entries(watchedValues).some(([key, value]) => {
        return loadedData[key as keyof FollowUpAnswers] !== value;
      });

      if (hasChanges) {
        setFormData(watchedValues);
      }
    }
  }, [watchedValues, setFormData, loadedData]);

  const { saveFormData, debouncedSave } = useFollowUpAutoSave({
    formData: watchedValues || loadedData,
    setSaveError,
    setIsSaving,
    setLastSaveTime
  });

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
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

    console.log('💬 Auto-saving form with condition:', updated.condition || 'empty');
    if (!updated.condition) {
      console.log('⚠️ Condition field is empty — possibly saved before user selected');
    }
    
    // Auto-save after updates (debounced)
    debouncedSave(updated);
  };

  // Enhanced save function with better error handling
  const saveProgress = async () => {
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
  };

  const submitForm = async () => {
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
      console.log('💾 Saving follow-up → VIN:', vin, 'valuation_id:', resolvedValuationId || 'missing');

      if (!resolvedValuationId) {
        console.log('🛑 Missing valuation_id — record may be orphaned unless corrected');
      }

      // Get vehicle data for valuation
      const { data: decodedVehicle } = await supabase
        .from('decoded_vehicles')
        .select('*')
        .eq('vin', vin)
        .maybeSingle();

      if (decodedVehicle) {
        console.log('🧠 Decoded vehicle year:', decodedVehicle.year);
        
        if (currentFormData.year && currentFormData.year !== decodedVehicle.year) {
          console.log('⚠️ Year mismatch: decoded=' + decodedVehicle.year + ' vs form=' + currentFormData.year + ' — using decoded value');
        }

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
            year: decodedVehicle.year || currentFormData.year // Use decoded year
          }
        });

        if (valuationResult.success) {
          // Update the valuation result in database
          const { data: existingValuation } = await supabase
            .from('valuation_results')
            .select('id')
            .eq('vin', vin)
            .maybeSingle();

          console.log('🔍 Looking up existing valuation for VIN:', vin);
          
          if (existingValuation) {
            console.log('🧩 Updating valuation_results → VIN:', vin, 'valuation_id:', existingValuation.id);
            
            // Update existing valuation with refined results
            await supabase
              .from('valuation_results')
              .update({
                estimated_value: valuationResult.valuation.estimatedValue,
                confidence_score: valuationResult.valuation.confidenceScore,
                price_range_low: valuationResult.valuation.priceRange[0],
                price_range_high: valuationResult.valuation.priceRange[1],
                adjustments: valuationResult.valuation.adjustments,
                vin: vin, // Ensure VIN is explicitly saved
                year: decodedVehicle.year || currentFormData.year, // Use decoded year
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
          } else {
            console.log('⚠️ No existing valuation found for VIN:', vin);
          }

          toast.success('Follow-up completed! Your valuation has been updated.');
          
          // Store the valuation ID for navigation
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
      
      // Enhanced error messages
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
    }
  };

  return {
    formData: watchedValues || loadedData,
    formMethods,
    currentTab,
    updateCurrentTab,
    updateFormData,
    saveFormData: saveProgress, // Use enhanced save function
    submitForm,
    isLoading,
    isSaving,
    saveError,
    lastSaveTime
  };
}
