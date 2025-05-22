
import React from 'react';
import { ManualEntryForm } from './ManualEntryForm';
import { ManualEntryFormData } from './types/manualEntry';

export interface ManualLookupProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
  onResultsReady?: (result: any) => void;
}

export const ManualLookup: React.FC<ManualLookupProps> = ({ 
  onSubmit, 
  isLoading = false,
  submitButtonText = "Get Valuation",
  isPremium = false,
  onResultsReady
}) => {
  const handleSubmit = (data: ManualEntryFormData) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-4">
      <ManualEntryForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading}
        submitButtonText={submitButtonText}
        isPremium={isPremium}
      />
    </div>
  );
};

export default ManualLookup;
