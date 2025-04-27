
import { Make, Model } from '@/hooks/types/vehicle';

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_KEY_MAKES = 'vehicle_makes_v2';
const CACHE_KEY_MODELS = 'vehicle_models_v2';
const CACHE_KEY_TIMESTAMP = 'vehicle_data_timestamp_v2';

export const saveToCache = (makes: Make[], models: Model[]) => {
  try {
    if (makes.length === 0 || models.length === 0) {
      console.log("Not caching empty vehicle data");
      return;
    }
    
    console.log(`Caching ${makes.length} makes and ${models.length} models`);
    localStorage.setItem(CACHE_KEY_MAKES, JSON.stringify(makes));
    localStorage.setItem(CACHE_KEY_MODELS, JSON.stringify(models));
    localStorage.setItem(CACHE_KEY_TIMESTAMP, Date.now().toString());
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

export const loadFromCache = () => {
  try {
    const cachedMakes = localStorage.getItem(CACHE_KEY_MAKES);
    const cachedModels = localStorage.getItem(CACHE_KEY_MODELS);
    const cacheTimestamp = localStorage.getItem(CACHE_KEY_TIMESTAMP);
    const now = Date.now();
    
    const parsedTimestamp = cacheTimestamp ? parseInt(cacheTimestamp) : 0;
    const isCacheValid = !isNaN(parsedTimestamp) && (now - parsedTimestamp) < CACHE_EXPIRY;
    
    if (cachedMakes && cachedModels && isCacheValid) {
      const makes = JSON.parse(cachedMakes);
      const models = JSON.parse(cachedModels);
      
      console.log(`Loaded from cache: ${makes.length} makes and ${models.length} models`);
      
      if (makes.length === 0 || models.length === 0) {
        console.log("Cached data is empty, clearing cache");
        clearCache();
        return null;
      }
      
      return {
        makes,
        models
      };
    }
    
    if (!isCacheValid && cachedMakes) {
      console.log("Cache expired, clearing");
      clearCache();
    }
  } catch (error) {
    console.error('Error loading from cache:', error);
    clearCache();
  }
  
  return null;
};

export const clearCache = () => {
  localStorage.removeItem(CACHE_KEY_MAKES);
  localStorage.removeItem(CACHE_KEY_MODELS);
  localStorage.removeItem(CACHE_KEY_TIMESTAMP);
  console.log("Vehicle data cache cleared");
};
