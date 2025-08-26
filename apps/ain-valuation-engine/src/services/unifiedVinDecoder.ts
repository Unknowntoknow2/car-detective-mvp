/**
 * Unified VIN Decoder Service
 * Consolidates all VIN decoding logic with proper fallback handling
 */

import { validateVIN } from './vinValidation.js';

// Types for VIN decoding response
export interface DecodedVinData {
  raw: Record<string, string>;
  categories: {
    identity: Record<string, string>;
    powertrain: Record<string, string>;
    manufacturing: Record<string, string>;
    safety: Record<string, string>;
    specifications: Record<string, string>;
  };
  metadata: {
    source: 'SUPABASE_EDGE' | 'NHTSA_DIRECT';
    timestamp: string;
    success: boolean;
    errorCode?: string;
    errorText?: string;
  };
}

export interface VinDecodeOptions {
  timeout?: number;
  retries?: number;
  forceDirectAPI?: boolean;
}

/**
 * Custom error class for VIN decoding operations
 */
export class VINDecodeError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'VINDecodeError';
  }
}

/**
 * Main VIN decoding function with unified fallback logic
 * @param vin - 17-character VIN to decode
 * @param options - Decoding options
 * @returns Normalized VIN data with categorized fields
 */
export async function decodeVin(vin: string, options: VinDecodeOptions = {}): Promise<DecodedVinData> {
  // Input validation
  const validation = validateVIN(vin);
  if (!validation.valid) {
    throw new VINDecodeError(
      'Invalid VIN format',
      'VALIDATION_ERROR',
      validation.error
    );
  }

  const { timeout = 10000, retries = 2, forceDirectAPI = false } = options;
  const cleanVin = vin.trim().toUpperCase();

  // Try Supabase edge function first (unless forced to use direct API)
  if (!forceDirectAPI) {
    try {
      console.log('🔧 Attempting Supabase edge function...');
  const HAS_SUPABASE = !!(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY);
  if (!HAS_SUPABASE) {
    console.warn("[supabase] Missing VITE_SUPABASE_URL/KEY — skipping edge function, using direct NHTSA API.");
    throw new Error("EdgeDisabled");
  }
      const edgeResult = await callSupabaseEdgeFunction(cleanVin, timeout);
      return normalizeVinResponse(edgeResult, 'SUPABASE_EDGE');
    } catch (error) {
      console.warn('⚠️ Supabase edge function failed, falling back to direct API:', (error as any)?.message ?? String(error));
      
      // If edge function returns 401, it means auth issues - proceed to fallback
      // For other errors, we'll also fallback to ensure reliability
    }
  }

  // Fallback to direct NHTSA API
  try {
    console.log('🔧 Using direct NHTSA API fallback...');
    const directResult = await callNHTSADirectAPI(cleanVin, timeout, retries);
    return normalizeVinResponse(directResult, 'NHTSA_DIRECT');
  } catch (error) {
    console.error('❌ Both edge function and direct API failed:', error);
    throw new VINDecodeError(
      'VIN decoding failed on all endpoints',
      'ALL_ENDPOINTS_FAILED',
      { originalError: (error as any)?.message ?? String(error) }
    );
  }
}

/**
 * Calls the Supabase edge function for VIN decoding
 */
async function callSupabaseEdgeFunction(vin: string, timeout: number): Promise<any> {
  // Get Supabase URL from environment or use default
  const SUPABASE_URL = (typeof window !== 'undefined' && (window as any).ENV?.VITE_SUPABASE_URL) || 
                      (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
                      'https://xltxqqzattxogxtqrggt.supabase.co';
  const endpoint = `${SUPABASE_URL}/functions/v1/decode-vin`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // No Authorization header needed - edge function is public
      },
      body: JSON.stringify({ vin }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        throw new VINDecodeError('Edge function requires authentication', 'AUTH_ERROR');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new VINDecodeError(
        errorData.error || `HTTP ${response.status}`,
        'EDGE_FUNCTION_ERROR',
        errorData
      );
    }

    const data = await response.json();
    
    if (!data.decodedData || !Array.isArray(data.decodedData)) {
      throw new VINDecodeError(
        'Invalid response format from edge function',
        'INVALID_RESPONSE'
      );
    }

    return data.decodedData[0]; // NHTSA returns array with single object
  } catch (error) {
    clearTimeout(timeoutId);
    
    if ((error as any)?.name === 'AbortError') {
      throw new VINDecodeError('Edge function request timeout', 'TIMEOUT_ERROR');
    }
    
    if (error instanceof VINDecodeError) {
      throw error;
    }
    
    throw new VINDecodeError(
      'Edge function request failed',
      'NETWORK_ERROR',
      (error as any)?.message ?? String(error)
    );
  }
}

/**
 * Calls the NHTSA API directly as fallback
 */
async function callNHTSADirectAPI(vin: string, timeout: number, retries: number): Promise<any> {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      console.log(`🌐 Direct NHTSA API call (attempt ${attempt + 1}): ${url}`);
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AIN-Valuation-Engine/1.0'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new VINDecodeError(
          `NHTSA API error: HTTP ${response.status}`,
          'NHTSA_API_ERROR'
        );
      }

      const data = await response.json();

      if (!data.Results || !Array.isArray(data.Results) || data.Results.length === 0) {
        throw new VINDecodeError(
          'No results from NHTSA API',
          'NO_RESULTS'
        );
      }

      return data.Results[0];
    } catch (error) {
      clearTimeout(timeoutId);
      
      if ((error as any)?.name === 'AbortError') {
        if (attempt === retries) {
          throw new VINDecodeError('NHTSA API timeout', 'TIMEOUT_ERROR');
        }
        console.warn(`⏱️ Attempt ${attempt + 1} timed out, retrying...`);
        continue;
      }
      
      if (error instanceof VINDecodeError) {
        if (attempt === retries) throw error;
        console.warn(`⚠️ Attempt ${attempt + 1} failed: ${(error as any)?.message ?? String(error)}, retrying...`);
        continue;
      }
      
      if (attempt === retries) {
        throw new VINDecodeError(
          'NHTSA API request failed',
          'NETWORK_ERROR',
          (error as any)?.message ?? String(error)
        );
      }
      
      console.warn(`⚠️ Attempt ${attempt + 1} failed: ${(error as any)?.message ?? String(error)}, retrying...`);
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}

