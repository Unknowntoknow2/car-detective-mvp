import { DecodedVehicleInfo } from '@/types/vehicle';
import { supabase } from '@/integrations/supabase/client';

export async function fetchVehicleByVin(vin: string): Promise<DecodedVehicleInfo> {
  console.log('🔄 vehicleLookupService: Routing to real NHTSA API via unified-decode for VIN:', vin);
  
  try {
    // Call the unified-decode edge function for real NHTSA data
    const { data, error } = await supabase.functions.invoke('unified-decode', {
      body: { vin: vin.toUpperCase() }
    });

    if (error) {
      console.error('❌ vehicleLookupService: Edge function error:', error);
      throw new Error('Service temporarily unavailable. Please try again.');
    }

    if (data && data.success && data.decoded) {
      const decodedData = data.decoded;
      
      const vehicleInfo: DecodedVehicleInfo = {
        vin: decodedData.vin,
        year: decodedData.year,
        make: decodedData.make,
        model: decodedData.model,
        trim: decodedData.trim || 'Standard',
        engine: decodedData.engine || decodedData.engineCylinders,
        transmission: decodedData.transmission,
        bodyType: decodedData.bodyType,
        fuelType: decodedData.fuelType,
        drivetrain: decodedData.drivetrain,
        exteriorColor: 'Unknown',
        doors: decodedData.doors,
        seats: decodedData.seats,
        displacement: decodedData.displacementL,
        mileage: 0, // Default for new lookup
        condition: 'Good', // Default condition
        confidenceScore: 85,
        // Add sample photos for demo purposes
        photos: [
          'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop'
        ],
        primaryPhoto: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop'
      };

      console.log('✅ vehicleLookupService: Successfully decoded vehicle from NHTSA:', vehicleInfo);
      return vehicleInfo;
    } else {
      console.error('❌ vehicleLookupService: No data returned from edge function');
      throw new Error(data?.error || 'Unable to decode VIN');
    }
  } catch (error) {
    console.error('❌ vehicleLookupService: Exception occurred:', error);
    throw error instanceof Error ? error : new Error('VIN lookup failed');
  }
}

export async function fetchVehicleByPlate(plate: string, state: string): Promise<DecodedVehicleInfo> {
  console.log('🔄 vehicleLookupService: Plate lookup for:', plate, 'state:', state);
  
  // Simulate API delay for plate lookup (this is still mock as there's no real plate API)
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Enhanced mock vehicle data for plate lookup
  const mockVehicle: DecodedVehicleInfo = {
    plate,
    state,
    year: 2020,
    make: 'Honda',
    model: 'Accord',
    trim: 'Sport',
    engine: '1.5L Turbo 4-Cylinder',
    transmission: 'CVT',
    bodyType: 'Sedan',
    fuelType: 'Gasoline',
    drivetrain: 'FWD',
    exteriorColor: 'Still Night Pearl',
    interiorColor: 'Black Leather',
    doors: '4',
    seats: '5',
    displacement: '1.5L',
    mileage: 52000,
    condition: 'Good',
    confidenceScore: 80,
    photos: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop'
    ],
    primaryPhoto: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop'
  };
  
  console.log('✅ vehicleLookupService: Plate lookup completed (mock data):', mockVehicle);
  return mockVehicle;
}

export async function fetchTrimOptions(make: string, model: string, year: number): Promise<string[]> {
  console.log('Fetching trim options for:', make, model, year);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock trim options based on make/model
  const trimOptions: Record<string, string[]> = {
    'Toyota_Camry': ['L', 'LE', 'SE', 'XLE', 'XSE', 'TRD'],
    'Honda_Accord': ['LX', 'Sport', 'EX', 'EX-L', 'Touring'],
    'Ford_F-150': ['Regular Cab', 'SuperCab', 'SuperCrew', 'Raptor'],
    'Chevrolet_Silverado': ['Work Truck', 'Custom', 'LT', 'RST', 'LTZ', 'High Country']
  };
  
  const key = `${make}_${model}`;
  return trimOptions[key] || ['Base', 'Premium', 'Luxury'];
}
