
import { DecodedVehicleInfo } from '@/types/vehicle';

export async function fetchVehicleByVin(vin: string): Promise<DecodedVehicleInfo> {
  // Mock implementation for now - replace with actual API call
  console.log('Fetching vehicle data for VIN:', vin);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock vehicle data based on VIN pattern
  const mockVehicle: DecodedVehicleInfo = {
    vin,
    year: 2020,
    make: 'Toyota',
    model: 'Camry',
    trim: 'LE',
    engine: '2.5L 4-Cylinder',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    fuelType: 'Gasoline',
    drivetrain: 'FWD',
    exteriorColor: 'Silver',
    estimatedValue: 22500,
    confidenceScore: 85,
    mileage: 42000,
    condition: 'Good'
  };
  
  return mockVehicle;
}

export async function fetchVehicleByPlate(plate: string, state: string): Promise<DecodedVehicleInfo> {
  console.log('Fetching vehicle data for plate:', plate, 'state:', state);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Mock vehicle data
  const mockVehicle: DecodedVehicleInfo = {
    plate,
    state,
    year: 2019,
    make: 'Honda',
    model: 'Accord',
    trim: 'Sport',
    engine: '1.5L Turbo',
    transmission: 'CVT',
    bodyType: 'Sedan',
    fuelType: 'Gasoline',
    drivetrain: 'FWD',
    exteriorColor: 'Blue',
    estimatedValue: 21000,
    confidenceScore: 80,
    mileage: 52000,
    condition: 'Good'
  };
  
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
