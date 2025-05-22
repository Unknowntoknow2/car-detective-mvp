
import React, { useState } from 'react';
import { PlateLookupForm } from './plate/PlateLookupForm';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import ValuationEmptyState from '@/components/valuation/ValuationEmptyState';
import { useValuationFlow } from '@/hooks/useValuationFlow';
import { Card, CardContent } from '@/components/ui/card';

interface PlateLookupProps {
  onSubmit?: (plate: string, state: string) => void;
  onResultsReady?: (data: any) => void;
}

export const PlateLookup: React.FC<PlateLookupProps> = ({
  onSubmit,
  onResultsReady
}) => {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('');
  const { 
    isLoading, 
    error, 
    valuationData, 
    decodedVehicle,
    lookupByPlate,
    resetState
  } = useValuationFlow();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSubmit) {
      onSubmit(plate, state);
      return;
    }
    
    const result = await lookupByPlate(plate, state);
    
    if (result && onResultsReady) {
      onResultsReady(result);
    }
  };

  const handleReset = () => {
    setPlate('');
    setState('');
    resetState();
  };

  const handlePlateChange = (value: string) => {
    setPlate(value);
  };

  const handleStateChange = (value: string) => {
    setState(value);
  };

  return (
    <div className="space-y-6">
      {!valuationData ? (
        <Card>
          <CardContent className="pt-6">
            <PlateLookupForm
              plate={plate}
              state={state}
              isLoading={isLoading}
              onPlateChange={handlePlateChange}
              onStateChange={handleStateChange}
              onSubmit={handleSubmit}
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
              Look up another vehicle
            </button>
          </div>
        </div>
      )}
      
      {error && !isLoading && !valuationData && (
        <ValuationEmptyState 
          message={`We couldn't find information for this plate. ${error}`}
          actionLabel="Try a different plate"
          onAction={handleReset}
        />
      )}
    </div>
  );
};

export default PlateLookup;
