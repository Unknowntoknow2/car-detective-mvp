
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FollowUpAnswers, ServiceHistoryDetails, ModificationDetails, AccidentDetails } from '@/types/follow-up-answers';
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
      frameDamage: false
    } as AccidentDetails,
    maintenance_records: false,
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
    dashboard_lights: [],
    accident_history: {
      hadAccident: false,
      count: 0,
      location: '',
      severity: 'minor',
      repaired: false,
      frameDamage: false,
      description: ''
    } as AccidentDetails,
    modifications: {
      hasModifications: false,
      modified: false,
      types: [],
      additionalNotes: ''
    } as ModificationDetails,
    features: [],
    additional_notes: '',
    service_history: '',
    completion_percentage: 0,
    is_complete: false,
    previous_owners: 1,
    loan_balance: 0,
    payoffAmount: 0,
    brake_condition: 'good',
    ...initialData
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing data on mount
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
        setFormData(prev => ({
          ...prev,
          ...data,
          // Ensure proper structure for complex fields
          accident_history: data.accident_history || prev.accident_history,
          accidents: data.accidents || prev.accidents,
          modifications: data.modifications || prev.modifications,
          serviceHistory: data.serviceHistory || prev.serviceHistory,
          dashboard_lights: data.dashboard_lights || prev.dashboard_lights,
          features: data.features || prev.features
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
      
      // Auto-save after updates
      debouncedSave(updated);
      
      return updated;
    });
  };

  const saveFormData = async (dataToSave: FollowUpAnswers) => {
    if (!vin) return false;

    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('follow_up_answers')
        .upsert({
          ...dataToSave,
          vin
        }, {
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
    const success = await saveFormData({
      ...formData,
      is_complete: true,
      completion_percentage: 100
    });

    if (success) {
      toast.success('Follow-up completed successfully!');
    }

    return success;
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
