
export interface DecodedVehicleInfo {
  make: string;
  model: string;
  year: number;
  vin: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  bodyType?: string;
  exteriorColor?: string;
  fuelType?: string;
  features?: string[];
  condition?: string; 
  zipCode?: string; 
  mileage?: number;
  valuationId?: string;
  interiorColor?: string;
}

export interface DealerInventoryItem {
  id: string;
  dealerId: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  listingPrice: number;
  price: number;
  condition: string;
  mileage: number;
  status: 'available' | 'pending' | 'sold';
  trim?: string;
  exteriorColor?: string;
  interiorColor?: string;
  transmission?: string;
  drivetrain?: string;
  fuelType?: string;
  bodyType?: string;
  features?: string[];
  images?: string[];
  description?: string;
}
