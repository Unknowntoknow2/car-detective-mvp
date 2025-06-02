import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TabbedFollowUpForm from './TabbedFollowUpForm';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { toast } from 'sonner';

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

export function UnifiedFollowUpForm({ 
  vin, 
  initialData, 
  onSubmit, 
  onSave 
}: UnifiedFollowUpFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FollowUpAnswers>(() => ({
    ...defaultFormData,
    vin: vin || '',
    ...initialData,
  }));
  const [isLoading, setIsLoading] = useState(false);

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
    toast.success('Progress saved');
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
        // Default submission logic
        const response = await fetch('/api/valuation/submit-followup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }

        const result = await response.json();
        navigate(`/valuation/result/${result.id}`);
      }
    } catch (error) {
      console.error('Error submitting follow-up:', error);
      toast.error('Failed to submit valuation. Please try again.');
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
