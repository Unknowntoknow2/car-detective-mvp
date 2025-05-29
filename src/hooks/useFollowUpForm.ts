
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { toast } from 'sonner';

export function useFollowUpForm(vin: string, initialData?: Partial<FollowUpAnswers>) {
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    zip_code: '',
    condition: 'good',
    title_status: 'clean',
    previous_use: 'personal',
    service_history: 'good',
    maintenance_status: 'good',
    tire_condition: 'good',
    exterior_condition: 'good',
    interior_condition: 'good',
    frame_damage: false,
    dashboard_lights: [],
    accidents: {
      hadAccident: false,
      count: 0,
      location: '',
      severity: 'minor',
      repaired: false,
      frameDamage: false,
      description: ''
    },
    modifications: {
      modified: false,
      types: []
    },
    features: [],
    completion_percentage: 0,
    is_complete: false,
    ...initialData
  });

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
          accidents: data.accidents || prev.accidents,
          modifications: data.modifications || prev.modifications,
          features: data.features || prev.features,
          dashboard_lights: data.dashboard_lights || prev.dashboard_lights
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
