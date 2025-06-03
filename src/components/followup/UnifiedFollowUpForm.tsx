
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabbedFollowUpForm from './TabbedFollowUpForm';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UnifiedFollowUpFormProps {
  vin?: string;
  initialData?: Partial<FollowUpAnswers>;
  onSubmit?: (data: FollowUpAnswers) => void;
  onSave?: (data: FollowUpAnswers) => void;
}

const defaultFormData: FollowUpAnswers = {
  vin: '',
  zip_code: '',
  mileage: undefined,
  condition: undefined,
  transmission: undefined,
  title_status: undefined,
  previous_use: 'personal',
  previous_owners: undefined,
  serviceHistory: undefined,
  tire_condition: undefined,
  brake_condition: undefined,
  exterior_condition: undefined,
  interior_condition: undefined,
  dashboard_lights: [],
  accident_history: undefined,
  modifications: undefined,
  features: [],
  additional_notes: '',
  service_history: '',
  loan_balance: undefined,
  has_active_loan: undefined,
  payoffAmount: undefined,
  accidents: undefined,
  frame_damage: undefined,
  smoking: undefined,
  petDamage: undefined,
  rust: undefined,
  hailDamage: undefined,
  completion_percentage: 0,
  is_complete: false,
};

const STORAGE_KEY = 'followupDraft';

export function UnifiedFollowUpForm({ 
  vin, 
  initialData, 
  onSubmit, 
  onSave 
}: UnifiedFollowUpFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FollowUpAnswers>(() => {
    // Try to restore from localStorage first
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          toast.success('Draft restored from previous session');
          return {
            ...defaultFormData,
            ...parsed,
            vin: vin || parsed.vin || '',
            ...initialData,
          };
        }
      } catch (error) {
        console.warn('Failed to parse saved form data:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    
    return {
      ...defaultFormData,
      vin: vin || '',
      ...initialData,
    };
  });
  const [isLoading, setIsLoading] = useState(false);

  // Auto-save to localStorage whenever form data changes
  useEffect(() => {
    if (typeof window !== 'undefined' && formData.vin) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.warn('Failed to save form data to localStorage:', error);
      }
    }
  }, [formData]);

  // Update form data when props change
  useEffect(() => {
    if (vin || initialData) {
      setFormData(prev => ({
        ...prev,
        vin: vin || prev.vin,
        ...initialData,
      }));
    }
  }, [vin, initialData]);

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => {
      const updated = { ...prev, ...updates };
      
      // Calculate completion percentage
      const totalFields = Object.keys(defaultFormData).length;
      const completedFields = Object.values(updated).filter(value => 
        value !== undefined && value !== '' && value !== null && 
        !(Array.isArray(value) && value.length === 0)
      ).length;
      
      updated.completion_percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
      updated.is_complete = updated.completion_percentage >= 60;
      
      return updated;
    });
  };

  const handleSaveProgress = () => {
    if (onSave) {
      onSave(formData);
    }
    
    // Manual save to localStorage with feedback
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      toast.success('Progress saved');
    } catch (error) {
      console.error('Failed to save progress:', error);
      toast.error('Failed to save progress');
    }
  };

  const handleSubmit = async () => {
    if (!formData.is_complete) {
      toast.error('Please complete at least 60% of the form before submitting');
      return;
    }

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Submit to our Supabase edge function
        const { data, error } = await supabase.functions.invoke('submit-followup', {
          body: formData
        });

        if (error) {
          throw new Error(error.message || 'Submission failed');
        }

        const result = data;
        
        // Clear the saved draft on successful submission
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEY);
        }
        
        toast.success('Valuation submitted successfully!');
        navigate(`/valuation/result/${result.id}`);
      }
    } catch (error) {
      console.error('Error submitting follow-up:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit valuation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TabbedFollowUpForm
      formData={formData}
      updateFormData={updateFormData}
      onSubmit={handleSubmit}
      onSave={handleSaveProgress}
      isLoading={isLoading}
    />
  );
}
