
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  IdentifierType, 
  Stage,
  Vehicle, 
  RequiredInputs, 
  ValuationResult,
  ValuationPipeline
} from './types';
import { decodeVehicle, generateValuation } from './service';

export function useValuationPipeline(): ValuationPipeline {
  const [stage, setStage] = useState<Stage>('initial');
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [requiredInputs, setRequiredInputs] = useState<RequiredInputs | null>(null);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset the pipeline
  const reset = () => {
    setStage('initial');
    setVehicle(null);
    setRequiredInputs(null);
    setValuationResult(null);
    setError(null);
  };

  // Step 1: Run lookup by VIN or plate
  const runLookup = async (type: IdentifierType, identifier: string, state?: string) => {
    setStage('lookup_in_progress');
    setError(null);
    
    const { vehicle: vehicleData, error: lookupError } = await decodeVehicle(type, identifier, state);
    
    if (lookupError) {
      setStage('lookup_failed');
      setError(lookupError);
      toast.error(lookupError);
      return false;
    }
    
    setVehicle(vehicleData);
    
    // Move to next stage - we need additional details from the user
    setStage('details_required');
    
    // Pre-fill available data for the required inputs
    setRequiredInputs({
      mileage: null,
      fuelType: vehicleData.fuelType || null,
      zipCode: '',
      condition: 3, // Default to "Good" condition
      conditionLabel: 'Good',
      hasAccident: false,
      accidentDescription: ''
    });
    
    toast.success(`Vehicle found: ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`);
    
    return true;
  };

  // Step 2: Submit valuation with all required inputs
  const submitValuation = async (details: Partial<RequiredInputs>) => {
    if (!vehicle) {
      setError('No vehicle data available');
      return false;
    }
    
    setStage('valuation_in_progress');
    setError(null);
    
    const { result, error: valuationError } = await generateValuation(vehicle, details);
    
    if (valuationError) {
      setStage('valuation_failed');
      setError(valuationError);
      toast.error(valuationError);
      return false;
    }
    
    if (result) {
      setValuationResult(result);
      setStage('valuation_complete');
      toast.success('Vehicle valuation complete!');
      return true;
    }
    
    return false;
  };

  return {
    stage,
    vehicle,
    requiredInputs,
    valuationResult,
    error,
    isLoading: stage === 'lookup_in_progress' || stage === 'valuation_in_progress',
    runLookup,
    submitValuation,
    reset
  };
}
