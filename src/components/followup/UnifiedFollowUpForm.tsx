
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
    previous_use: initialData?.previous_use,
    title_status: initialData?.title_status,
    dashboard_lights: initialData?.dashboard_lights || [],
    tire_condition: initialData?.tire_condition,
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
    exterior_condition: initialData?.exterior_condition,
    interior_condition: initialData?.interior_condition,
    smoking: initialData?.smoking,
    petDamage: initialData?.petDamage,
    rust: initialData?.rust,
    hailDamage: initialData?.hailDamage,
    frame_damage: initialData?.frame_damage,
    loan_balance: initialData?.loan_balance,
    has_active_loan: initialData?.has_active_loan,
    payoffAmount: initialData?.payoffAmount,
    features: initialData?.features || [],
    additional_notes: initialData?.additional_notes || '',
    is_complete: false,
    completion_percentage: 0
  });

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = async () => {
    const completeFormData = {
      ...formData,
      is_complete: true,
      completion_percentage: 100
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
