
import { Make, Model } from '@/hooks/types/vehicle';

interface CachedData<T> {
  data: T;
  timestamp: number;
  version: string;
}

// Cache configuration
const CACHE_CONFIG = {
  // Base cache duration in milliseconds (default: 24 hours)
  DEFAULT_EXPIRY: 24 * 60 * 60 * 1000,
  
  // Cache keys with versioning
  KEYS: {
    MAKES: 'vehicle_makes_v3',
    MODELS: 'vehicle_models_v3',
    MODELS_BY_MAKE: 'vehicle_models_by_make_v3',
    TIMESTAMP: 'vehicle_data_timestamp_v3'
  },
  
  // Version tracking to force invalidation when needed
  VERSION: '3.0',
  
  // Maximum number of cached models per make (to limit storage size)
  MAX_MODELS_PER_MAKE: 200
};

/**
 * Enhanced cache utility for vehicle data
 * Features:
 * - Versioned caching
 * - Selective caching by make
 * - Size limitations
 * - Progressive loading
 */
export const enhancedCache = {
  /**
   * Save makes data to cache
   */
  saveMakes: (makes: Make[]): void => {
    if (!makes || makes.length === 0) {
      console.log("Not caching empty makes data");
      return;
    }
    
    try {
      const cacheData: CachedData<Make[]> = {
        data: makes,
        timestamp: Date.now(),
        version: CACHE_CONFIG.VERSION
      };
      
      localStorage.setItem(
        CACHE_CONFIG.KEYS.MAKES, 
        JSON.stringify(cacheData)
      );
      
      console.log(`Cached ${makes.length} makes with version ${CACHE_CONFIG.VERSION}`);
    } catch (error) {
      console.error('Error saving makes to cache:', error);
      
      // If storage is full, clear old caches to make room
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        clearOldCaches();
      }
    }
  },
  
  /**
   * Save all models to cache
   */
  saveModels: (models: Model[]): void => {
    if (!models || models.length === 0) {
      console.log("Not caching empty models data");
      return;
    }
    
    try {
      const cacheData: CachedData<Model[]> = {
        data: models,
        timestamp: Date.now(),
        version: CACHE_CONFIG.VERSION
      };
      
      localStorage.setItem(
        CACHE_CONFIG.KEYS.MODELS,
        JSON.stringify(cacheData)
      );
      
      console.log(`Cached ${models.length} models with version ${CACHE_CONFIG.VERSION}`);
    } catch (error) {
      console.error('Error saving models to cache:', error);
      
      // If storage is full, clear old caches to make room
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        clearOldCaches();
      }
    }
  },
  
  /**
   * Save models by make to enable partial loading
   */
  saveModelsByMake: (makeId: string, models: Model[]): void => {
    if (!models || models.length === 0) {
      console.log(`Not caching empty models for make ${makeId}`);
      return;
    }
    
    try {
      // Get existing cached models by make or initialize
      const existingCache = localStorage.getItem(CACHE_CONFIG.KEYS.MODELS_BY_MAKE);
      let modelsByMake: Record<string, CachedData<Model[]>> = {};
      
      if (existingCache) {
        try {
          modelsByMake = JSON.parse(existingCache);
        } catch (e) {
          console.error('Error parsing existing models by make cache', e);
          modelsByMake = {};
        }
      }
      
      // Limit the number of models per make to control cache size
      const limitedModels = models.slice(0, CACHE_CONFIG.MAX_MODELS_PER_MAKE);
      
      // Add or update the models for this make
      modelsByMake[makeId] = {
        data: limitedModels,
        timestamp: Date.now(),
        version: CACHE_CONFIG.VERSION
      };
      
      localStorage.setItem(
        CACHE_CONFIG.KEYS.MODELS_BY_MAKE,
        JSON.stringify(modelsByMake)
      );
      
      console.log(`Cached ${limitedModels.length} models for make ${makeId}`);
    } catch (error) {
      console.error(`Error saving models for make ${makeId} to cache:`, error);
      
      // If storage is full, clear old caches to make room
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        clearOldCaches();
      }
    }
  },
  
  /**
   * Load makes from cache
   */
  loadMakes: (): Make[] | null => {
    try {
      const cachedData = localStorage.getItem(CACHE_CONFIG.KEYS.MAKES);
      if (!cachedData) return null;
      
      const { data, timestamp, version } = JSON.parse(cachedData) as CachedData<Make[]>;
      
      // Validate version and expiry
      if (version !== CACHE_CONFIG.VERSION || isExpired(timestamp)) {
        console.log('Makes cache is expired or version mismatch, clearing');
        localStorage.removeItem(CACHE_CONFIG.KEYS.MAKES);
        return null;
      }
      
      console.log(`Loaded ${data.length} makes from cache`);
      return data;
    } catch (error) {
      console.error('Error loading makes from cache:', error);
      return null;
    }
  },
  
  /**
   * Load all models from cache
   */
  loadModels: (): Model[] | null => {
    try {
      const cachedData = localStorage.getItem(CACHE_CONFIG.KEYS.MODELS);
      if (!cachedData) return null;
      
      const { data, timestamp, version } = JSON.parse(cachedData) as CachedData<Model[]>;
      
      // Validate version and expiry
      if (version !== CACHE_CONFIG.VERSION || isExpired(timestamp)) {
        console.log('Models cache is expired or version mismatch, clearing');
        localStorage.removeItem(CACHE_CONFIG.KEYS.MODELS);
        return null;
      }
      
      console.log(`Loaded ${data.length} models from cache`);
      return data;
    } catch (error) {
      console.error('Error loading models from cache:', error);
      return null;
    }
  },
  
  /**
   * Load models for a specific make from cache
   */
  loadModelsByMake: (makeId: string): Model[] | null => {
    try {
      const cachedData = localStorage.getItem(CACHE_CONFIG.KEYS.MODELS_BY_MAKE);
      if (!cachedData) return null;
      
      const modelsByMake = JSON.parse(cachedData) as Record<string, CachedData<Model[]>>;
      const makeData = modelsByMake[makeId];
      
      if (!makeData) return null;
      
      const { data, timestamp, version } = makeData;
      
      // Validate version and expiry
      if (version !== CACHE_CONFIG.VERSION || isExpired(timestamp)) {
        console.log(`Cache for make ${makeId} is expired or version mismatch`);
        // Remove only this make's data from the cache
        delete modelsByMake[makeId];
        localStorage.setItem(CACHE_CONFIG.KEYS.MODELS_BY_MAKE, JSON.stringify(modelsByMake));
        return null;
      }
      
      console.log(`Loaded ${data.length} models for make ${makeId} from cache`);
      return data;
    } catch (error) {
      console.error(`Error loading models for make ${makeId} from cache:`, error);
      return null;
    }
  },
  
  /**
   * Clear all vehicle data caches
   */
  clearAllCaches: (): void => {
    localStorage.removeItem(CACHE_CONFIG.KEYS.MAKES);
    localStorage.removeItem(CACHE_CONFIG.KEYS.MODELS);
    localStorage.removeItem(CACHE_CONFIG.KEYS.MODELS_BY_MAKE);
    localStorage.removeItem(CACHE_CONFIG.KEYS.TIMESTAMP);
    console.log('All vehicle data caches cleared');
  }
};

/**
 * Check if a cached timestamp is expired
 */
function isExpired(timestamp: number): boolean {
  return Date.now() - timestamp > CACHE_CONFIG.DEFAULT_EXPIRY;
}

/**
 * Clear old caches to make room for new data
 */
function clearOldCaches(): void {
  // Clear older version caches if they exist
  const oldVersions = ['v1', 'v2'];
  
  for (const version of oldVersions) {
    localStorage.removeItem(`vehicle_makes_${version}`);
    localStorage.removeItem(`vehicle_models_${version}`);
    localStorage.removeItem(`vehicle_data_timestamp_${version}`);
  }
  
  // Also clear the models by make cache as it can be large
  localStorage.removeItem(CACHE_CONFIG.KEYS.MODELS_BY_MAKE);
  
  console.log('Cleared old caches to make room for new data');
}
