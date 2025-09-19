import { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { TabValidation } from '@/components/followup/validation/TabValidation';
import { runValuation } from '@/lib/ainClient';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { useFollowUpDataLoader } from './useFollowUpDataLoader';
import { useFollowUpAutoSave } from './useFollowUpAutoSave';

export function useFollowUpForm(vin: string, initialData?: Partial<FollowUpAnswers>) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  if (process.env.NODE_ENV !== 'production') {
    console.log('📥 Follow-up form initialized with VIN:', vin);
    console.log('📋 Initial data valuation_id:', initialData?.valuation_id || 'missing');
  }

  const { formData: loadedData, setFormData, isLoading } = useFollowUpDataLoader({ 
    vin, 
    initialData 
  });

  // Initialize shared form instance with loaded data
  const formMethods = useForm<FollowUpAnswers>({
    defaultValues: loadedData,
    mode: 'onChange'
  });

  const { watch, setValue, getValues, trigger } = formMethods;
  const watchedData = watch();

  // Initialize form with loaded data when available
  useEffect(() => {
    if (loadedData && !isInitialized) {
      Object.entries(loadedData).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof FollowUpAnswers, value);
        }
      });
      setIsInitialized(true);
    }
  }, [loadedData, setValue, isInitialized]);

  // Auto-save configuration
  const { debouncedSave } = useFollowUpAutoSave({
    formData: watchedData,
    setSaveError,
    setIsSaving,
    setLastSaveTime
  });

  // Trigger auto-save when form data changes
  useEffect(() => {
    if (isInitialized && watchedData) {
      debouncedSave(watchedData);
    }
  }, [watchedData, debouncedSave, isInitialized]);

  // Manual save function for explicit saves
  const saveForm = useCallback(async (formData: FollowUpAnswers) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const currentFormData = { ...formData, vin };
      
      // Save to database
      const { error } = await supabase
        .from('follow_up_answers')
        .upsert(currentFormData, { 
          onConflict: 'vin'
        });

      if (error) throw error;

      // Update local state
      setFormData(currentFormData);
      setLastSaveTime(new Date());
      
      toast.success('Progress saved successfully!');
      
      return currentFormData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSaveError(errorMessage);
      toast.error('Failed to save progress');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [vin, setFormData]);

  // Complete form submission with valuation recalculation
  const submitCompleteForm = useCallback(async (formData: FollowUpAnswers) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const currentFormData = { ...formData, vin, is_complete: true, completion_percentage: 100 };
      
      // Final save to database
      const { error: saveError } = await supabase
        .from('follow_up_answers')
        .upsert(currentFormData, { 
          onConflict: 'vin'
        });

      if (saveError) throw saveError;

      // Update local state
      setFormData(currentFormData);
      setLastSaveTime(new Date());
      
      // Now run enhanced valuation with complete follow-up data
      const { data: decodedVehicle } = await supabase
        .from('decoded_vehicles')
        .select('*')
        .eq('vin', vin)
        .maybeSingle();

      if (decodedVehicle) {
        console.log('🧮 Running valuation with complete follow-up data');
        
        // Run valuation with complete follow-up data via AIN API
        console.log('🧮 [useFollowUpForm] Calling AIN API for follow-up valuation');
        
        const t0 = performance.now();
        const { data: ainResult, meta } = await runValuation({
          vin,
          make: decodedVehicle.make || 'Unknown',
          model: decodedVehicle.model || 'Unknown',
          year: decodedVehicle.year || currentFormData.year || new Date().getFullYear(),
          mileage: currentFormData.mileage,
          zip_code: currentFormData.zip_code,
          condition: currentFormData.condition as "poor" | "fair" | "good" | "very_good" | "excellent",
          requested_by: 'followup_form'
        });
        
        console.log('✅ [AIN] Follow-up valuation completed');
        console.log('🔍 [AIN] Route metadata:', meta);
        logger.log("ain.val.ms", Math.round(performance.now()-t0), { route: meta.route, corr_id: meta.corr_id });
        
        // Convert AIN result to expected format with all required fields
        const finalValue = ainResult.finalValue ?? ainResult.estimated_value ?? 0;
        const confidenceScore = ainResult.confidenceScore ?? ainResult.confidence_score ?? 0;
        const priceRange = (ainResult.priceRange && ainResult.priceRange.length === 2)
          ? [ainResult.priceRange[0] ?? finalValue, ainResult.priceRange[1] ?? finalValue] as [number, number]
          : [ainResult.price_range_low ?? finalValue, ainResult.price_range_high ?? finalValue] as [number, number];
        const adjustments = ainResult.adjustments ?? ainResult.breakdown ?? [];

        const valuationResult = {
          finalValue,
          estimatedValue: finalValue,
          confidenceScore,
          breakdown: adjustments,
          marketData: ainResult.market_data || {},
          explanation: ainResult.explanation || 'Professional valuation from AIN API',
          source: 'ain',
          metadata: meta,
          priceRange,
          adjustments
        };

        if (valuationResult.finalValue > 0) {
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
                estimated_value: valuationResult.finalValue,
                confidence_score: valuationResult.confidenceScore,
                price_range_low: valuationResult.priceRange[0],
                price_range_high: valuationResult.priceRange[1],
                adjustments: valuationResult.adjustments,
                vin: vin,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingValuation.id);
            
            console.log('✅ Updated existing valuation result');
          } else {
            const { data: newValuation } = await supabase
              .from('valuation_results')
              .insert({
                vin: vin,
                estimated_value: valuationResult.finalValue,
                confidence_score: valuationResult.confidenceScore,
                price_range_low: valuationResult.priceRange[0],
                price_range_high: valuationResult.priceRange[1],
                adjustments: valuationResult.adjustments
              })
              .select()
              .single();
            
            console.log('✅ Created new valuation result');
          }
          
          toast.success(`Valuation updated: $${valuationResult.finalValue.toLocaleString()} (${valuationResult.confidenceScore}% confidence)`);
        } else {
          console.warn('⚠️ Valuation returned $0, not updating database');
          toast.warning('Valuation could not be updated - insufficient data');
        }
      }
      
      toast.success('Complete form submitted successfully!');
      return currentFormData;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Complete form submission failed:', error);
      setSaveError(errorMessage);
      toast.error('Failed to submit complete form');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [vin, setFormData]);

  // Validation states
  const getValidationState = useCallback((tabName: string) => {
    const currentData = getValues();
    return TabValidation.validateTab(tabName, currentData);
  }, [getValues]);

  // Progress calculation
  const progressPercentage = useMemo(() => {
    const currentData = getValues();
    const allTabs = ['vehicle', 'condition', 'ownership', 'features', 'final'];
    
    const completedTabs = allTabs.filter(tab => 
      TabValidation.validateTab(tab, currentData).isValid
    );
    
    return Math.round((completedTabs.length / allTabs.length) * 100);
  }, [watchedData, getValues]);

  return {
    // Form methods
    formMethods,
    
    // Data and state
    formData: watchedData,
    isLoading: isLoading || !isInitialized,
    isSaving: isSaving,
    saveError,
    lastSaveTime,
    progressPercentage,
    
    // Actions
    saveForm,
    submitForm: submitCompleteForm,
    submitCompleteForm,
    updateFormData: (data: Partial<FollowUpAnswers>) => {
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as keyof FollowUpAnswers, value);
      });
    },
    getValidationState,
    
    // Field helpers
    setValue,
    getValues,
    trigger,
    watch
  };
}