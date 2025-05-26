
import React, { useState } from 'react';
import { useValuation } from '@/hooks/useValuation';
import { VehicleLookupForm } from './VehicleLookupForm';
import { ValuationResults } from './ValuationResults';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Create a stub for the missing ValuationDetailsForm component
const ValuationDetailsForm: React.FC<{
  vehicleInfo: DecodedVehicleInfo;
  onSubmit: (details: any) => Promise<void>;
  isLoading: boolean;
}> = ({ vehicleInfo, onSubmit, isLoading }) => (
  <div className="p-6 border rounded-lg">
    <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
    <p className="mb-4">Please confirm or update the following details:</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <p className="text-sm text-gray-500">Make</p>
        <p className="font-medium">{vehicleInfo.make}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Model</p>
        <p className="font-medium">{vehicleInfo.model}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Year</p>
        <p className="font-medium">{vehicleInfo.year}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Trim</p>
        <p className="font-medium">{vehicleInfo.trim || 'Standard'}</p>
      </div>
    </div>
    <Button 
      onClick={() => onSubmit({ mileage: 10000, condition: 'Good' })}
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : 'Submit Details'}
    </Button>
  </div>
);

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
  
  const handleVehicleFound = (data: DecodedVehicleInfo) => {
    setVehicleInfo(data);
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
          onVehicleFound={handleVehicleFound}
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
          confidenceScore={valuationData.confidenceScore || 0}
          vehicleInfo={{
            make: valuationData.make,
            model: valuationData.model,
            year: valuationData.year,
            mileage: valuationData.mileage || 0,
            condition: valuationData.condition
          }}
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
