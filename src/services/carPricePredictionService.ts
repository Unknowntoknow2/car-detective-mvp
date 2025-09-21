
import { supabase } from '@/integrations/supabase/client';

export interface CarPricePredictionRequest {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition?: string;
  zipCode: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  bodyType?: string;
  vin?: string;
}

export interface CarPricePredictionResponse {
  estimatedValue: number;
  confidenceScore: number;
  conditionScore: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition?: string;
  vin?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  color?: string;
  valuationId?: string;
}

export async function getCarPricePrediction(
  request: CarPricePredictionRequest
): Promise<CarPricePredictionResponse> {
  try {
    
    const { data, error } = await supabase.functions.invoke('car-price-prediction', {
      body: {
        make: request.make,
        model: request.model,
        year: request.year,
        mileage: request.mileage,
        condition: request.condition || 'good',
        zipCode: request.zipCode,
        fuelType: request.fuelType,
        transmission: request.transmission,
        color: request.color,
        bodyType: request.bodyType,
        vin: request.vin
      }
    });

    if (error) {
      console.error('Car price prediction error:', error);
      throw new Error(error.message || 'Failed to get price prediction');
    }

    if (!data) {
      throw new Error('No data returned from price prediction service');
    }


    return {
      estimatedValue: data.estimatedValue || 0,
      confidenceScore: data.confidenceScore || 0,
      conditionScore: data.conditionScore || 0,
      make: data.make || request.make,
      model: data.model || request.model,
      year: data.year || request.year,
      mileage: data.mileage || request.mileage,
      condition: data.condition || request.condition,
      vin: data.vin || request.vin,
      fuelType: data.fuelType || request.fuelType,
      transmission: data.transmission || request.transmission,
      bodyType: data.bodyType || request.bodyType,
      color: data.color || request.color,
      valuationId: data.id || data.valuationId
    };
  } catch (error) {
    console.error('Error calling car price prediction:', error);
    throw error;
  }
}
