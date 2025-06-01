
import React, { useState } from 'react';
import { TabbedFollowUpForm } from './TabbedFollowUpForm';
import { FollowUpAnswers } from '@/types/follow-up-answers';

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
      frequency: '',
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

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => {
      const updated = { ...prev, ...updates };
      
      // Auto-save if onSave is provided
      if (onSave) {
        const saveTimeout = setTimeout(() => {
          onSave(updated);
        }, 1000);
        
        return updated;
      }
      
      return updated;
    });
  };

  const handleSubmit = async () => {
    // Calculate final completion percentage
    const completionFields = [
      formData.zip_code,
      formData.mileage,
      formData.condition,
      formData.transmission,
      formData.title_status,
      formData.previous_owners !== undefined,
      formData.accident_history?.hadAccident !== undefined,
      formData.serviceHistory?.hasRecords !== undefined
    ];
    
    const completedFields = completionFields.filter(Boolean).length;
    const completionPercentage = Math.round((completedFields / completionFields.length) * 100);
    
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
