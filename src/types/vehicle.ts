
export interface Vehicle {
  id?: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  drivetrain?: string;
  engine?: string;
  style?: string;
  features?: string[];
  photos?: string[];
  accidents?: boolean;
  serviceHistory?: any[];
  titleStatus?: string;
  zipCode?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface DecodedVehicleInfo {
  vin?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  bodyType?: string;
  bodyStyle?: string;
  fuelType?: string;
  engineCylinders?: string;
  displacementL?: string;
  displacement?: string;
  seats?: string;
  doors?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  mileage?: number;
  condition?: string;
  exteriorColor?: string;
  interiorColor?: string;
  color?: string;
  plate?: string;
  state?: string;
  photos?: string[];
  primaryPhoto?: string;
  zipCode?: string;
}

export interface VehicleTrim {
  id: string;
  trim_name: string;
  model_id?: string;
  year?: number;
  msrp?: number;
  engine_type?: string;
  transmission?: string;
  fuel_type?: string;
}

export interface VehicleDetails extends Vehicle {
  specifications?: {
    doors?: number;
    seats?: number;
    cylinders?: number;
    displacement?: string;
    horsepower?: number;
    torque?: number;
    fuelEconomy?: {
      city?: number;
      highway?: number;
      combined?: number;
    };
  };
  marketData?: {
    averagePrice?: number;
    priceRange?: {
      min: number;
      max: number;
    };
    daysOnMarket?: number;
    listingCount?: number;
  };
}

export interface VehicleLookupResult {
  vehicle: Vehicle;
  confidence: number;
  sources: string[];
  errors?: string[];
}

export interface VehicleConditionFactor {
  id: string;
  name: string;
  value: number;
  impact: number;
  description?: string;
}

export interface VehicleValuation {
  vehicle: Vehicle;
  estimatedValue: number;
  priceRange: {
    min: number;
    max: number;
  };
  confidence: number;
  factors: VehicleConditionFactor[];
  marketData?: {
    comparable: Vehicle[];
    trends?: any;
  };
  timestamp: string;
}
