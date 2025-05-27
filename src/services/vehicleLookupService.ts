import { DecodedVehicleInfo } from '@/types/vehicle';

export async function fetchVehicleByVin(vin: string): Promise<DecodedVehicleInfo> {
  // Mock implementation for now - replace with actual API call
  console.log('Fetching vehicle data for VIN:', vin);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Enhanced mock vehicle data with more realistic information and photos
  const mockVehicle: DecodedVehicleInfo = {
    vin,
    year: 2021,
    make: 'Toyota',
    model: 'Corolla',
    trim: 'LE',
    engine: '2.0L 4-Cylinder DOHC',
    transmission: 'CVT Automatic',
    bodyType: 'Sedan',
    fuelType: 'Gasoline',
    drivetrain: 'FWD',
    exteriorColor: 'Celestite Gray Metallic',
    interiorColor: 'Black Fabric',
    doors: '4',
    seats: '5',
    displacement: '2.0L',
    estimatedValue: 18500,
    confidenceScore: 85,
    mileage: 35000,
    condition: 'Good',
    // Add sample vehicle photos
    photos: [
      'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop'
    ],
    primaryPhoto: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop'
  };
  
  return mockVehicle;
}

export async function fetchVehicleByPlate(plate: string, state: string): Promise<DecodedVehicleInfo> {
  console.log('Fetching vehicle data for plate:', plate, 'state:', state);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Enhanced mock vehicle data
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
    estimatedValue: 21000,
    confidenceScore: 80,
    mileage: 52000,
    condition: 'Good',
    photos: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop'
    ],
    primaryPhoto: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop'
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
