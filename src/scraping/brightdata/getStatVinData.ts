
import { supabase } from '@/integrations/supabase/client';

export interface StatVinData {
  vin: string;
  salePrice?: string;
  damage?: string;
  status?: string;
  auctionDate?: string;
  location?: string;
  images: string[];
  make?: string;
  model?: string;
  year?: string;
  mileage?: string;
  bodyType?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
  drivetrain?: string;
  exteriorColor?: string;
  interiorColor?: string;
  keys?: number;
  seller?: string;
  lot?: string;
  estimatedRepairCost?: string;
  estimatedRetailValue?: string;
  condition?: string;
  titleType?: string;
  primaryDamage?: string;
  secondaryDamage?: string;
  saleType?: string;
  runAndDrive?: boolean;
}

export async function getStatVinData(vin: string): Promise<StatVinData | null> {
  try {
    // Call the Supabase Edge Function for STAT.vin data
    const { data, error } = await supabase.functions.invoke('fetch-statvin-data', {
      body: { vin: vin.toUpperCase() }
    });

    if (error) {
      return null;
    }

    if (!data || data.error) {
      return null;
    }
    // Transform the response to our interface
    const statVinData: StatVinData = {
      vin: data.vin || vin,
      salePrice: data.salePrice || data.sale_price,
      damage: data.damage || data.primary_damage,
      status: data.status || data.title_status,
      auctionDate: data.auctionDate || data.auction_date || data.sale_date,
      location: data.location || data.sale_location,
      images: data.images || data.photos || [],
      make: data.make,
      model: data.model,
      year: data.year,
      mileage: data.mileage || data.odometer,
      bodyType: data.bodyType || data.body_type,
      engine: data.engine,
      transmission: data.transmission,
      fuelType: data.fuelType || data.fuel_type,
      drivetrain: data.drivetrain,
      exteriorColor: data.exteriorColor || data.exterior_color,
      interiorColor: data.interiorColor || data.interior_color,
      keys: data.keys,
      seller: data.seller,
      lot: data.lot,
      estimatedRepairCost: data.estimatedRepairCost || data.estimated_repair_cost,
      estimatedRetailValue: data.estimatedRetailValue || data.estimated_retail_value,
      condition: data.condition,
      titleType: data.titleType || data.title_type,
      primaryDamage: data.primaryDamage || data.primary_damage,
      secondaryDamage: data.secondaryDamage || data.secondary_damage,
      saleType: data.saleType || data.sale_type,
      runAndDrive: data.runAndDrive || data.run_and_drive
    };

    return statVinData;
  } catch (error) {
    return null;
  }
}
