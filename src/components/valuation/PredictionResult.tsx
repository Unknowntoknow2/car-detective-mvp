
import React from 'react';
import { useValuationResult } from '@/hooks/useValuationResult';
import { Loader2 } from 'lucide-react';
import ValuationResult from './ValuationResult';

interface PredictionResultProps {
  valuationId: string;
}

export function PredictionResult({ valuationId }: PredictionResultProps) {
  const { data, isLoading, error } = useValuationResult(valuationId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading valuation result...</span>
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <h3 className="font-medium">Error loading valuation</h3>
        <p className="text-sm mt-1">{error?.message || 'Failed to load valuation data'}</p>
      </div>
    );
  }
  
  return (
    <ValuationResult
      make={data.make}
      model={data.model}
      year={data.year}
      mileage={data.mileage || 0}
      condition={data.condition || 'Good'}
      location={data.zipCode || '00000'}
      valuation={data.estimatedValue || 0}
      valuationId={valuationId}
    />
  );
}
