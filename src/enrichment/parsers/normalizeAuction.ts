
import { StatVinData } from '../types';

export interface NormalizedAuctionData {
  source: string;
  vin: string;
  salePrice?: number;
  estimatedValue?: number;
  condition: string;
  damageType?: string;
  titleStatus?: string;
  saleDate?: string;
  location?: string;
  images: string[];
  vehicleInfo: {
    make?: string;
    model?: string;
    year?: number;
    mileage?: number;
    bodyType?: string;
    engine?: string;
    transmission?: string;
    fuelType?: string;
    exteriorColor?: string;
    interiorColor?: string;
  };
}

export function normalizeStatVinData(data: StatVinData): NormalizedAuctionData {
  return {
    source: 'STAT.vin',
    vin: data.vin,
    salePrice: data.salePrice ? parseFloat(data.salePrice.replace(/[^0-9.]/g, '')) : undefined,
    estimatedValue: data.estimatedRetailValue ? parseFloat(data.estimatedRetailValue.replace(/[^0-9.]/g, '')) : undefined,
    condition: data.condition || 'Unknown',
    damageType: data.damage || data.primaryDamage,
    titleStatus: data.status || data.titleType,
    saleDate: data.auctionDate,
    location: data.location,
    images: data.images || [],
    vehicleInfo: {
      make: data.make,
      model: data.model,
      year: data.year ? parseInt(data.year) : undefined,
      mileage: data.mileage ? parseInt(data.mileage.replace(/[^0-9]/g, '')) : undefined,
      bodyType: data.bodyType,
      engine: data.engine,
      transmission: data.transmission,
      fuelType: data.fuelType,
      exteriorColor: data.exteriorColor,
      interiorColor: data.interiorColor,
    }
  };
}

export function normalizeAuctionData(data: any, source: string): NormalizedAuctionData {
  // This can be extended to normalize data from different auction sources
  switch (source) {
    case 'statvin':
      return normalizeStatVinData(data);
    default:
      throw new Error(`Unknown auction source: ${source}`);
  }
}
