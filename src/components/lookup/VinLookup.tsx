
import React, { useState, useCallback } from 'react';
import { VINLookupForm } from './vin/VINLookupForm';
import { VinDecoderResults } from './vin/VinDecoderResults';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { CarfaxErrorAlert } from './vin/CarfaxErrorAlert';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export const VinLookup = () => {
  const [vinNumber, setVinNumber] = useState('');
  const { isLoading, error, result, lookupVin } = useVinDecoder();
  const navigate = useNavigate();
  
  const handleVinChange = useCallback((vin: string) => {
    setVinNumber(vin);
  }, []);
  
  const handleLookup = useCallback(() => {
    if (vinNumber) {
      console.log('FREE VIN: Submitting form with VIN:', vinNumber);
      lookupVin(vinNumber).then(response => {
        console.log('FREE VIN: Response from API:', response);
        if (response) {
          console.log('FREE VIN: Lookup successful, result available');
          
          // Store valuationId in localStorage if available from the API response
          const responseId = localStorage.getItem('latest_valuation_id');
          console.log('FREE VIN: Current valuationId in localStorage:', responseId);
          
          // Instead of navigating immediately, we'll wait to confirm we have the result displayed
          setTimeout(() => {
            if (document.querySelector('.valuation-result')) {
              console.log('FREE VIN: Valuation result component found, no navigation needed');
            }
          }, 500);
        } else {
          console.warn('FREE VIN: No response or error occurred during lookup');
        }
      }).catch(error => {
        console.error('FREE VIN: Error during lookup:', error);
        toast({ 
          title: "Error", 
          description: "There was a problem looking up this VIN. Please try again.",
          variant: "destructive"
        });
      });
    }
  }, [vinNumber, lookupVin]);
  
  const onReset = useCallback(() => {
    console.log('FREE VIN: Reset form triggered');
    // Reset the form
    setVinNumber('');
  }, []);
  
  const handleDownloadPdf = useCallback(() => {
    console.log('FREE VIN: Download PDF triggered');
    toast({ 
      title: "PDF Download", 
      description: "Your PDF is being generated and will download shortly."
    });
    // Implementation for PDF download would go here
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
            onDownloadPdf={handleDownloadPdf}
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