/**
 * Normalizes the NHTSA response into our standardized format
 */
function normalizeVinResponse(rawData: any, source: 'SUPABASE_EDGE' | 'NHTSA_DIRECT'): DecodedVinData {
  if (!rawData) {
    throw new VINDecodeError('No data to normalize', 'NO_DATA');
  }

  // Helper function to safely get values
  const getValue = (value: any, defaultValue = 'Unknown'): string => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === 'string' && value.trim() === '') return defaultValue;
    return String(value).trim();
  };

  // Extract all raw data
  const raw: Record<string, string> = {};
  Object.keys(rawData).forEach(key => {
    raw[key] = getValue(rawData[key]);
  });

  // Categorize the most important fields
  const categories = {
    identity: {
      make: getValue(rawData.Make),
      model: getValue(rawData.Model),
      modelYear: getValue(rawData.ModelYear),
      trim: getValue(rawData.Trim),
      series: getValue(rawData.Series),
      bodyClass: getValue(rawData.BodyClass),
      vehicleType: getValue(rawData.VehicleType),
    },
    powertrain: {
      engineCylinders: getValue(rawData.EngineCylinders),
      engineHP: getValue(rawData.EngineHP),
      displacementCC: getValue(rawData.DisplacementCC),
      displacementL: getValue(rawData.DisplacementL),
      fuelTypePrimary: getValue(rawData.FuelTypePrimary),
      fuelTypeSecondary: getValue(rawData.FuelTypeSecondary),
      driveType: getValue(rawData.DriveType),
      transmissionStyle: getValue(rawData.TransmissionStyle),
      transmissionSpeeds: getValue(rawData.TransmissionSpeeds),
    },
    manufacturing: {
      manufacturer: getValue(rawData.Manufacturer),
      plantCity: getValue(rawData.PlantCity),
      plantState: getValue(rawData.PlantState),
      plantCountry: getValue(rawData.PlantCountry),
      plantCompanyName: getValue(rawData.PlantCompanyName),
    },
    safety: {
      abs: getValue(rawData.ABS),
      esc: getValue(rawData.ESC),
      tpms: getValue(rawData.TPMS),
      adaptiveCruiseControl: getValue(rawData.AdaptiveCruiseControl),
      laneKeepSystem: getValue(rawData.LaneKeepSystem),
      forwardCollisionWarning: getValue(rawData.ForwardCollisionWarning),
      blindSpotMon: getValue(rawData.BlindSpotMon),
      keylessIgnition: getValue(rawData.KeylessIgnition),
    },
    specifications: {
      doors: getValue(rawData.Doors),
      seats: getValue(rawData.Seats),
      seatRows: getValue(rawData.SeatRows),
      gvwr: getValue(rawData.GVWR),
      gvwrFrom: getValue(rawData.GVWRFrom),
      gvwrTo: getValue(rawData.GVWRTo),
      batteryType: getValue(rawData.BatteryType),
      electrificationLevel: getValue(rawData.ElectrificationLevel),
    }
  };

  return {
    raw,
    categories,
    metadata: {
      source,
      timestamp: new Date().toISOString(),
      success: true,
      errorCode: getValue(rawData.ErrorCode, '0'),
      errorText: getValue(rawData.ErrorText, ''),
    }
  };
}

/**
 * Helper function to extract specific fields for backwards compatibility
 */
export function extractLegacyVehicleInfo(decodedData: DecodedVinData) {
  const { categories } = decodedData;
  
  return {
    make: categories.identity.make,
    model: categories.identity.model,
    modelYear: parseInt(categories.identity.modelYear) || undefined,
    trim: categories.identity.trim !== 'Unknown' ? categories.identity.trim : undefined,
    bodyClass: categories.identity.bodyClass,
    engineCylinders: parseInt(categories.powertrain.engineCylinders) || undefined,
    engineHP: parseInt(categories.powertrain.engineHP) || undefined,
    fuelTypePrimary: categories.powertrain.fuelTypePrimary,
    driveType: categories.powertrain.driveType,
    transmissionStyle: categories.powertrain.transmissionStyle,
    manufacturer: categories.manufacturing.manufacturer,
    plantCountry: categories.manufacturing.plantCountry,
    errorCode: decodedData.metadata.errorCode,
    errorText: decodedData.metadata.errorText,
  };
}

/**
 * Convenience function for quick field access
 */
export function getVinField(decodedData: DecodedVinData, category: keyof DecodedVinData['categories'], field: string): string {
  return decodedData.categories[category]?.[field] || 'Unknown';
}

/**
 * Check if VIN decoding was successful
 */
export function isVinDecodeSuccessful(decodedData: DecodedVinData): boolean {
  return decodedData.metadata.success && 
         decodedData.metadata.errorCode === '0' &&
         decodedData.categories.identity.make !== 'Unknown';
}
