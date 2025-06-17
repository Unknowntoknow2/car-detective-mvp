
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ManualEntryFormData } from '@/types/manual-entry';

interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  mode?: 'free' | 'premium';
}

export const ManualEntryForm: React.FC<ManualEntryFormProps> = ({
  onSubmit,
  isLoading = false,
  submitButtonText = "Submit",
  mode = 'free'
}) => {
  const handleSubmit = () => {
    const mockData: ManualEntryFormData = {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      mileage: 50000,
      condition: 'good',
      zipCode: '12345',
      fuelType: 'gasoline',
      transmission: 'automatic',
      accidentDetails: {
        hadAccident: false,
        severity: undefined
      }
    };
    onSubmit(mockData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Vehicle Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Enter your vehicle details manually for valuation.
        </p>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Loading...' : submitButtonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ManualEntryForm;
