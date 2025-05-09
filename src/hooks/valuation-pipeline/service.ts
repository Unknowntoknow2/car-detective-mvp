
import { IdentifierType, RequiredInputs, Stage, ValuationPipelineState, ValuationResult, Vehicle } from './types';
import { supabase } from '@/integrations/supabase/client';

export async function lookupVehicle(
  type: IdentifierType,
  identifier: string,
  state?: string,
  manualData?: { make: string; model: string; year: number; trim?: string; fuelType?: string; bodyType?: string; }
): Promise<ValuationPipelineState> {
  try {
    // Set the initial state to lookup in progress
    const initialState: ValuationPipelineState = {
      stage: 'lookup_in_progress',
      vehicle: null,
      requiredInputs: null,
      valuationResult: null,
      error: null,
      isLoading: true
    };

    // Handle manual entry for vehicles not in database
    if (type === 'manual' && manualData) {
      const vehicle: Vehicle = {
        make: manualData.make,
        model: manualData.model,
        year: manualData.year,
        trim: manualData.trim || '',
        fuelType: manualData.fuelType || '',
        bodyType: manualData.bodyType || ''
      };

      // Prepare required inputs
      const requiredInputs: RequiredInputs = {
        mileage: null,
        fuelType: null,
        zipCode: '',
        condition: 4, // Default to good condition
        conditionLabel: 'Good'
      };

      return {
        ...initialState,
        stage: 'details_required',
        vehicle,
        requiredInputs,
        isLoading: false
      };
    }

    // Handle VIN lookup
    if (type === 'vin') {
      // Mock data for the VIN lookup, replace with actual API call
      const vehicle: Vehicle = {
        make: 'Toyota',
        model: 'Camry',
        year: 2019,
        trim: 'LE',
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        bodyType: 'Sedan'
      };

      // Prepare required inputs
      const requiredInputs: RequiredInputs = {
        mileage: null,
        fuelType: 'Gasoline',
        zipCode: '',
        condition: 4, // Default to good condition
        conditionLabel: 'Good'
      };

      return {
        ...initialState,
        stage: 'details_required',
        vehicle,
        requiredInputs,
        isLoading: false
      };
    }

    // Handle plate lookup
    if (type === 'plate' && state) {
      // Mock data for plate lookup, replace with actual API call
      const vehicle: Vehicle = {
        make: 'Honda',
        model: 'Accord',
        year: 2020,
        bodyType: 'Sedan'
      };

      // Prepare required inputs
      const requiredInputs: RequiredInputs = {
        mileage: null,
        fuelType: null,
        zipCode: '',
        condition: 4, // Default to good condition
        conditionLabel: 'Good'
      };

      return {
        ...initialState,
        stage: 'details_required',
        vehicle,
        requiredInputs,
        isLoading: false
      };
    }

    // Return error state if lookup type is not supported
    return {
      ...initialState,
      stage: 'lookup_failed',
      error: 'Unsupported lookup type',
      isLoading: false
    };
  } catch (error) {
    return {
      stage: 'lookup_failed',
      vehicle: null,
      requiredInputs: null,
      valuationResult: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred during vehicle lookup',
      isLoading: false
    };
  }
}

export async function submitValuationDetails(
  vehicle: Vehicle,
  details: Partial<RequiredInputs>
): Promise<ValuationPipelineState> {
  try {
    // Set the initial state to valuation in progress
    const initialState: ValuationPipelineState = {
      stage: 'valuation_in_progress',
      vehicle,
      requiredInputs: { ...details } as RequiredInputs,
      valuationResult: null,
      error: null,
      isLoading: true
    };

    // Mock valuation result, replace with actual API call
    const valuationResult: ValuationResult = {
      id: crypto.randomUUID(),
      estimated_value: 25000,
      confidence_score: 90,
      price_range: [23500, 26500],
      base_price: 24000,
      zip_demand_factor: 1.05,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      adjustments: [
        {
          factor: 'Mileage',
          impact: -500,
          description: 'Below average mileage'
        },
        {
          factor: 'Condition',
          impact: 1000,
          description: 'Good condition adds value'
        },
        {
          factor: 'Market Demand',
          impact: 500,
          description: 'High demand in your area'
        }
      ]
    };

    return {
      ...initialState,
      stage: 'valuation_complete',
      valuationResult,
      isLoading: false
    };
  } catch (error) {
    return {
      stage: 'valuation_failed',
      vehicle,
      requiredInputs: { ...details } as RequiredInputs,
      valuationResult: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred during valuation',
      isLoading: false
    };
  }
}
