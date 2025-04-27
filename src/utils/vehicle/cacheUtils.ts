
import { Make, Model } from '@/hooks/types/vehicle';

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const saveToCache = (makes: Make[], models: Model[]) => {
  try {
    localStorage.setItem('vehicle_makes', JSON.stringify(makes));
    localStorage.setItem('vehicle_models', JSON.stringify(models));
    localStorage.setItem('vehicle_data_timestamp', Date.now().toString());
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

export const loadFromCache = () => {
  try {
    const cachedMakes = localStorage.getItem('vehicle_makes');
    const cachedModels = localStorage.getItem('vehicle_models');
    const cacheTimestamp = localStorage.getItem('vehicle_data_timestamp');
    const now = Date.now();
    
    const parsedTimestamp = cacheTimestamp ? parseInt(cacheTimestamp) : 0;
    const isCacheValid = !isNaN(parsedTimestamp) && (now - parsedTimestamp) < CACHE_EXPIRY;
    
    if (cachedMakes && cachedModels && isCacheValid) {
      return {
        makes: JSON.parse(cachedMakes),
        models: JSON.parse(cachedModels)
      };
    }
  } catch (error) {
    console.error('Error loading from cache:', error);
  }
  
  return null;
};

export const clearCache = () => {
  localStorage.removeItem('vehicle_makes');
  localStorage.removeItem('vehicle_models');
  localStorage.removeItem('vehicle_data_timestamp');
};
