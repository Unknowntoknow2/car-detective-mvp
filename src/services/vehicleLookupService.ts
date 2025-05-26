
import { supabase } from '@/integrations/supabase/client';
import { getCarPricePrediction } from '@/services/carPricePredictionService';
import { DecodedVehicleInfo } from '@/types/vehicle';

export async function fetchVehicleByVin(vin: string): Promise<DecodedVehicleInfo> {
  try {
    console.log('fetchVehicleByVin called with VIN:', vin);

    // First check if we already have a valuation for this VIN
    try {
      const { data: existingValuation } = await supabase
        .from('valuations')
        .select('*')
        .eq('vin', vin)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingValuation) {
        console.log('Found existing valuation:', existingValuation.id);
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
    } catch (dbError) {
      console.log('Database lookup failed, proceeding with new valuation:', dbError);
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

    console.log('Creating new valuation for VIN:', vin);

    // Get real valuation from pricing API
    const prediction = await getCarPricePrediction({
      make: mockDecoded.make,
      model: mockDecoded.model,
      year: mockDecoded.year,
      mileage: 45000,
      zipCode: '90210',
      fuelType: mockDecoded.fuelType,
      transmission: mockDecoded.transmission,
      color: mockDecoded.color,
      bodyType: mockDecoded.bodyType,
      vin: vin
    });

    console.log('Got prediction from API:', prediction);

    // Return the result
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
      valuationId: prediction.valuationId || `vin-${Date.now()}`
    };

  } catch (error) {
    console.error('Error in fetchVehicleByVin:', error);
    throw new Error('Failed to fetch vehicle information');
  }
}

export async function fetchVehicleByPlate(plate: string, state: string): Promise<DecodedVehicleInfo> {
  try {
    // Mock plate decoding (in production, this would use a real plate lookup API)
    const mockDecoded = {
      make: 'Honda',
      model: 'Accord',
      year: 2019,
      fuelType: 'Gasoline',
      transmission: 'CVT',
      bodyType: 'Sedan',
      color: 'Blue'
    };

    // Get real valuation from pricing API
    const prediction = await getCarPricePrediction({
      make: mockDecoded.make,
      model: mockDecoded.model,
      year: mockDecoded.year,
      mileage: 52000,
      condition: 'good',
      zipCode: '90210',
      fuelType: mockDecoded.fuelType,
      transmission: mockDecoded.transmission,
      color: mockDecoded.color,
      bodyType: mockDecoded.bodyType
    });

    return {
      vin: `PLATE-${plate}-${state}`,
      make: prediction.make,
      model: prediction.model,
      year: prediction.year,
      trim: 'EX',
      engine: '1.5L Turbo',
      transmission: prediction.transmission,
      drivetrain: 'FWD',
      bodyType: prediction.bodyType,
      fuelType: prediction.fuelType,
      exteriorColor: prediction.color,
      features: ['Sunroof', 'Lane Assist', 'Heated Seats'],
      estimatedValue: prediction.estimatedValue,
      confidenceScore: prediction.confidenceScore,
      valuationId: `plate-${Date.now()}`
    };
  } catch (error) {
    console.error('Error in fetchVehicleByPlate:', error);
    throw new Error('Failed to fetch vehicle information by plate');
  }
}

export async function fetchTrimOptions(make: string, model: string, year: number): Promise<string[]> {
  try {
    // Query the model_trims table for available trims
    const { data, error } = await supabase
      .from('model_trims')
      .select('trim_name')
      .eq('year', year)
      .ilike('model_name', `%${model}%`)
      .order('trim_name');

    if (error) {
      console.error('Error fetching trim options:', error);
      // Return default options if query fails
      return ['Standard', 'Deluxe', 'Premium', 'Sport'];
    }

    if (data && data.length > 0) {
      const trims = data.map(item => item.trim_name).filter(Boolean);
      return trims.length > 0 ? trims : ['Standard'];
    }

    // Return default options based on make/model if no data found
    const defaultTrims = {
      'Toyota': ['LE', 'SE', 'XLE', 'Limited'],
      'Honda': ['LX', 'EX', 'EX-L', 'Touring'],
      'Ford': ['S', 'SE', 'SEL', 'Titanium'],
      'Chevrolet': ['LS', 'LT', 'Premier'],
      'Nissan': ['S', 'SV', 'SL', 'Platinum']
    };

    return defaultTrims[make as keyof typeof defaultTrims] || ['Standard', 'Deluxe', 'Premium', 'Sport'];
  } catch (error) {
    console.error('Error in fetchTrimOptions:', error);
    return ['Standard', 'Deluxe', 'Premium', 'Sport'];
  }
}
