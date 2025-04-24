
import { DecodedVehicleInfo } from '@/types/vehicle';
import { VinDecoderResponse } from '@/types/api';

export async function decodeVin(vin: string): Promise<DecodedVehicleInfo> {
  try {
    // For MVP we'll mock the API call
    // In the real implementation, this would call a Supabase Edge Function
    const response = await mockVinDecoder(vin);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (!response.data) {
      throw new Error('No data returned from VIN decoder');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error decoding VIN:', error);
    throw error;
  }
}

// Mock function for MVP (would be replaced with actual API call)
async function mockVinDecoder(vin: string): Promise<VinDecoderResponse> {
  // Basic VIN validation
  if (!vin || vin.length !== 17 || !/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
    return { error: 'Invalid VIN format. VIN must be 17 characters and contain only alphanumeric characters (excluding I, O, Q).' };
  }
  
  // Mock delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Different mock responses based on first character of VIN
  const firstChar = vin.charAt(0).toUpperCase();
  
  // Sample data
  if (firstChar === '1') {
    return {
      data: {
        vin,
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        trim: 'SE',
        engine: '2.5L I4',
        transmission: 'Automatic',
        drivetrain: 'FWD',
        bodyType: 'Sedan'
      }
    };
  } else if (firstChar === '2') {
    return {
      data: {
        vin,
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        trim: 'Sport',
        engine: '1.5L I4 Turbo',
        transmission: 'CVT',
        drivetrain: 'FWD',
        bodyType: 'Sedan'
      }
    };
  } else if (firstChar === '3') {
    return {
      data: {
        vin,
        make: 'Ford',
        model: 'F-150',
        year: 2019,
        trim: 'XLT',
        engine: '5.0L V8',
        transmission: 'Automatic',
        drivetrain: '4WD',
        bodyType: 'Pickup'
      }
    };
  } else if (firstChar === '4') {
    return {
      data: {
        vin,
        make: 'Chevrolet',
        model: 'Equinox',
        year: 2022,
        trim: 'LT',
        engine: '1.5L I4 Turbo',
        transmission: 'Automatic',
        drivetrain: 'AWD',
        bodyType: 'SUV'
      }
    };
  } else if (firstChar === '5') {
    return {
      data: {
        vin,
        make: 'BMW',
        model: '3 Series',
        year: 2020,
        trim: '330i',
        engine: '2.0L I4 Turbo',
        transmission: 'Automatic',
        drivetrain: 'RWD',
        bodyType: 'Sedan'
      }
    };
  } else {
    return {
      data: {
        vin,
        make: 'Nissan',
        model: 'Altima',
        year: 2018,
        trim: 'SV',
        engine: '2.5L I4',
        transmission: 'CVT',
        drivetrain: 'FWD',
        bodyType: 'Sedan'
      }
    };
  }
}
