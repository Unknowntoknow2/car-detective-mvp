import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FollowUpAnswers, ServiceHistoryDetails, ModificationDetails, AccidentDetails } from '@/types/follow-up-answers';
import { TabValidation } from '@/components/followup/validation/TabValidation';
import { runCorrectedValuationPipeline } from '@/utils/valuation/correctedValuationPipeline';
import { toast } from 'sonner';

export function useFollowUpForm(vin: string, initialData?: Partial<FollowUpAnswers>) {
  const [formData, setFormData] = useState<FollowUpAnswers>(() => ({
    vin,
    zip_code: '',
    mileage: 0,
    condition: 'good',
    accidents: {
      hadAccident: false,
      count: 0,
      severity: 'minor',
      repaired: false,
      frameDamage: false,
      description: '',
      types: [],
      repairShops: [],
      airbagDeployment: false
    } as AccidentDetails,
    transmission: 'automatic',
    title_status: 'clean',
    previous_use: 'personal',
    serviceHistory: { 
      hasRecords: false,
      frequency: 'unknown',
      dealerMaintained: false,
      description: '',
      services: []
    } as ServiceHistoryDetails,
    tire_condition: 'good',
    exterior_condition: 'good',
    interior_condition: 'good',
    brake_condition: 'good',
    dashboard_lights: [],
    modifications: {
      hasModifications: false,
      modified: false,
      types: [],
      additionalNotes: ''
    } as ModificationDetails,
    features: [],
    additional_notes: '',
    completion_percentage: 0,
    is_complete: false,
    previous_owners: 1,
    loan_balance: 0,
    payoffAmount: 0,
    year: initialData?.year || new Date().getFullYear(),
    ...initialData
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  useEffect(() => {
    loadExistingData();
  }, [vin]);

  // Auto-save to localStorage as backup
  useEffect(() => {
    if (formData.vin && (formData.zip_code || formData.mileage > 0)) {
      try {
        localStorage.setItem(`followup_backup_${vin}`, JSON.stringify(formData));
      } catch (error) {
        console.warn('Failed to save backup to localStorage:', error);
      }
    }
  }, [formData, vin]);

  const loadExistingData = async () => {
    if (!vin) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('follow_up_answers')
        .select('*')
        .eq('vin', vin)
        .maybeSingle();

      if (error) {
        console.error('Error loading follow-up data:', error);
        setSaveError(`Failed to load existing data: ${error.message}`);
        
        // Try to load from localStorage backup
        try {
          const backup = localStorage.getItem(`followup_backup_${vin}`);
          if (backup) {
            const backupData = JSON.parse(backup);
            setFormData(prev => ({ ...prev, ...backupData }));
            toast.info('Loaded your saved progress from local backup');
          }
        } catch (backupError) {
          console.warn('Failed to load backup data:', backupError);
        }
        return;
      }

      if (data) {
        // Enhanced data migration and validation
        const migratedData = migrateAndValidateData(data);
        setFormData(prev => ({
          ...prev,
          ...migratedData
        }));
        setLastSaveTime(new Date(data.updated_at));
      }
    } catch (error) {
      console.error('Error loading follow-up data:', error);
      setSaveError('Failed to load existing data. Using local backup if available.');
      
      // Load backup on error
      try {
        const backup = localStorage.getItem(`followup_backup_${vin}`);
        if (backup) {
          const backupData = JSON.parse(backup);
          setFormData(prev => ({ ...prev, ...backupData }));
        }
      } catch (backupError) {
        console.warn('No backup available:', backupError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced data migration function
  const migrateAndValidateData = (data: any): Partial<FollowUpAnswers> => {
    // Handle serviceHistory column mapping with enhanced validation
    let serviceHistory = data.serviceHistory || data.servicehistory;
    if (!serviceHistory && data.service_history) {
      serviceHistory = {
        hasRecords: Boolean(data.service_history),
        description: data.service_history,
        frequency: 'unknown',
        dealerMaintained: false,
        services: []
      };
    }

    // Validate and fix JSONB fields
    const validateJsonField = (field: any, defaultValue: any) => {
      if (!field) return defaultValue;
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return defaultValue;
        }
      }
      return field;
    };

    return {
      ...data,
      accidents: validateJsonField(data.accidents, {
        hadAccident: false,
        count: 0,
        severity: 'minor',
        repaired: false,
        frameDamage: false,
        description: '',
        types: [],
        repairShops: [],
        airbagDeployment: false
      }),
      modifications: validateJsonField(data.modifications, {
        hasModifications: false,
        modified: false,
        types: [],
        additionalNotes: ''
      }),
      serviceHistory: validateJsonField(serviceHistory, {
        hasRecords: false,
        frequency: 'unknown',
        dealerMaintained: false,
        description: '',
        services: []
      }),
      dashboard_lights: Array.isArray(data.dashboard_lights) ? data.dashboard_lights : [],
      features: Array.isArray(data.features) ? data.features : [],
      exterior_condition: data.exterior_condition || 'good',
      interior_condition: data.interior_condition || 'good',
      brake_condition: data.brake_condition || 'good',
      additional_notes: data.additional_notes || '',
      year: data.year || new Date().getFullYear(),
      loan_balance: data.loan_balance || 0,
      payoffAmount: data.payoff_amount || data.payoffAmount || 0,
      transmission: data.transmission || 'automatic'
    };
  };

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        ...updates
      };
      
      // Update completion percentage based on validation
      const completionPercentage = TabValidation.getOverallCompletion(updated);
      updated.completion_percentage = completionPercentage;
      
      // Auto-save after updates (debounced)
      debouncedSave(updated);
      
      return updated;
    });
  };

  // Enhanced save function with better error handling
  const saveFormData = async (dataToSave: FollowUpAnswers) => {
    if (!vin) {
      const errorMsg = 'No VIN provided for saving';
      setSaveError(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    try {
      setIsSaving(true);
      setSaveError(null);
      
      // Prepare data for database save - only include existing columns
      const saveData = prepareSafeDataForSave(dataToSave);
      
      const { error } = await supabase
        .from('follow_up_answers')
        .upsert(saveData, {
          onConflict: 'vin'
        });

      if (error) {
        console.error('Save error details:', error);
        let userFriendlyError = 'Save failed. ';
        
        if (error.message.includes('column') && error.message.includes('does not exist')) {
          userFriendlyError += 'Database schema mismatch detected.';
        } else if (error.message.includes('invalid input syntax')) {
          userFriendlyError += 'Invalid data format detected.';
        } else if (error.code === '23505') {
          userFriendlyError += 'Duplicate entry detected.';
        } else {
          userFriendlyError += 'Please check your connection and try again.';
        }
        
        setSaveError(userFriendlyError);
        toast.error(userFriendlyError);
        return false;
      }

      // Clear any previous errors on successful save
      setSaveError(null);
      setLastSaveTime(new Date());
      
      // Clear localStorage backup on successful save
      try {
        localStorage.removeItem(`followup_backup_${vin}`);
      } catch (error) {
        console.warn('Failed to clear backup:', error);
      }
      
      return true;
    } catch (error) {
      console.error('Error saving follow-up data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Connection error occurred';
      setSaveError(`Save failed: ${errorMessage}`);
      toast.error('Auto-save failed. Your changes are saved locally.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Safe data preparation - only save fields that exist in database
  const prepareSafeDataForSave = (dataToSave: FollowUpAnswers) => {
    return {
      vin: dataToSave.vin,
      user_id: dataToSave.user_id,
      valuation_id: dataToSave.valuation_id,
      zip_code: dataToSave.zip_code,
      mileage: dataToSave.mileage,
      condition: dataToSave.condition,
      year: dataToSave.year,
      accidents: dataToSave.accidents,
      transmission: dataToSave.transmission,
      title_status: dataToSave.title_status,
      previous_use: dataToSave.previous_use,
      serviceHistory: dataToSave.serviceHistory, // Use correct camelCase column
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
      payoff_amount: dataToSave.payoffAmount, // Map to correct column name
      // Keep service_history for backward compatibility
      service_history: dataToSave.serviceHistory?.description || null,
      updated_at: new Date().toISOString()
    };
  };

  // Enhanced debounced save with retry logic
  const debouncedSave = (() => {
    let timeoutId: NodeJS.Timeout;
    let retryCount = 0;
    const maxRetries = 3;
    
    return (data: FollowUpAnswers) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          const success = await saveFormData(data);
          if (success) {
            retryCount = 0; // Reset on success
          } else if (retryCount < maxRetries) {
            retryCount++;
            // Retry with exponential backoff
            setTimeout(() => debouncedSave(data), 1000 * Math.pow(2, retryCount));
          }
        } catch (error) {
          console.error('Auto-save error:', error);
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(() => debouncedSave(data), 1000 * Math.pow(2, retryCount));
          }
        }
      }, 1000);
    };
  })();

  const submitForm = async () => {
    // Validate all tabs before submitting
    const validations = TabValidation.validateAllTabs(formData);
    const hasErrors = Object.values(validations).some(v => v.errors.length > 0);
    
    if (hasErrors) {
      const errorMessages = Object.values(validations)
        .flatMap(v => v.errors)
        .slice(0, 3); // Show only first 3 errors
      
      toast.error(`Please fix the following issues: ${errorMessages.join(', ')}`);
      return false;
    }

    try {
      // Save the completed form data
      const saveSuccess = await saveFormData({
        ...formData,
        is_complete: true,
        completion_percentage: 100
      });

      if (!saveSuccess) {
        toast.error('Failed to save follow-up data');
        return false;
      }

      // Trigger real valuation calculation with complete follow-up data
      console.log('🧮 Triggering real valuation calculation with complete follow-up data');
      
      // Get vehicle data for valuation
      const { data: decodedVehicle } = await supabase
        .from('decoded_vehicles')
        .select('*')
        .eq('vin', vin)
        .maybeSingle();

      if (decodedVehicle) {
        // Run valuation with complete follow-up data
        const valuationResult = await runCorrectedValuationPipeline({
          vin,
          make: decodedVehicle.make || 'Unknown',
          model: decodedVehicle.model || 'Unknown',
          year: decodedVehicle.year || formData.year || new Date().getFullYear(),
          mileage: formData.mileage,
          condition: formData.condition,
          zipCode: formData.zip_code,
          trim: decodedVehicle.trim,
          bodyType: decodedVehicle.bodyType,
          fuelType: decodedVehicle.fueltype,
          transmission: decodedVehicle.transmission,
          followUpAnswers: formData
        });

        if (valuationResult.success) {
          // Update the valuation result in database
          const { data: existingValuation } = await supabase
            .from('valuation_results')
            .select('id')
            .eq('vin', vin)
            .maybeSingle();

          if (existingValuation) {
            // Update existing valuation with refined results
            await supabase
              .from('valuation_results')
              .update({
                estimated_value: valuationResult.valuation.estimatedValue,
                confidence_score: valuationResult.valuation.confidenceScore,
                price_range_low: valuationResult.valuation.priceRange[0],
                price_range_high: valuationResult.valuation.priceRange[1],
                adjustments: valuationResult.valuation.adjustments,
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

          toast.success('Follow-up completed! Your valuation has been updated with detailed analysis.');
          
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

      return true;

    } catch (error) {
      console.error('❌ Error submitting follow-up form:', error);
      toast.error('Failed to complete follow-up. Please try again.');
      return false;
    }
  };

  return {
    formData,
    updateFormData,
    saveFormData,
    submitForm,
    isLoading,
    isSaving,
    saveError,
    lastSaveTime
  };
}
