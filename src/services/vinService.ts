
import { DecodedVehicleInfo } from '@/types/vehicle';

export interface VinDecodeResponse {
  success: boolean;
  data?: DecodedVehicleInfo;
  error?: string;
}

export const decodeVin = async (vin: string): Promise<VinDecodeResponse> => {
  try {
    console.log('VIN Service: Decoding VIN:', vin);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful response
    const mockData: DecodedVehicleInfo = {
      vin,
      year: 2019,
      make: 'Toyota',
      model: 'Prius',
      trim: 'LE',
      engine: '1.8L Hybrid',
      transmission: 'CVT',
      bodyType: 'Hatchback',
      fuelType: 'Hybrid',
      drivetrain: 'FWD',
      exteriorColor: 'Silver',
      estimatedValue: 18500,
      confidenceScore: 85,
      mileage: 45000,
      condition: 'Good'
    };
    
    console.log('VIN Service: Success:', mockData);
    
    return {
      success: true,
      data: mockData
    };
  } catch (error) {
    console.error('VIN Service: Error:', error);
    return {
      success: false,
      error: 'Failed to decode VIN'
    };
  }
};
