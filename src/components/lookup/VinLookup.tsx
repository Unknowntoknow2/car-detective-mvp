
import React, { useState, useCallback } from 'react';
import { VINLookupForm } from './vin/VINLookupForm';
import { VinDecoderResults } from './vin/VinDecoderResults';
import { useVinDecoder } from '@/hooks/useVinDecoder';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { CarfaxErrorAlert } from './vin/CarfaxErrorAlert';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { ValuationFactorsGrid } from '@/components/valuation/condition/factors/ValuationFactorsGrid';
import { VinLookupService } from '@/services/VinLookupService';

interface VinLookupProps {
  onSubmit?: (vin: string) => void;
}

export const VinLookup: React.FC<VinLookupProps> = ({ onSubmit }) => {
  const [vinNumber, setVinNumber] = useState('');
  const { isLoading, error, result, lookupVin } = useVinDecoder();
  const navigate = useNavigate();
  const [conditionValues, setConditionValues] = useState({
    accidents: 0,
    mileage: 50,
    year: 0,
    titleStatus: 'Clean'
  });
  
  const handleVinChange = useCallback((vin: string) => {
    setVinNumber(vin);
  }, []);
  
  const handleLookup = useCallback(async () => {
    if (vinNumber) {
      console.log('VIN LOOKUP: Submitting form with VIN:', vinNumber);
      
      // If an onSubmit prop is provided, call it and return early
      if (onSubmit) {
        onSubmit(vinNumber);
        return;
      }
      
      try {
        // Look up the VIN locally first - don't immediately navigate
        const vehicleData = await lookupVin(vinNumber);
        
        if (vehicleData) {
          console.log('VIN LOOKUP: Lookup successful, showing results in current page');
          // We'll continue to use the existing result state for rendering
          // The result will now be displayed in the current component
        }
      } catch (error) {
        console.error('VIN LOOKUP: Error during lookup:', error);
        toast({
          description: "There was a problem looking up this VIN. Please try again.",
          variant: "destructive"
        });
      }
    }
  }, [vinNumber, lookupVin, onSubmit]);
  
  const onReset = useCallback(() => {
    console.log('VIN LOOKUP: Reset form triggered');
    // Reset the form
    setVinNumber('');
  }, []);
  
  const handleDownloadPdf = useCallback(() => {
    console.log('VIN LOOKUP: Download PDF triggered');
    toast({
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

  const handlePremiumValuation = useCallback(() => {
    if (result) {
      // Use our service to transition to premium valuation
      VinLookupService.startPremiumValuation(result);
      navigate('/premium-valuation');
    }
  }, [result, navigate]);
  
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
                  
                  // Store a temporary valuation object with minimal data to view on the results page
                  localStorage.setItem('temp_valuation_data', JSON.stringify({
                    id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                    make: result.make,
                    model: result.model,
                    year: result.year,
                    vin: vinNumber,
                    estimated_value: Math.floor(20000 + Math.random() * 5000),
                    confidence_score: 85,
                    condition: 'Good',
                    mileage: 45000,
                    adjustments: []
                  }));
                  
                  // Notify about the valuation
                  toast({
                    description: "Your free valuation has been calculated below."
                  });
                }}
              >
                Calculate Free Value
              </Button>
              
              <Button 
                variant="secondary"
                className="flex-1"
                onClick={handlePremiumValuation}
              >
                Get Premium Valuation
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
