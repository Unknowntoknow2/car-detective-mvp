
import { useState } from 'react';
import { toast } from 'sonner';
import { useVehicleLookup } from './useVehicleLookup';

type IdentifierType = 'vin' | 'plate';
type ValuationStage = 'initial' | 'lookup' | 'details_required' | 'valuation_pending' | 'valuation_complete' | 'error';

interface ValuationDetails {
  mileage: number | null;
  fuelType: string | null;
  zipCode: string;
  condition: number;
  conditionLabel: string;
  hasAccident: boolean | null;
  accidentDescription: string;
}

interface ValuationResult {
  estimated_value: number;
  confidence_score: number;
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  price_range?: [number, number];
  base_price?: number;
  zip_demand_factor?: number;
  feature_value_total?: number;
}

export function useFullValuationPipeline() {
  const [stage, setStage] = useState<ValuationStage>('initial');
  const [requiredInputs, setRequiredInputs] = useState<ValuationDetails | null>(null);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [valuationId, setValuationId] = useState<string | null>(null);
  
  const { lookupVehicle, vehicle, isLoading, error, errorDetails } = useVehicleLookup();

  const runLookup = async (identifierType: IdentifierType, identifier: string, state?: string) => {
    try {
      setStage('lookup');
      
      let lookupResult;
      if (identifierType === 'vin') {
        lookupResult = await lookupVehicle('vin', identifier);
      } else if (identifierType === 'plate') {
        if (!state) {
          throw new Error('State is required for plate lookup');
        }
        lookupResult = await lookupVehicle('plate', identifier, state);
      }
      
      if (!lookupResult) {
        throw new Error('Vehicle lookup failed');
      }

      // Set required inputs with default values
      setRequiredInputs({
        mileage: null,
        fuelType: null,
        zipCode: '',
        condition: 3, // Default to "Good" condition (scale 1-5)
        conditionLabel: 'Good',
        hasAccident: null,
        accidentDescription: '',
      });
      
      setStage('details_required');
      return true;
    } catch (err: any) {
      console.error('Lookup error:', err);
      setStage('error');
      return false;
    }
  };

  const submitValuation = async (details: ValuationDetails) => {
    if (!vehicle) {
      toast.error('No vehicle data available');
      return false;
    }

    try {
      setStage('valuation_pending');
      
      // Prepare the payload for the car-price-prediction function
      const payload = {
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        mileage: details.mileage,
        condition: details.conditionLabel.toLowerCase(),
        fuelType: details.fuelType,
        zipCode: details.zipCode,
        accident: details.hasAccident ? "yes" : "no",
        accidentDetails: details.hasAccident ? {
          count: "1",
          severity: details.accidentDescription.toLowerCase().includes('major') ? "major" : "minor",
          area: "body",
        } : undefined,
        includeCarfax: true
      };
      
      console.log('Submitting valuation with payload:', payload);
      
      // Call the car-price-prediction edge function
      const response = await fetch(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/car-price-prediction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYxMjYsImV4cCI6MjA2MTAzMjEyNn0.kUPmsyUdpcpnPLHWlnP7vODQiRgzCrWjOBfLib3lpvY'}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Valuation failed');
      }
      
      const result = await response.json();
      
      // Set the result and valuationId
      setValuationResult(result);
      setValuationId(result.id);
      setStage('valuation_complete');
      
      toast.success('Valuation completed successfully!');
      return true;
    } catch (err: any) {
      console.error('Valuation error:', err);
      toast.error(err.message || 'Failed to calculate vehicle value');
      setStage('error');
      return false;
    }
  };

  const reset = () => {
    setStage('initial');
    setRequiredInputs(null);
    setValuationResult(null);
    setValuationId(null);
  };

  return {
    stage,
    vehicle,
    requiredInputs,
    valuationResult,
    valuationId,
    isLoading,
    error,
    errorDetails,
    runLookup,
    submitValuation,
    reset
  };
}
