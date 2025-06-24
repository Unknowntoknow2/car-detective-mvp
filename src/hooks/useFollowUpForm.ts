
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
    ...initialData
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadExistingData();
  }, [vin]);

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
        return;
      }

      if (data) {
        // Migrate service_history string to serviceHistory object if needed
        let serviceHistory = data.serviceHistory;
        if (!serviceHistory && data.service_history) {
          serviceHistory = {
            hasRecords: Boolean(data.service_history),
            description: data.service_history,
            frequency: 'unknown',
            dealerMaintained: false,
            services: []
          };
        }

        // Ensure all required fields have proper defaults
        const loadedData = {
          ...data,
          // Ensure proper structure for complex fields
          accidents: data.accidents || {
            hadAccident: false,
            count: 0,
            severity: 'minor',
            repaired: false,
            frameDamage: false,
            description: '',
            types: [],
            repairShops: [],
            airbagDeployment: false
          },
          modifications: data.modifications || {
            hasModifications: false,
            modified: false,
            types: [],
            additionalNotes: ''
          },
          serviceHistory: serviceHistory || {
            hasRecords: false,
            frequency: 'unknown',
            dealerMaintained: false,
            description: '',
            services: []
          },
          dashboard_lights: data.dashboard_lights || [],
          features: data.features || [],
          exterior_condition: data.exterior_condition || 'good',
          interior_condition: data.interior_condition || 'good',
          brake_condition: data.brake_condition || 'good',
          additional_notes: data.additional_notes || ''
        };

        setFormData(prev => ({
          ...prev,
          ...loadedData
        }));
      }
    } catch (error) {
      console.error('Error loading follow-up data:', error);
    } finally {
      setIsLoading(false);
    }
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

  const saveFormData = async (dataToSave: FollowUpAnswers) => {
    if (!vin) return false;

    try {
      setIsSaving(true);
      
      // Prepare data for database save
      const saveData = {
        ...dataToSave,
        vin,
        // Map serviceHistory.description to service_history for backward compatibility
        service_history: dataToSave.serviceHistory?.description || null,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('follow_up_answers')
        .upsert(saveData, {
          onConflict: 'vin'
        });

      if (error) {
        console.error('Error saving follow-up data:', error);
        toast.error('Failed to save data');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving follow-up data:', error);
      toast.error('Failed to save data');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Debounced save function
  const debouncedSave = (() => {
    let timeoutId: NodeJS.Timeout;
    return (data: FollowUpAnswers) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        saveFormData(data);
      }, 1000); // Save after 1 second of inactivity
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
          year: decodedVehicle.year || new Date().getFullYear(),
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
    isSaving
  };
}
