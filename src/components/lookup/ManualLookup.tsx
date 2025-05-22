
import React from 'react';
import ManualEntryForm from '@/components/lookup/manual/ManualEntryForm';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import ValuationEmptyState from '@/components/valuation/ValuationEmptyState';
import { useValuationFlow } from '@/hooks/useValuationFlow';
import { Card, CardContent } from '@/components/ui/card';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

interface ManualLookupProps {
  onSubmit?: (data: ManualEntryFormData) => void;
  onResultsReady?: (data: any) => void;
}

export function ManualLookup({
  onSubmit,
  onResultsReady
}: ManualLookupProps) {
  const { 
    isLoading, 
    error, 
    valuationData, 
    submitManualEntry,
    resetState
  } = useValuationFlow();

  const handleSubmit = async (data: ManualEntryFormData) => {
    if (onSubmit) {
      onSubmit(data);
      return;
    }
    
    const result = await submitManualEntry(data);
    
    if (result && onResultsReady) {
      onResultsReady(result);
    }
  };

  const handleReset = () => {
    resetState();
  };

  return (
    <div className="space-y-6">
      {!valuationData ? (
        <Card className="shadow-sm border-2">
          <CardContent className="p-5">
            <ManualEntryForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              submitButtonText="Get Valuation"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <ValuationResult 
            data={valuationData} 
            isPremium={false}
            isLoading={isLoading}
            error={error || undefined}
          />
          
          <div className="flex justify-center">
            <button 
              onClick={handleReset}
              className="text-sm text-primary hover:underline"
            >
              Valuate another vehicle
            </button>
          </div>
        </div>
      )}
      
      {error && !isLoading && !valuationData && (
        <ValuationEmptyState 
          message={`We couldn't generate a valuation with the provided information. ${error}`}
          actionLabel="Try different details"
          onAction={handleReset}
        />
      )}
    </div>
  );
}

export default ManualLookup;
