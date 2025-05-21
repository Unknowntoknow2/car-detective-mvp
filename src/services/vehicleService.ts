
import { DecodedVehicleInfo } from '@/types/vehicle';

/**
 * Decode a VIN through an API service
 */
export async function decodeVin(vin: string): Promise<DecodedVehicleInfo> {
  console.log('Decoding VIN:', vin);
  
  // Mock implementation
  return {
    vin,
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    trim: 'LE',
    engine: '2.5L 4-Cylinder',
    transmission: 'Automatic',
    drivetrain: 'FWD',
    bodyType: 'Sedan',
    fuelType: 'Gasoline',
    doors: '4',
    color: 'Silver',
    isValid: true
  };
}

/**
 * Lookup vehicle details by license plate
 */
export async function decodePlate(plate: string, state: string): Promise<DecodedVehicleInfo> {
  console.log('Looking up plate:', plate, 'from state:', state);
  
  // Mock implementation
  return {
    vin: 'ABCDEFGH123456789',
    make: 'Honda',
    model: 'Accord',
    year: 2019,
    trim: 'Sport',
    engine: '1.5L Turbo',
    transmission: 'CVT',
    drivetrain: 'FWD',
    bodyType: 'Sedan',
    fuelType: 'Gasoline',
    doors: '4',
    color: 'Blue',
    isValid: true,
    plate,
    state
  };
}

/**
 * Get a list of makes for a dropdown
 */
export async function getVehicleMakes(): Promise<string[]> {
  // This would normally fetch from an API or database
  return [
    'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 
    'Dodge', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 
    'Jeep', 'Kia', 'Land Rover', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 
    'Mitsubishi', 'Nissan', 'Porsche', 'Ram', 'Subaru', 'Tesla', 'Toyota', 
    'Volkswagen', 'Volvo'
  ];
}

/**
 * Get models for a specific make for a dropdown
 */
export async function getVehicleModels(make: string): Promise<string[]> {
  console.log('Getting models for make:', make);
  
  // This would normally fetch from an API or database
  // Mock implementation with some common models
  const modelsByMake: Record<string, string[]> = {
    'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Prius'],
    'Honda': ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey', 'Fit'],
    'Ford': ['F-150', 'Escape', 'Explorer', 'Mustang', 'Edge', 'Fusion'],
    'Chevrolet': ['Silverado', 'Equinox', 'Malibu', 'Traverse', 'Tahoe', 'Suburban'],
    'Nissan': ['Altima', 'Rogue', 'Sentra', 'Pathfinder', 'Murano', 'Maxima']
  };
  
  return modelsByMake[make] || ['Model data not available'];
}
