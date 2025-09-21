
import { Vehicle } from "@/types/vehicle";
import { getStatvinData } from './sources/statvin';

export async function getEnrichedVehicleData(vin: string): Promise<Vehicle | null> {
  try {
    const statvinData = await getStatvinData(vin);
    
    // Mock enriched data
    return {
      id: vin,
      vin,
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      mileage: 50000,
      condition: 'good'
    };
  } catch (error) {
    return null;
  }
}
