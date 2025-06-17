
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ManualEntryFormData, manualEntrySchema } from '@/types/manual-entry';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { VehicleBasicInfoInputs } from '@/components/lookup/form-parts/VehicleBasicInfoInputs';

interface UnifiedManualEntryFormProps {
  mode: 'free' | 'premium';
  onSubmit: (data: ManualEntryFormData) => void;
  initialData?: Partial<ManualEntryFormData>;
  isLoading?: boolean;
}

export const UnifiedManualEntryForm: React.FC<UnifiedManualEntryFormProps> = ({
  mode,
  onSubmit,
  initialData,
  isLoading = false
}) => {
  const form = useForm<ManualEntryFormData>({
    resolver: zodResolver(manualEntrySchema),
    defaultValues: {
      make: initialData?.make || '',
      model: initialData?.model || '',
      year: initialData?.year || new Date().getFullYear(),
      mileage: initialData?.mileage || 0,
      condition: initialData?.condition || 'good',
      zipCode: initialData?.zipCode || '',
      ...initialData
    }
  });

  const handleSubmit = (data: ManualEntryFormData) => {
    onSubmit(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <VehicleBasicInfoInputs form={form} />
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : `Get ${mode === 'premium' ? 'Premium' : 'Free'} Valuation`}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UnifiedManualEntryForm;
