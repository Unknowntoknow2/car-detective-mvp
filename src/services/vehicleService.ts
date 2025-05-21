
/**
 * Mock vehicle service for VIN lookup
 */

export interface DecodedVehicleInfo {
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  trim?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
  driveTrain?: string;
  exteriorColor?: string;
  interiorColor?: string;
  zipCode?: string;
}

export async function decodeVin(vin: string): Promise<DecodedVehicleInfo> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock response based on VIN pattern
  if (vin.startsWith('1')) {
    return {
      vin: vin,
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      trim: 'SE',
      engine: '2.5L I4',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      bodyType: 'Sedan',
      driveTrain: 'FWD',
      exteriorColor: 'Silver',
      interiorColor: 'Black'
    };
  } else if (vin.startsWith('2')) {
    return {
      vin: vin,
      make: 'Honda',
      model: 'Accord',
      year: 2019,
      trim: 'EX',
      engine: '1.5L I4 Turbo',
      transmission: 'CVT',
      fuelType: 'Gasoline',
      bodyType: 'Sedan',
      driveTrain: 'FWD',
      exteriorColor: 'White',
      interiorColor: 'Tan'
    };
  } else if (vin.startsWith('3')) {
    return {
      vin: vin,
      make: 'Ford',
      model: 'F-150',
      year: 2021,
      trim: 'XLT',
      engine: '3.5L V6 EcoBoost',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      bodyType: 'Pickup',
      driveTrain: '4WD',
      exteriorColor: 'Blue',
      interiorColor: 'Gray'
    };
  }
  
  // Default mock response
  return {
    vin: vin,
    make: 'Unknown',
    model: 'Unknown',
    year: new Date().getFullYear() - 5,
    trim: 'Base',
    engine: 'Unknown',
    transmission: 'Unknown',
    fuelType: 'Unknown',
    bodyType: 'Unknown',
    driveTrain: 'Unknown',
    exteriorColor: 'Unknown',
    interiorColor: 'Unknown'
  };
}

export async function decodeLicensePlate(
  plate: string, 
  state: string
): Promise<DecodedVehicleInfo> {
  // Similar mock implementation as decodeVin
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    vin: `MOCK${plate}${state}123456`,
    make: 'Ford',
    model: 'Explorer',
    year: 2018,
    trim: 'Limited',
    engine: '3.5L V6',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    bodyType: 'SUV',
    driveTrain: 'AWD',
    exteriorColor: 'Black',
    interiorColor: 'Beige'
  };
}
