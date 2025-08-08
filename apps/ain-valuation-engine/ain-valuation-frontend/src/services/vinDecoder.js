import { validateVINBasic, validateVINFull, isValidWMI } from './vinValidation';
import { validateVINBasic, validateVINFull, isValidWMI } from './vinValidation';

/**
 * VIN Decoder Service
 * Handles secure communication with VIN decoding APIs
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const VIN_DECODE_ENDPOINT = `${SUPABASE_URL}/functions/v1/decode-vin`;

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
 * Decodes a VIN using the secure Supabase edge function
 * @param {string} vin - The VIN to decode
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Decoded VIN data
 */
export async function decodeVIN(vin, options = {}) {
  // Client-side validation first
  const validation = validateVIN(vin);
  if (!validation.valid) {
    throw new VINDecodeError(
      'Invalid VIN format',
      'VALIDATION_ERROR',
      validation.error
    );
  }

  const { timeout = 10000, retries = 2 } = options;
  
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(VIN_DECODE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ vin: vin.trim().toUpperCase() }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new VINDecodeError(
          errorData.error || `HTTP ${response.status}`,
          'API_ERROR',
          errorData.details
        );
      }
      
      const data = await response.json();
      
      if (!data.decodedData) {
        throw new VINDecodeError(
          'Invalid response format',
          'RESPONSE_ERROR',
          'Missing decoded data'
        );
      }
      
      return {
        success: true,
        vin: vin.trim().toUpperCase(),
        data: data.decodedData,
        timestamp: new Date().toISOString(),
        source: 'NHTSA_VPIC'
      };
      
    } catch (error) {
      lastError = error;
      
      if (error.name === 'AbortError') {
        lastError = new VINDecodeError(
          'Request timeout',
          'TIMEOUT_ERROR',
          `Request took longer than ${timeout}ms`
        );
      }
      
      // Don't retry validation errors
      if (error.code === 'VALIDATION_ERROR') {
        break;
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw lastError;
}

/**
 * Extracts key vehicle information from decoded VIN data
 * @param {Object} decodedData - Raw decoded data from NHTSA
 * @returns {Object} Formatted vehicle information
 */
export function extractVehicleInfo(decodedData) {
  if (!decodedData || !Array.isArray(decodedData) || decodedData.length === 0) {
    return null;
  }
  
  const data = decodedData[0]; // NHTSA returns array with single object
  
  return {
    // Basic vehicle information
    make: data.Make || 'Unknown',
    model: data.Model || 'Unknown',
    modelYear: data.ModelYear || 'Unknown',
    
    // Vehicle specifications
    vehicleType: data.VehicleType || 'Unknown',
    bodyClass: data.BodyClass || 'Unknown',
    series: data.Series || 'Unknown',
    trim: data.Trim || 'Unknown',
    
    // Engine information
    engineInfo: {
      cylinders: data.EngineCylinders || 'Unknown',
      displacement: data.DisplacementCC || data.DisplacementL || 'Unknown',
      fuelType: data.FuelTypePrimary || 'Unknown',
      horsepower: data.EngineHP || 'Unknown'
    },
    
    // Manufacturing details
    manufacturer: data.Manufacturer || 'Unknown',
    plantCountry: data.PlantCountry || 'Unknown',
    plantCompanyName: data.PlantCompanyName || 'Unknown',
    plantState: data.PlantState || 'Unknown',
    
    // Safety and features
    gvwr: data.GVWR || 'Unknown',
    driveType: data.DriveType || 'Unknown',
    transmissionStyle: data.TransmissionStyle || 'Unknown',
    
    // Error information
    errorCode: data.ErrorCode,
    errorText: data.ErrorText,
    
    // Metadata
    decodedVIN: data.VIN,
    suggestedVIN: data.SuggestedVIN
  };
}

/**
 * Validates decoded VIN data quality
 * @param {Object} vehicleInfo - Extracted vehicle information
 * @returns {Object} Quality assessment
 */
export function assessDataQuality(vehicleInfo) {
  if (!vehicleInfo) {
    return { score: 0, issues: ['No data available'] };
  }
  
  const issues = [];
  let score = 100;
  
  // Check for critical missing data
  if (vehicleInfo.make === 'Unknown') {
    issues.push('Make not found');
    score -= 20;
  }
  
  if (vehicleInfo.model === 'Unknown') {
    issues.push('Model not found');
    score -= 15;
  }
  
  if (vehicleInfo.modelYear === 'Unknown') {
    issues.push('Model year not found');
    score -= 15;
  }
  
  // Check for errors
  if (vehicleInfo.errorCode && vehicleInfo.errorCode !== '0') {
    issues.push(`NHTSA Error: ${vehicleInfo.errorText || 'Unknown error'}`);
    score -= 30;
  }
  
  // Check for suggested VIN (indicates input issues)
  if (vehicleInfo.suggestedVIN && vehicleInfo.suggestedVIN !== vehicleInfo.decodedVIN) {
    issues.push('VIN format may be incorrect');
    score -= 10;
  }
  
  return {
    score: Math.max(0, score),
    grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D',
    issues: issues.length > 0 ? issues : ['No issues detected'],
    isReliable: score >= 60
  };
}

/**
 * Caches decoded VIN data in localStorage with expiration
 * @param {string} vin - The VIN
 * @param {Object} data - Decoded data to cache
 * @param {number} ttl - Time to live in milliseconds (default: 1 hour)
 */
export function cacheVINData(vin, data, ttl = 3600000) {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    };
    
    localStorage.setItem(`vin_cache_${vin}`, JSON.stringify(cacheEntry));
  } catch (error) {
    console.warn('Failed to cache VIN data:', error);
  }
}

/**
 * Retrieves cached VIN data if still valid
 * @param {string} vin - The VIN to lookup
 * @returns {Object|null} Cached data or null if not found/expired
 */
export function getCachedVINData(vin) {
  try {
    const cached = localStorage.getItem(`vin_cache_${vin}`);
    if (!cached) return null;
    
    const cacheEntry = JSON.parse(cached);
    
    if (Date.now() > cacheEntry.expiry) {
      localStorage.removeItem(`vin_cache_${vin}`);
      return null;
    }
    
    return cacheEntry.data;
  } catch (error) {
    console.warn('Failed to retrieve cached VIN data:', error);
    return null;
  }
}
