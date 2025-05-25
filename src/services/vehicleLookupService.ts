
import { supabase } from '@/integrations/supabase/client';
import { getCarPricePrediction } from '@/services/carPricePredictionService';
import { DecodedVehicleInfo } from '@/types/vehicle';

export async function fetchVehicleByVin(vin: string): Promise<DecodedVehicleInfo> {
  try {
    // First check if we already have a valuation for this VIN
    const { data: existingValuation } = await supabase
      .from('valuations')
      .select('*')
      .eq('vin', vin)
      .maybeSingle();

    if (existingValuation) {
      // Return existing valuation data
      return {
        vin: existingValuation.vin,
        make: existingValuation.make,
        model: existingValuation.model,
        year: existingValuation.year,
        bodyType: existingValuation.body_type || existingValuation.bodyType,
        fuelType: existingValuation.fuel_type || existingValuation.fuelType,
        transmission: existingValuation.transmission,
        color: existingValuation.color,
        estimatedValue: existingValuation.estimated_value || existingValuation.estimatedValue,
        confidenceScore: existingValuation.confidence_score || existingValuation.confidenceScore,
        valuationId: existingValuation.id
      };
    }

    // If no existing valuation, create a new one
    // Mock VIN decoding (in production, this would use a real VIN decoder API)
    const mockDecoded = {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      bodyType: 'Sedan',
      color: 'Silver'
    };

    // Get real valuation from pricing API
    const prediction = await getCarPricePrediction({
      make: mockDecoded.make,
      model: mockDecoded.model,
      year: mockDecoded.year,
      mileage: 45000,
      condition: 'good',
      zipCode: '90210',
      fuelType: mockDecoded.fuelType,
      transmission: mockDecoded.transmission,
      color: mockDecoded.color,
      bodyType: mockDecoded.bodyType,
      vin: vin
    });

    // Store the new valuation in Supabase
    const { data: newValuation, error } = await supabase
      .from('valuations')
      .insert({
        vin: vin,
        make: prediction.make,
        model: prediction.model,
        year: prediction.year,
        mileage: prediction.mileage,
        condition: prediction.condition,
        estimated_value: prediction.estimatedValue,
        confidence_score: prediction.confidenceScore,
        body_type: prediction.bodyType,
        fuel_type: prediction.fuelType,
        transmission: prediction.transmission,
        color: prediction.color,
        user_id: (await supabase.auth.getUser()).data.user?.id || '00000000-0000-0000-0000-000000000000'
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing valuation:', error);
      // Continue with the prediction data even if storage fails
    }

    return {
      vin: vin,
      make: prediction.make,
      model: prediction.model,
      year: prediction.year,
      trim: 'SE',
      engine: '2.5L I4',
      transmission: prediction.transmission,
      drivetrain: 'FWD',
      bodyType: prediction.bodyType,
      fuelType: prediction.fuelType,
      exteriorColor: prediction.color,
      features: ['Bluetooth', 'Backup Camera', 'Alloy Wheels'],
      estimatedValue: prediction.estimatedValue,
      confidenceScore: prediction.confidenceScore,
      valuationId: newValuation?.id || `vin-${Date.now()}`
    };

  } catch (error) {
    console.error('Error in fetchVehicleByVin:', error);
    throw new Error('Failed to fetch vehicle information');
  }
}
