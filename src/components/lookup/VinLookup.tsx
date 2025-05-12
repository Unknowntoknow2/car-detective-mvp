
import React, { useState, useCallback } from 'react';
import { VINLookupForm } from './vin/VINLookupForm';
import VinDecoderResults from './vin/VinDecoderResults';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import CarfaxErrorAlert from './vin/CarfaxErrorAlert';

export const VinLookup = () => {
  const [vinNumber, setVinNumber] = useState('');
  const { data, isLoading, error, decodeVin, resetDecoder } = useVinDecoder();
  
  const handleVinChange = useCallback((vin: string) => {
    setVinNumber(vin);
  }, []);
  
  const handleLookup = useCallback(() => {
    if (vinNumber) {
      decodeVin(vinNumber);
    }
  }, [vinNumber, decodeVin]);
  
  const onReset = useCallback(() => {
    resetDecoder();
    setVinNumber('');
  }, [resetDecoder]);
  
  return (
    <div className="w-full">
      {!data ? (
        <VINLookupForm 
          vinNumber={vinNumber} 
          onVinChange={handleVinChange} 
          onLookup={handleLookup}
          isLoading={isLoading}
        />
      ) : (
        <>
          <VinDecoderResults decodedVin={data} />
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={onReset}
          >
            Lookup Another VIN
          </Button>
        </>
      )}
      
      {error && (
        error.message.includes('Carfax') ? (
          <CarfaxErrorAlert onReset={onReset} />
        ) : (
          <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-md flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm">{error.message}</p>
          </div>
        )
      )}
    </div>
  );
};

export default VinLookup;
