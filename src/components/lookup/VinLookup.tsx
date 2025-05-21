
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { DecodedVehicleInfo } from '@/types/vehicle';

// Import the components directly
import { VINLookupForm } from './vin/VINLookupForm';
import VinDecoderResults from './vin/VinDecoderResults'; 
import { CarfaxErrorAlert } from './vin/CarfaxErrorAlert';

interface VinLookupProps {
  onSubmit?: (vin: string) => void;
}

export const VinLookup: React.FC<VinLookupProps> = ({ onSubmit }) => {
  const [vinNumber, setVinNumber] = useState('');
  const { isLoading, error, result, lookupVin } = useVinDecoder();

  const handleVinChange = useCallback((vin: string) => {
    setVinNumber(vin);
  }, []);

  const handleLookup = useCallback(() => {
    if (vinNumber) {
      lookupVin(vinNumber);
      if (onSubmit) {
        onSubmit(vinNumber);
      }
    }
  }, [vinNumber, lookupVin, onSubmit]);

  const onReset = useCallback(() => {
    setVinNumber('');
  }, []);

  return (
    <div className="w-full">
      {!result ? (
        <VINLookupForm 
          value={vinNumber}
          onChange={handleVinChange}
          onSubmit={handleLookup}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <>
          {/* We'll wrap this in a guard to only show when we have data */}
          {result && (
            <VinDecoderResults 
              result={result}
              vin={vinNumber}
              carfaxData={null}
              onDownloadPdf={() => {}}
              // These props are expected by the component
              stage="initial"
              pipelineVehicle={null}
              requiredInputs={null}
              valuationResult={null}
              valuationError={null}
              pipelineLoading={false}
              submitValuation={async () => {}}
            />
          )}
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
