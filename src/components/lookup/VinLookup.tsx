
import React, { useState, useCallback } from 'react';
import { VINLookupForm } from './vin/VINLookupForm';
import { VinDecoderResults } from './vin/VinDecoderResults';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { CarfaxErrorAlert } from './vin/CarfaxErrorAlert';

export const VinLookup = () => {
  const [vinNumber, setVinNumber] = useState('');
  const { isLoading, error, result, lookupVin } = useVinDecoder();
  
  const handleVinChange = useCallback((vin: string) => {
    setVinNumber(vin);
  }, []);
  
  const handleLookup = useCallback(() => {
    if (vinNumber) {
      lookupVin(vinNumber);
    }
  }, [vinNumber, lookupVin]);
  
  const onReset = useCallback(() => {
    // Reset the form
    setVinNumber('');
  }, []);
  
  return (
    <div className="w-full">
      {!result ? (
        <VINLookupForm 
          onSubmit={handleLookup}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <>
          <VinDecoderResults decodedVin={result} />
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={onReset}
          >
            Lookup Another VIN
          </Button>
        </>
      )}
      
      {error && error.includes('Carfax') ? (
        <CarfaxErrorAlert error="Unable to retrieve Carfax vehicle history report." />
      ) : error ? (
        <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-md flex items-center gap-2 text-red-700">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      ) : null}
    </div>
  );
};

export default VinLookup;
