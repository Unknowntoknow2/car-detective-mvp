
import React, { useState, useCallback } from 'react';
import { VINLookupForm } from '@/components/lookup/vin/VINLookupForm';
import VinDecoderResults from './vin/VinDecoderResults'; 
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { CarfaxErrorAlert } from './vin/CarfaxErrorAlert';
import { DecodedVehicleInfo } from '@/types/vehicle';

export interface VinLookupProps {
  value?: string;
  onChange?: (vin: string) => void;
  onLookup?: () => void;
  isLoading?: boolean;
  existingVehicle?: any;
}

export const VinLookup: React.FC<VinLookupProps> = ({
  value: externalValue,
  onChange: externalOnChange,
  onLookup: externalOnLookup,
  isLoading: externalIsLoading,
  existingVehicle
}) => {
  const [vinNumber, setVinNumber] = useState(externalValue || '');
  const { isLoading: internalIsLoading, error, result, lookupVin } = useVinDecoder();
  
  const isLoading = externalIsLoading || internalIsLoading;

  const handleVinChange = useCallback((vin: string) => {
    setVinNumber(vin);
    if (externalOnChange) {
      externalOnChange(vin);
    }
  }, [externalOnChange]);

  const handleLookup = useCallback(() => {
    if (externalOnLookup) {
      externalOnLookup();
    } else if (vinNumber) {
      lookupVin(vinNumber);
    }
  }, [vinNumber, lookupVin, externalOnLookup]);

  const onReset = useCallback(() => {
    setVinNumber('');
  }, []);

  const typedResult = result as DecodedVehicleInfo | null;

  return (
    <div className="w-full">
      {!typedResult ? (
        <VINLookupForm 
          value={vinNumber}
          onChange={handleVinChange}
          onSubmit={handleLookup}
          isLoading={isLoading}
          error={error}
          existingVehicle={existingVehicle}
        />
      ) : (
        <>
          <VinDecoderResults 
            stage="initial"
            result={typedResult}
            pipelineVehicle={null}
            requiredInputs={null}
            valuationResult={null}
            valuationError={null}
            pipelineLoading={false}
            submitValuation={async () => {}}
            vin={vinNumber}
            carfaxData={undefined} // Fix type issue by using undefined instead of null
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
