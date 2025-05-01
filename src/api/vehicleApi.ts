
// src/api/vehicleApi.ts

import { ApiErrorType } from '@/utils/api-utils';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_VEHICLE_API_URL || 'http://localhost:3000/api';

interface VehicleDetails {
  year: number;
  make: string;
  model: string;
  trim?: string;
  bodyType?: string;
  transmission?: string;
  engine?: string;
  fuelType?: string;
  driveType?: string;
}

export async function fetchVehicleDetails(vin: string): Promise<VehicleDetails | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicle-details?vin=${vin}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch vehicle details: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as VehicleDetails;
  } catch (error: any) {
    console.error("Error fetching vehicle details:", error);
    toast.error(error.message || "Failed to fetch vehicle details");
    return null;
  }
}

export async function fetchAverageMarketValue(year: number, make: string, model: string, zip?: string): Promise<number> {
  try {
    const yearAsNumber = typeof year === 'string' ? parseInt(year, 10) : year;
    const url = new URL(`${API_BASE_URL}/market-value`);
    url.searchParams.append('year', String(yearAsNumber));
    url.searchParams.append('make', make);
    url.searchParams.append('model', model);
    if (zip) {
      url.searchParams.append('zip', zip);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      if (response.status === 404) {
        return 0;
      }
      throw new Error(`Failed to fetch average market value: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.averageValue as number;
  } catch (error) {
    console.error("Error fetching average market value:", error);
    return 0;
  }
}

export async function fetchFuelEfficiency(year: number, make: string, model: string): Promise<number | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/fuel-efficiency?year=${year}&make=${make}&model=${model}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch fuel efficiency: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.mpg as number;
  } catch (error: any) {
    console.error("Error fetching fuel efficiency:", error);
    toast.error(error.message || "Failed to fetch fuel efficiency");
    return null;
  }
}

export async function fetchSafetyRatings(year: number, make: string, model: string): Promise<any | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/safety-ratings?year=${year}&make=${make}&model=${model}`);

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Failed to fetch safety ratings: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error("Error fetching safety ratings:", error);
        toast.error(error.message || "Failed to fetch safety ratings");
        return null;
    }
}

export async function fetchRecalls(year: number, make: string, model: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/recalls?year=${year}&make=${make}&model=${model}`);

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed to fetch recalls: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as any[];
  } catch (error: any) {
    console.error("Error fetching recalls:", error);
    toast.error(error.message || "Failed to fetch recalls");
    return [];
  }
}
