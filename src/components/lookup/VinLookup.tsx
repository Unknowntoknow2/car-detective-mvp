
import React, { useState, useCallback } from 'react';
import { VINLookupForm } from './vin/VINLookupForm';
import { VinDecoderResults } from './vin/VinDecoderResults';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { CarfaxErrorAlert } from './vin/CarfaxErrorAlert';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { ValuationFactorsGrid } from '@/components/valuation/condition/factors/ValuationFactorsGrid';
import { useState as useReactState } from 'react';

export const VinLookup = () => {
  const [vinNumber, setVinNumber] = useState('');
  const { isLoading, error, result, lookupVin } = useVinDecoder();
  const navigate = useNavigate();
  const [conditionValues, setConditionValues] = useReactState({
    accidents: 0,
    mileage: 50,
    year: 0,
    titleStatus: 'Clean'
  });
  
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

  const handleConditionChange = (id: string, value: any) => {
    setConditionValues(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  return (
    <div className="w-full space-y-8">
      {!result ? (
        <VINLookupForm 
          value={vinNumber}
          onChange={handleVinChange}
          onSubmit={handleLookup}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <div className="space-y-8">
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
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6">Vehicle Condition Factors</h2>
            <p className="text-muted-foreground mb-6">
              Adjust these factors to get a more accurate valuation for your vehicle.
            </p>
            
            <ValuationFactorsGrid 
              values={conditionValues}
              onChange={handleConditionChange}
            />
            
            <div className="mt-8 flex gap-4">
              <Button 
                className="flex-1" 
                onClick={() => {
                  // Store the condition values in localStorage
                  localStorage.setItem('condition_values', JSON.stringify(conditionValues));
                  
                  // Get the valuation ID
                  const valuationId = localStorage.getItem('latest_valuation_id');
                  if (valuationId) {
                    navigate(`/result?id=${valuationId}`);
                  } else {
                    toast({ 
                      title: "Error", 
                      description: "Missing valuation ID. Please try again.",
                      variant: "destructive"
                    });
                  }
                }}
              >
                Calculate Value
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onReset}
              >
                Lookup Another VIN
              </Button>
            </div>
          </div>
        </div>
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
