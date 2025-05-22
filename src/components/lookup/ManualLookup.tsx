import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useValuation } from '@/hooks/useValuation';
import ManualEntryForm from './ManualEntryForm';
import { ManualEntryFormData } from './types/manualEntry';

interface ManualLookupProps {
  onSubmit?: (data: ManualEntryFormData) => void;
  onResultsReady?: (result: any) => void;
}

export const ManualLookup: React.FC<ManualLookupProps> = ({
  onSubmit,
  onResultsReady
}) => {
  const { isLoading, manualValuation, valuationData } = useValuation();
  
  const handleSubmit = async (data: ManualEntryFormData) => {
    // If custom onSubmit is provided, use it
    if (onSubmit) {
      onSubmit(data);
      return;
    }
    
    // Otherwise use our hook
    const result = await manualValuation(data);
    
    if (result.success && valuationData) {
      if (onResultsReady) {
        onResultsReady(valuationData);
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <ManualEntryForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading}
        submitButtonText="Get Valuation"
      />
    </div>
  );
};

export default ManualLookup;
