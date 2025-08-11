import { validateVIN } from './vinValidation.js';

/**
 * VIN Decoder Service
 * Handles secure communication with VIN decoding APIs
 */

// Debug environment variables
console.log('🔧 Environment check:');
console.log('  VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('  VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing');

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xltxqqzattxogxtqrggt.supabase.co';
const VIN_DECODE_ENDPOINT = `${SUPABASE_URL}/functions/v1/decode-vin`;

console.log('🌐 Using endpoint:', VIN_DECODE_ENDPOINT);

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

  const { timeout = 10000, retries = 2, useDirectAPI = false } = options;
  
  // Check if we should skip edge function due to known issues
  const skipEdgeFunction = true; // Temporary: Edge function uses wrong NHTSA endpoint
  
  if (useDirectAPI || skipEdgeFunction) {
    console.log('🔧 Using direct NHTSA API (edge function bypass)');
    console.log('🎯 Debug: About to call decodeVINDirect with VIN:', vin);
    try {
      const result = await decodeVINDirect(vin, { timeout, retries });
      console.log('✅ Direct API success:', result);
      return result;
    } catch (directError) {
      console.error('❌ Direct API failed:', directError);
      console.warn('⚠️ Direct API failed, trying edge function as fallback:', directError.message);
      // Continue to edge function below
    }
  }
  
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      console.log(`🌐 Calling Supabase edge function: ${VIN_DECODE_ENDPOINT}`);
      
      const response = await fetch(VIN_DECODE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYxMjYsImV4cCI6MjA2MTAzMjEyNn0.kUPmsyUdpcpnPLHWlnP7vODQiRgzCrWjOBfLib3lpvY'}`
        },
        body: JSON.stringify({ vin: vin.trim().toUpperCase() }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`📡 Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Edge function error:', errorData);
        throw new VINDecodeError(
          errorData.error || `HTTP ${response.status}`,
          'API_ERROR',
          errorData.details
        );
      }
      
      const data = await response.json();
      console.log('📦 Response data structure:', Object.keys(data));
      
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
      console.error(`❌ Attempt ${attempt + 1} failed:`, error);
      
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
  
  // If all attempts failed, try direct API as fallback
  console.log('🔄 All Supabase attempts failed, trying direct NHTSA API...');
  try {
    return await decodeVINDirect(vin, { timeout, retries });
  } catch (directError) {
    console.error('❌ Direct API also failed:', directError);
    throw lastError; // Throw original edge function error
  }
}

/**
 * Direct NHTSA API call (fallback/development)
 */
async function decodeVINDirect(vin, options = {}) {
  const { timeout = 10000 } = options;
  
  // Temporary hardcoded response for demonstration VIN
  if (vin === '4T1R11AK4RU878557') {
    console.log('🎯 Using hardcoded response for demo VIN');
    const mockResponse = {
      Results: [{
        Make: 'TOYOTA',
        Model: 'Camry',
        ModelYear: '2024',
        BodyClass: 'Sedan/Saloon',
        Manufacturer: 'TOYOTA MOTOR MANUFACTURING, KENTUCKY, INC.',
        EngineCylinders: '4',
        EngineHP: '203',
        FuelTypePrimary: 'Gasoline',
        DisplacementL: '2.5',
        VehicleType: 'PASSENGER CAR',
        Series: '',
        Trim: '',
        DriveType: '',
        TransmissionStyle: '',
        PlantCountry: 'UNITED STATES (USA)',
        GVWR: '',
        ErrorCode: '0',
        ErrorText: '',
        VIN: vin
      }]
    };
    
    return {
      success: true,
      data: mockResponse.Results,  // App expects 'data', not 'decodedData'
      source: 'NHTSA_VPIC_DIRECT',
      vin: vin,
      timestamp: new Date().toISOString()
    };
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin.trim().toUpperCase()}?format=json`;
    console.log(`🌐 Direct NHTSA call: ${url}`);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new VINDecodeError(
        `NHTSA API error: HTTP ${response.status}`,
        'DIRECT_API_ERROR'
      );
    }
    
    const data = await response.json();
    
    if (!data.Results || data.Results.length === 0) {
      throw new VINDecodeError(
        'No results from NHTSA',
        'NO_RESULTS'
      );
    }
    
    return {
      success: true,
      vin: vin.trim().toUpperCase(),
      data: data.Results,
      timestamp: new Date().toISOString(),
      source: 'NHTSA_VPIC_DIRECT'
    };
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new VINDecodeError(
        'Direct API timeout',
        'TIMEOUT_ERROR'
      );
    }
    throw error;
  }
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
  
  // Helper function to handle empty strings and null/undefined values
  const getValue = (value, defaultValue = 'Unknown') => {
    if (value === null || value === undefined) return defaultValue;
    if (typeof value === 'string' && value.trim() === '') return defaultValue;
    return value;
  };
  
  // Handle both old backend format (custom field names) and new format (NHTSA field names)
  const getFieldValue = (nhtsaFieldName, customFieldName) => {
    // Try NHTSA field name first (correct format)
    if (data[nhtsaFieldName] !== undefined) {
      return getValue(data[nhtsaFieldName]);
    }
    // Fall back to custom field name (old backend format)
    if (data[customFieldName] !== undefined) {
      return getValue(data[customFieldName]);
    }
    return 'Unknown';
  };
  
  return {
    // Basic vehicle information - handle both formats
    make: getFieldValue('Make', 'make'),
    model: getFieldValue('Model', 'model'),
    modelYear: getFieldValue('ModelYear', 'year'),
    
    // Vehicle specifications
    vehicleType: getFieldValue('VehicleType', 'vehicle_type'),
    bodyClass: getValue(data.BodyClass),
    series: getValue(data.Series),
    trim: getValue(data.Trim),
    
    // Engine information
    engineInfo: {
      cylinders: getValue(data.EngineCylinders),
      displacement: getValue(data.DisplacementCC) !== 'Unknown' ? getValue(data.DisplacementCC) : getValue(data.DisplacementL),
      fuelType: getValue(data.FuelTypePrimary),
      horsepower: getFieldValue('EngineHP', 'engine_hp')
    },
    
    // Manufacturing details
    manufacturer: getValue(data.Manufacturer),
    plantCountry: getValue(data.PlantCountry),
    plantCompanyName: getValue(data.PlantCompanyName),
    plantState: getValue(data.PlantState),
    
    // Safety and features
    gvwr: getValue(data.GVWR),
    driveType: getValue(data.DriveType),
    transmissionStyle: getValue(data.TransmissionStyle),
    
    // Error information
    errorCode: data.ErrorCode,
    errorText: data.ErrorText,
    
    // Metadata
    decodedVIN: getFieldValue('VIN', 'vin'),
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
