import React, { useState } from 'react';
import { useValuation } from '@/hooks/useValuation';
import { VehicleLookupForm } from './VehicleLookupForm';
import { ValuationDetailsForm } from './ValuationDetailsForm';
import { ValuationResults } from './ValuationResults';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

enum ValuationStep {
  LOOKUP,
  DETAILS,
  RESULTS
}

const ValuationFlow: React.FC = () => {
  const { 
    isLoading, 
    valuationData, 
    error, 
    decodeVin, 
    decodePlate, 
    manualValuation, 
    resetValuation 
  } = useValuation();
  
  const [currentStep, setCurrentStep] = useState<ValuationStep>(ValuationStep.LOOKUP);
  const [vehicleInfo, setVehicleInfo] = useState<DecodedVehicleInfo | null>(null);
  
  const handleVehicleDecoded = (data: DecodedVehicleInfo) => {
    setVehicleInfo(data);
  };
  
  const handleContinueToDetails = () => {
    setCurrentStep(ValuationStep.DETAILS);
  };
  
  const handleSubmitDetails = async (details: any) => {
    if (vehicleInfo) {
      const combinedData = {
        ...vehicleInfo,
        ...details
      };
      await manualValuation(combinedData);
      setCurrentStep(ValuationStep.RESULTS);
    }
  };
  
  const handleReset = () => {
    resetValuation();
    setVehicleInfo(null);
    setCurrentStep(ValuationStep.LOOKUP);
  };
  
  const handleBack = () => {
    if (currentStep === ValuationStep.DETAILS) {
      setCurrentStep(ValuationStep.LOOKUP);
    } else if (currentStep === ValuationStep.RESULTS) {
      setCurrentStep(ValuationStep.DETAILS);
    }
  };
  
  return (
    <div className="space-y-6">
      {currentStep !== ValuationStep.LOOKUP && (
        <Button 
          variant="ghost" 
          className="flex items-center text-muted-foreground"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      )}
      
      {currentStep === ValuationStep.LOOKUP && (
        <VehicleLookupForm 
          onVehicleDecoded={handleVehicleDecoded}
          onContinue={handleContinueToDetails}
        />
      )}
      
      {currentStep === ValuationStep.DETAILS && vehicleInfo && (
        <ValuationDetailsForm 
          vehicleInfo={vehicleInfo}
          onSubmit={handleSubmitDetails}
          isLoading={isLoading}
        />
      )}
      
      {currentStep === ValuationStep.RESULTS && valuationData && (
        <ValuationResults 
          estimatedValue={valuationData.estimatedValue}
          confidenceScore={valuationData.confidenceScore}
          vehicleInfo={{
            make: valuationData.make,
            model: valuationData.model,
            year: valuationData.year,
            mileage: valuationData.mileage,
            condition: valuationData.condition
          }}
          onReset={handleReset}
        />
      )}
      
      {error && currentStep === ValuationStep.RESULTS && (
        <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
          <h3 className="font-medium text-destructive">Error</h3>
          <p className="text-sm mt-1">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={handleReset}
          >
            Start Over
          </Button>
        </div>
      )}
    </div>
  );
};

export default ValuationFlow;
