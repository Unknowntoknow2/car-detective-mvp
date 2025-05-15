
// src/api/vehicleApi.ts

import { ApiErrorType } from '@/utils/api-utils';
import { toast } from 'sonner';
import { Make, Model } from '@/hooks/types/vehicle';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const insertManualEntryValuation = async (formData: ManualEntryFormData) => {
  const { data, error } = await supabase
    .from('manual_entry_valuations')
    .insert([formData]);

  return { data, error };
};


// Instead of using process.env, define the API base URL directly
// or use import.meta.env which is supported by Vite
const API_BASE_URL = import.meta.env.VITE_VEHICLE_API_URL || 'http://localhost:3000/api';

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

export interface VehicleData {
  makes: Make[];
  models: Model[];
}

export async function fetchVehicleData(): Promise<VehicleData> {
  try {
    console.log("Fetching vehicle data from API...");
    const makesResponse = await fetch(`${API_BASE_URL}/makes`);
    const modelsResponse = await fetch(`${API_BASE_URL}/models`);

    if (!makesResponse.ok || !modelsResponse.ok) {
      const errorStatus = !makesResponse.ok ? makesResponse.status : modelsResponse.status;
      console.error(`API error ${errorStatus} when fetching vehicle data`);
      throw new Error(`Failed to fetch vehicle data: Status ${errorStatus}`);
    }

    const makes: Make[] = await makesResponse.json();
    const models: Model[] = await modelsResponse.json();

    console.log(`Successfully fetched ${makes.length} makes and ${models.length} models`);
    return { makes, models };
  } catch (error: any) {
    console.error("Error fetching vehicle data:", error);
    toast.error(error.message || "Failed to fetch vehicle data");
    return { makes: [], models: [] };
  }
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

export async function getModelsByMakeId(makeId: string): Promise<any[]> {
  try {
    console.log(`Fetching models for make ID: ${makeId}`);
    const response = await fetch(`${API_BASE_URL}/models?make_id=${makeId}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`No models found for make ID: ${makeId}`);
        return [];
      }
      console.error(`API error ${response.status} when fetching models for make ID: ${makeId}`);
      throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.length} models for make ID: ${makeId}`);
    return data;
  } catch (error) {
    console.error("Error fetching models by make ID:", error);
    return [];
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
