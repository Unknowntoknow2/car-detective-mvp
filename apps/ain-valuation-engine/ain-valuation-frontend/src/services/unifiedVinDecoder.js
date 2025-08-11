/**
 * Unified VIN Decoder for Frontend (ES6 Module)
 * This is a JavaScript version of the unified decoder for the ain-valuation-frontend
 */

// VIN validation regex and weights
const VALID_VIN_PATTERN = /^[ABCDEFGHJKLMNPRSTUVWXYZ0-9]{17}$/;
const INVALID_VIN_CHARS = /[IOQ]/i;

const VIN_VALUES = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'J': 1,
  'K': 2, 'L': 3, 'M': 4, 'N': 5, 'P': 7, 'R': 9, 'S': 2, 'T': 3, 'U': 4,
  'V': 5, 'W': 6, 'X': 7, 'Y': 8, 'Z': 9
};

const VIN_WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

/**
 * Custom error class for VIN decoding operations
 */
export class VINDecodeError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'VINDecodeError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Validates VIN format and checksum
 */
export function validateVIN(vin) {
  if (!vin || typeof vin !== 'string') {
    return { valid: false, error: 'VIN must be a non-empty string' };
  }

  const cleanVin = vin.trim().toUpperCase();
  
  if (cleanVin.length !== 17) {
    return { valid: false, error: `VIN must be exactly 17 characters, got ${cleanVin.length}` };
  }

  if (INVALID_VIN_CHARS.test(cleanVin)) {
    return { valid: false, error: 'VIN contains invalid characters (I, O, Q are not allowed)' };
  }

  if (!VALID_VIN_PATTERN.test(cleanVin)) {
    return { valid: false, error: 'VIN contains invalid characters or format' };
  }

  // Validate checksum
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = cleanVin[i];
    const value = VIN_VALUES[char];
    if (value === undefined) {
      return { valid: false, error: 'Invalid character in VIN' };
    }
    sum += value * VIN_WEIGHTS[i];
  }

  const calculatedCheckDigit = sum % 11;
  const actualCheckDigit = cleanVin[8];
  const expectedCheckDigit = calculatedCheckDigit === 10 ? 'X' : calculatedCheckDigit.toString();

  if (actualCheckDigit !== expectedCheckDigit) {
    return { valid: false, error: 'VIN checksum is invalid (9th digit does not match calculated value)' };
  }

  return { valid: true };
}

/**
 * Main unified VIN decoding function
 */
export async function decodeVin(vin, options = {}) {
  // Validate VIN first
  const validation = validateVIN(vin);
  if (!validation.valid) {
    throw new VINDecodeError('Invalid VIN format', 'VALIDATION_ERROR', validation.error);
  }

  const { timeout = 10000, retries = 2, forceDirectAPI = false } = options;
  const cleanVin = vin.trim().toUpperCase();

  // Try Supabase edge function first (unless forced to use direct API)
  if (!forceDirectAPI) {
    try {
      console.log('🔧 Attempting Supabase edge function...');
      const edgeResult = await callSupabaseEdgeFunction(cleanVin, timeout);
      return normalizeVinResponse(edgeResult, 'SUPABASE_EDGE');
    } catch (error) {
      console.warn('⚠️ Supabase edge function failed, falling back to direct API:', error.message);
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
      { originalError: error.message }
    );
  }
}

/**
 * Calls the Supabase edge function for VIN decoding
 */
async function callSupabaseEdgeFunction(vin, timeout) {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xltxqqzattxogxtqrggt.supabase.co';
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
      throw new VINDecodeError('Invalid response format from edge function', 'INVALID_RESPONSE');
    }

    return data.decodedData[0];
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new VINDecodeError('Edge function request timeout', 'TIMEOUT_ERROR');
    }
    
    if (error instanceof VINDecodeError) {
      throw error;
    }
    
    throw new VINDecodeError('Edge function request failed', 'NETWORK_ERROR', error.message);
  }
}

/**
 * Calls the NHTSA API directly as fallback
 */
async function callNHTSADirectAPI(vin, timeout, retries) {
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
        throw new VINDecodeError(`NHTSA API error: HTTP ${response.status}`, 'NHTSA_API_ERROR');
      }

      const data = await response.json();

      if (!data.Results || !Array.isArray(data.Results) || data.Results.length === 0) {
        throw new VINDecodeError('No results from NHTSA API', 'NO_RESULTS');
      }

      return data.Results[0];
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        if (attempt === retries) {
          throw new VINDecodeError('NHTSA API timeout', 'TIMEOUT_ERROR');
        }
        continue;
      }
      
      if (error instanceof VINDecodeError) {
        if (attempt === retries) throw error;
        continue;
      }
      
      if (attempt === retries) {
        throw new VINDecodeError('NHTSA API request failed', 'NETWORK_ERROR', error.message);
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}

/**
 * Normalizes the NHTSA response into our standardized format
 */
function normalizeVinResponse(rawData, source) {
  if (!rawData) {
    throw new VINDecodeError('No data to normalize', 'NO_DATA');
  }

  const getValue = (value, defaultValue = 'Unknown') => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === 'string' && value.trim() === '') return defaultValue;
    return String(value).trim();
  };

  // Extract all raw data
  const raw = {};
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
 * Check if VIN decoding was successful
 */
export function isVinDecodeSuccessful(decodedData) {
  return decodedData.metadata.success && 
         decodedData.metadata.errorCode === '0' &&
         decodedData.categories.identity.make !== 'Unknown';
}

/**
 * Extract legacy vehicle info for backward compatibility
 */
export function extractVehicleInfo(decodedData) {
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
    // Include all required fields
    EngineCylinders: categories.powertrain.engineCylinders,
    FuelTypePrimary: categories.powertrain.fuelTypePrimary,
    DriveType: categories.powertrain.driveType,
    TransmissionStyle: categories.powertrain.transmissionStyle,
    BodyClass: categories.identity.bodyClass,
    PlantCountry: categories.manufacturing.plantCountry,
    Make: categories.identity.make,
    Model: categories.identity.model,
    ModelYear: categories.identity.modelYear,
    Trim: categories.identity.trim,
  };
}

/**
 * Assess data quality - backward compatibility function
 */
export function assessDataQuality(vehicleInfo) {
  const requiredFields = ['make', 'model', 'modelYear'];
  const missingFields = requiredFields.filter(field => !vehicleInfo[field] || vehicleInfo[field] === 'Unknown');
  
  return {
    score: Math.max(0, 100 - (missingFields.length * 20)),
    missingFields,
    isComplete: missingFields.length === 0
  };
}

// Backward compatibility - export old function name
export const decodeVIN = decodeVin;
