// src/api/vehicleApi.ts

import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { Make, Model } from '@/hooks/types/vehicle';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// Supabase insert
export const insertManualEntryValuation = async (formData: ManualEntryFormData) => {
  const { data: user } = await supabase.auth.getUser();
  const userId = user?.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('manual_entry_valuations')
    .insert([{ ...formData, user_id: userId }]);

  return { data, error };
};

// API fetch helpers
export async function fetchVehicleData(): Promise<VehicleData> {
  try {
    const makesResponse = await fetch(`${API_BASE_URL}/makes`);
    const modelsResponse = await fetch(`${API_BASE_URL}/models`);

    if (!makesResponse.ok || !modelsResponse.ok) {
      throw new Error(`Failed to fetch vehicle data: Status ${makesResponse.status} / ${modelsResponse.status}`);
    }

    const makes: Make[] = await makesResponse.json();
    const models: Model[] = await modelsResponse.json();
    return { makes, models };
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch vehicle data');
    return { makes: [], models: [] };
  }
}

export async function fetchVehicleDetails(vin: string): Promise<VehicleDetails | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicle-details?vin=${vin}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data as VehicleDetails;
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch vehicle details');
    return null;
  }
}

export async function getModelsByMakeId(makeId: string): Promise<Model[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/models?make_id=${makeId}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data as Model[];
  } catch {
    return [];
  }
}

export async function fetchAverageMarketValue(
  year: number,
  make: string,
  model: string,
  zip?: string
): Promise<number> {
  try {
    const url = new URL(`${API_BASE_URL}/market-value`);
    url.searchParams.append('year', year.toString());
    url.searchParams.append('make', make);
    url.searchParams.append('model', model);
    if (zip) url.searchParams.append('zip', zip);

    const response = await fetch(url.toString());
    if (!response.ok) return 0;
    const data = await response.json();
    return data.averageValue as number;
  } catch {
    return 0;
  }
}

export async function fetchFuelEfficiency(year: number, make: string, model: string): Promise<number | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/fuel-efficiency?year=${year}&make=${make}&model=${model}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.mpg as number;
  } catch {
    return null;
  }
}

export async function fetchSafetyRatings(year: number, make: string, model: string): Promise<any | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/safety-ratings?year=${year}&make=${make}&model=${model}`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchRecalls(year: number, make: string, model: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/recalls?year=${year}&make=${make}&model=${model}`);
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}
