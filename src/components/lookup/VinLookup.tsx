
import React, { useState } from 'react';
import { VINLookupForm } from './vin/VINLookupForm';
import { ValuationResult } from '@/components/valuation/ValuationResult';
import ValuationEmptyState from '@/components/valuation/ValuationEmptyState';
import { useValuationFlow } from '@/hooks/useValuationFlow';
import { Card, CardContent } from '@/components/ui/card';

interface VinLookupProps {
  onSubmit?: (vin: string) => void;
  onResultsReady?: (data: any) => void;
}

const VinLookup: React.FC<VinLookupProps> = ({ 
  onSubmit,
  onResultsReady
}) => {
  const [vin, setVin] = useState('');
  const { 
    isLoading, 
    error, 
    valuationData, 
    decodedVehicle,
    lookupByVin,
    resetState
  } = useValuationFlow();

  const handleSubmit = async (vinNumber: string) => {
    setVin(vinNumber);
    
    if (onSubmit) {
      onSubmit(vinNumber);
      return;
    }
    
    const result = await lookupByVin(vinNumber);
    
    if (result && onResultsReady) {
      onResultsReady(result);
    }
  };

  const handleReset = () => {
    setVin('');
    resetState();
  };

  return (
    <div className="space-y-6">
      {!valuationData ? (
        <Card>
          <CardContent className="pt-6">
            <VINLookupForm 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
              value={vin}
              onChange={setVin}
              error={error}
              existingVehicle={decodedVehicle ? {
                make: decodedVehicle.make,
                model: decodedVehicle.model,
                year: decodedVehicle.year
              } : undefined}
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
          message={`We couldn't find information for this VIN. ${error}`}
          actionLabel="Try a different VIN"
          onAction={handleReset}
        />
      )}
    </div>
  );
};

export default VinLookup;
