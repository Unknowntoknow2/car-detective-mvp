
import { supabase } from '@/integrations/supabase/client';

interface ZipValidationResponse {
  'post code': string;
  country: string;
  'country abbreviation': string;
  places: Array<{
    'place name': string;
    state: string;
    'state abbreviation': string;
    latitude: string;
    longitude: string;
  }>;
}

export interface ZipValidationResult {
  isValid: boolean;
  city?: string;
  state?: string;
  latitude?: string;
  longitude?: string;
}

const DEBOUNCE_TIME = 300; // ms

// Debounce utility function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Validate a ZIP code using the Zippopotam.us API.
 * Will first check cache, then try API if not found.
 */
export async function validateZipCode(zip: string): Promise<ZipValidationResult> {
  if (!zip || zip.length !== 5 || !/^\d{5}$/.test(zip)) {
    return { isValid: false };
  }
  
  // Check cache first
  try {
    const { data: cachedZip, error } = await supabase
      .from('zip_validations')
      .select('*')
      .eq('zip', zip)
      .maybeSingle();
    
    if (cachedZip && !error) {
      return {
        isValid: true,
        city: cachedZip.city,
        state: cachedZip.state,
        latitude: cachedZip.latitude,
        longitude: cachedZip.longitude
      };
    }
  } catch (err) {
    console.error('Error checking ZIP code cache:', err);
  }
  
  // If not in cache, validate with API
  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
    
    if (response.status === 404) {
      return { isValid: false };
    }
    
    if (!response.ok) {
      console.error('Error validating ZIP code:', response.statusText);
      return { isValid: false };
    }
    
    const data: ZipValidationResponse = await response.json();
    
    if (!data.places || data.places.length === 0) {
      return { isValid: false };
    }
    
    const place = data.places[0];
    const result: ZipValidationResult = {
      isValid: true,
      city: place['place name'],
      state: place['state abbreviation'],
      latitude: place.latitude,
      longitude: place.longitude
    };
    
    // Cache the result
    try {
      await supabase.from('zip_validations').insert({
        zip,
        city: result.city,
        state: result.state,
        latitude: result.latitude,
        longitude: result.longitude,
        valid_at: new Date().toISOString()
      });
    } catch (cacheError) {
      console.error('Error caching ZIP validation:', cacheError);
    }
    
    return result;
  } catch (error) {
    console.error('Error validating ZIP code:', error);
    return { isValid: false };
  }
}
