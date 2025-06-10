
import React, { useState } from 'react';
import { ManualEntryFormFree } from '../ManualEntryFormFree';
import { UnifiedFollowUpQuestions } from '../form-parts/UnifiedFollowUpQuestions';
import { ManualEntryFormData, ConditionLevel } from '@/types/manualEntry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
  initialData?: Partial<ManualEntryFormData>;
  onCancel?: () => void;
}

export function ManualEntryForm({
  onSubmit,
  isLoading = false,
  submitButtonText = "Get Valuation",
  isPremium = false,
  initialData,
  onCancel,
}: ManualEntryFormProps) {
  const [formData, setFormData] = useState<ManualEntryFormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    condition: ConditionLevel.Good,
    zipCode: '',
    fuelType: '',
    transmission: '',
    trim: '',
    ...initialData,
  });

  const updateFormData = (updates: Partial<ManualEntryFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isPremium ? 'Premium' : 'Free'} Vehicle Valuation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ManualEntryFormFree
          formData={formData}
          updateFormData={updateFormData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitButtonText={submitButtonText}
          isPremium={isPremium}
        />
        
        {isPremium && (
          <UnifiedFollowUpQuestions
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        
        <div className="flex gap-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Processing...' : submitButtonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ManualEntryForm;
