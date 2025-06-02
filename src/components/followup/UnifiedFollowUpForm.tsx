
import React, { useState, useEffect, useCallback } from 'react';
import { TabbedFollowUpForm } from './TabbedFollowUpForm';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { debounce } from 'lodash';

interface UnifiedFollowUpFormProps {
  vin: string;
  initialData?: Partial<FollowUpAnswers>;
  onSubmit: (values: FollowUpAnswers) => Promise<void>;
  onSave?: (values: FollowUpAnswers) => Promise<void>;
}

export function UnifiedFollowUpForm({ vin, initialData, onSubmit, onSave }: UnifiedFollowUpFormProps) {
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin: vin,
    zip_code: initialData?.zip_code || '',
    mileage: initialData?.mileage,
    condition: initialData?.condition || 'good',
    transmission: initialData?.transmission || 'automatic',
    previous_owners: initialData?.previous_owners,
    previous_use: initialData?.previous_use || 'personal',
    title_status: initialData?.title_status || 'clean',
    dashboard_lights: initialData?.dashboard_lights || [],
    tire_condition: initialData?.tire_condition || 'good',
    exterior_condition: initialData?.exterior_condition || 'good',
    interior_condition: initialData?.interior_condition || 'good',
    smoking: initialData?.smoking || false,
    petDamage: initialData?.petDamage || false,
    rust: initialData?.rust || false,
    hailDamage: initialData?.hailDamage || false,
    frame_damage: initialData?.frame_damage || false,
    accident_history: initialData?.accident_history || {
      hadAccident: false,
      count: 0,
      location: '',
      severity: 'minor',
      repaired: false,
      frameDamage: false,
      description: ''
    },
    accidents: initialData?.accidents,
    modifications: initialData?.modifications || {
      hasModifications: false,
      modified: false,
      types: []
    },
    serviceHistory: initialData?.serviceHistory || {
      hasRecords: false,
      lastService: '',
      frequency: undefined,
      dealerMaintained: false,
      description: ''
    },
    service_history: initialData?.service_history,
    loan_balance: initialData?.loan_balance,
    has_active_loan: initialData?.has_active_loan || false,
    payoffAmount: initialData?.payoffAmount,
    features: initialData?.features || [],
    additional_notes: initialData?.additional_notes || '',
    is_complete: false,
    completion_percentage: 0
  });

  // Debounced auto-save function
  const debouncedAutoSave = useCallback(
    debounce(async (data: FollowUpAnswers) => {
      if (onSave) {
        try {
          await onSave(data);
          console.log('Auto-saved form data');
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    }, 2000),
    [onSave]
  );

  // Calculate completion percentage
  const calculateCompletionPercentage = (data: FollowUpAnswers): number => {
    const requiredFields = [
      data.zip_code,
      data.mileage,
      data.condition,
      data.transmission,
      data.title_status,
      data.tire_condition,
      data.exterior_condition,
      data.interior_condition
    ];
    
    const optionalFields = [
      data.previous_owners,
      data.serviceHistory?.hasRecords,
      data.accident_history?.hadAccident,
      data.features?.length > 0,
      data.additional_notes
    ];
    
    const completedRequired = requiredFields.filter(field => 
      field !== undefined && field !== null && field !== ''
    ).length;
    
    const completedOptional = optionalFields.filter(field => 
      field !== undefined && field !== null && field !== false
    ).length;
    
    const requiredScore = (completedRequired / requiredFields.length) * 80; // 80% weight for required
    const optionalScore = (completedOptional / optionalFields.length) * 20; // 20% weight for optional
    
    return Math.round(requiredScore + optionalScore);
  };

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => {
      const updated = { ...prev, ...updates };
      const completionPercentage = calculateCompletionPercentage(updated);
      
      const finalData = {
        ...updated,
        completion_percentage: completionPercentage
      };
      
      // Trigger auto-save
      debouncedAutoSave(finalData);
      
      return finalData;
    });
  };

  // Initial completion calculation
  useEffect(() => {
    const completionPercentage = calculateCompletionPercentage(formData);
    if (formData.completion_percentage !== completionPercentage) {
      setFormData(prev => ({
        ...prev,
        completion_percentage: completionPercentage
      }));
    }
  }, []);

  const handleSubmit = async () => {
    const completionPercentage = calculateCompletionPercentage(formData);
    
    const completeFormData = {
      ...formData,
      is_complete: true,
      completion_percentage: completionPercentage
    };
    
    await onSubmit(completeFormData);
  };

  return (
    <TabbedFollowUpForm
      formData={formData}
      updateFormData={updateFormData}
      onSubmit={handleSubmit}
      isLoading={false}
    />
  );
}
