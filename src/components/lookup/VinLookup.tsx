// ✅ File: src/components/lookup/VinLookup.tsx

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { VINLookupForm } from './vin/VINLookupForm';
import { VinDecoderResults } from './vin/VinDecoderResults';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { CarfaxErrorAlert } from './vin/CarfaxErrorAlert';
import ManualEntryForm from './ManualEntryForm';
import { useValuationFallback } from '@/hooks/useValuationFallback';
import { toast } from 'sonner';

export const VinLookup = () => {
  const [vinNumber, setVinNumber] = useState('');
  const { isLoading, error, result, lookupVin } = useVinDecoder();
  const navigate = useNavigate();
  const [carfaxData, setCarfaxData] = useState(null);
  const { fallbackState, setFallbackForVin, shouldShowManualEntry } = useValuationFallback();

  const handleVinChange = useCallback((vin: string) => {
    setVinNumber(vin);
  }, []);

  const handleLookup = useCallback(async () => {
    if (vinNumber) {
      console.log('VIN LOOKUP: Submitting form with VIN:', vinNumber);

      try {
        const response = await lookupVin(vinNumber);
        console.log('VIN LOOKUP: Response from API:', response);

        if (!response) {
          console.error('VIN LOOKUP: No response received');
          setFallbackForVin();
          return;
        }

        // ✅ Store in localStorage
        localStorage.setItem(`vin_lookup_${vinNumber}`, JSON.stringify(response));

        // ✅ Navigate to /result?vin=...
        navigate(`/result?vin=${vinNumber}`);
      } catch (error) {
        console.error('VIN LOOKUP: Error during lookup:', error);
        setFallbackForVin();
      }
    }
  }, [vinNumber, lookupVin, navigate, setFallbackForVin]);

  const onReset = useCallback(() => {
    console.log('VIN LOOKUP: Reset form triggered');
    setVinNumber('');
  }, []);

  const handleManualSubmit = useCallback((data: any) => {
    console.log('VIN LOOKUP: Fallback to manual entry with data:', data);
    toast.success('Vehicle information submitted manually');
  }, []);

  if (shouldShowManualEntry) {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-amber-200 bg-amber-50 rounded-md flex items-center gap-2 text-amber-700">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <p className="font-medium">VIN lookup failed</p>
            <p className="text-sm">Please enter your vehicle details manually</p>
          </div>
        </div>
        <ManualEntryForm onSubmit={handleManualSubmit} />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full">
        <VINLookupForm 
          value={vinNumber}
          onChange={handleVinChange}
          onSubmit={handleLookup}
          isLoading={isLoading}
          error={error}
        />

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
  }

  return (
    <>
      <VinDecoderResults 
        stage="initial" 
        result={result} 
        pipelineVehicle={null}
        requiredInputs={null}
        valuationResult={null}
        valuationError={null}
        pipelineLoading={false}
        submitValuation={async () => {}}
        vin={vinNumber}
        carfaxData={null}
        onDownloadPdf={() => {}}
      />
      <Button 
        variant="outline" 
        className="mt-4" 
        onClick={onReset}
      >
        Lookup Another VIN
      </Button>
    </>
  );
};

export default VinLookup;
