
import { supabase } from '@/integrations/supabase/client';

export interface CarPricePredictionParams {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  bodyType?: string;
  vin?: string;
  accident?: string;
  accidentDetails?: {
    count: string;
    severity: string;
    area?: string;
  };
}

export interface CarPricePredictionResult {
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  color: string;
  valuationFactors?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
}

export const getCarPricePrediction = async (params: CarPricePredictionParams): Promise<CarPricePredictionResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('car-price-prediction', {
      body: params
    });
    
    if (error) {
      throw new Error(`Price prediction failed: ${error.message}`);
    }
    
    if (!data || !data.estimatedValue) {
      throw new Error('Invalid response from price prediction service');
    }
    
    return {
      estimatedValue: data.estimatedValue,
      confidenceScore: data.confidenceScore || 85,
      priceRange: data.priceRange || [
        Math.round(data.estimatedValue * 0.9),
        Math.round(data.estimatedValue * 1.1)
      ],
      make: params.make,
      model: params.model,
      year: params.year,
      mileage: params.mileage,
      fuelType: params.fuelType || 'Gasoline',
      transmission: params.transmission || 'Automatic',
      bodyType: params.bodyType || 'Sedan',
      color: params.color || 'Unknown',
      valuationFactors: data.valuationFactors || []
    };
  } catch (error) {
    console.error('Car price prediction error:', error);
    throw error;
  }
};
