
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Make {
  id: string;
  make_name: string;
  logo_url?: string | null;
  nhtsa_make_id?: number | null;
  country_of_origin?: string | null;
  description?: string | null;
  founding_year?: number | null;
}

export interface Model {
  id: string;
  make_id: string;
  model_name: string;
  nhtsa_model_id?: number | null;
}

export const useVehicleData = () => {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [modelsByMake, setModelsByMake] = useState<Record<string, Model[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch makes and models data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if we have makes cached in localStorage
      const cachedMakes = localStorage.getItem('vehicle_makes');
      const cachedModels = localStorage.getItem('vehicle_models');
      const cacheTimestamp = localStorage.getItem('vehicle_data_timestamp');
      const cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const now = Date.now();
      
      // Validate that the cache timestamp is a valid number
      const parsedTimestamp = cacheTimestamp ? parseInt(cacheTimestamp) : 0;
      const isCacheValid = !isNaN(parsedTimestamp) && (now - parsedTimestamp) < cacheExpiry;
      
      let makesData: Make[] = [];
      let modelsData: Model[] = [];
      
      if (cachedMakes && cachedModels && isCacheValid) {
        try {
          // Use cached data first for fast loading
          makesData = JSON.parse(cachedMakes);
          modelsData = JSON.parse(cachedModels);
          
          if (Array.isArray(makesData) && Array.isArray(modelsData) && makesData.length > 0) {
            setMakes(makesData);
            setModels(modelsData);
            
            // Build the modelsByMake object for fast lookup
            const modelsByMakeObj: Record<string, Model[]> = {};
            modelsData.forEach(model => {
              if (!modelsByMakeObj[model.make_id]) {
                modelsByMakeObj[model.make_id] = [];
              }
              modelsByMakeObj[model.make_id].push(model);
            });
            setModelsByMake(modelsByMakeObj);
            
            console.log(`Loaded ${makesData.length} makes and ${modelsData.length} models from cache`);
            
            // Set loading to false here since we successfully loaded cached data
            setIsLoading(false);
            
            // Refresh data in the background after returning cached data
            refreshData().catch(err => {
              console.error("Background refresh error:", err);
            });
            
            return;
          } else {
            console.warn("Cache data is not in expected array format, fetching from API");
            // If cached data is invalid, proceed to fetch from API
          }
        } catch (parseError) {
          console.error("Error parsing cached data:", parseError);
          // If parsing fails, proceed to fetch from API
        }
      }
      
      // No valid cache, fetch directly
      const freshData = await refreshData();
      if (!freshData) {
        throw new Error("Failed to load vehicle data");
      }
    } catch (err: any) {
      console.error('Error fetching vehicle data:', err);
      setError(err.message || 'Failed to load vehicle data');
      
      // Try to use fallback data if available
      const fallbackMakes = getFallbackMakes();
      if (fallbackMakes.length > 0) {
        console.log('Using fallback data for makes');
        setMakes(fallbackMakes);
        
        // Also generate some fallback models for each make
        let allFallbackModels: Model[] = [];
        const modelsByMakeObj: Record<string, Model[]> = {};
        
        fallbackMakes.forEach(make => {
          const makeModels = getFallbackModels(make.id);
          allFallbackModels = [...allFallbackModels, ...makeModels];
          
          // Add to modelsByMake object
          modelsByMakeObj[make.id] = makeModels;
        });
        
        setModels(allFallbackModels);
        setModelsByMake(modelsByMakeObj);
        
        // Cache the fallback data
        localStorage.setItem('vehicle_makes', JSON.stringify(fallbackMakes));
        localStorage.setItem('vehicle_models', JSON.stringify(allFallbackModels));
        localStorage.setItem('vehicle_data_timestamp', Date.now().toString());
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const refreshData = useCallback(async () => {
    try {
      console.log('Fetching vehicle data from Supabase...');
      
      // Fetch makes
      const { data: makesData, error: makesError } = await supabase
        .from('makes')
        .select('*')
        .order('make_name');
        
      if (makesError) {
        console.error('Error fetching makes:', makesError);
        throw makesError;
      }
      
      const validMakesData = Array.isArray(makesData) ? makesData : [];
      
      if (validMakesData.length > 0) {
        setMakes(validMakesData);
        localStorage.setItem('vehicle_makes', JSON.stringify(validMakesData));
        console.log(`Loaded ${validMakesData.length} makes from the database`);
      } else {
        console.warn('No makes found in database, using fallback data');
        const fallbackData = getFallbackMakes();
        setMakes(fallbackData);
        localStorage.setItem('vehicle_makes', JSON.stringify(fallbackData));
      }
      
      // Fetch models
      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('*')
        .order('model_name');
        
      if (modelsError) {
        console.error('Error fetching models:', modelsError);
        throw modelsError;
      }
      
      const validModelsData = Array.isArray(modelsData) ? modelsData : [];
      
      if (validModelsData.length > 0) {
        setModels(validModelsData);
        localStorage.setItem('vehicle_models', JSON.stringify(validModelsData));
        console.log(`Loaded ${validModelsData.length} models from the database`);
        
        // Build the modelsByMake object for fast lookup
        const modelsByMakeObj: Record<string, Model[]> = {};
        validModelsData.forEach(model => {
          if (!modelsByMakeObj[model.make_id]) {
            modelsByMakeObj[model.make_id] = [];
          }
          modelsByMakeObj[model.make_id].push(model);
        });
        setModelsByMake(modelsByMakeObj);
      } else {
        console.warn('No models found in database, using fallback models');
        
        // Generate fallback models for each make
        let allFallbackModels: Model[] = [];
        const modelsByMakeObj: Record<string, Model[]> = {};
        const mData = validMakesData.length > 0 ? validMakesData : getFallbackMakes();
        
        mData.forEach(make => {
          const makeModels = getFallbackModels(make.id);
          allFallbackModels = [...allFallbackModels, ...makeModels];
          // Add to modelsByMake object
          modelsByMakeObj[make.id] = makeModels;
        });
        
        setModels(allFallbackModels);
        setModelsByMake(modelsByMakeObj);
        localStorage.setItem('vehicle_models', JSON.stringify(allFallbackModels));
      }
      
      // Update cache timestamp
      localStorage.setItem('vehicle_data_timestamp', Date.now().toString());
      
      return { makes: validMakesData, models: validModelsData };
    } catch (err) {
      console.error('Error refreshing vehicle data:', err);
      toast.error('Failed to load vehicle data. Using cached data if available.');
      return null;
    }
  }, []);
  
  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Function to get models for a specific make
  const getModelsByMake = useCallback((makeName: string): Model[] => {
    if (!makeName || !Array.isArray(makes)) {
      console.warn("Missing data for getModelsByMake:", { makeName, makesAvailable: Array.isArray(makes) });
      return [];
    }
    
    // First, find the make ID
    const make = makes.find(m => m.make_name === makeName);
    if (!make) {
      console.warn(`Make not found: ${makeName}`);
      return [];
    }
    
    // Get models from the modelsByMake object (faster lookup)
    if (modelsByMake && modelsByMake[make.id] && Array.isArray(modelsByMake[make.id])) {
      return modelsByMake[make.id];
    }
    
    // Fallback to filtering if modelsByMake doesn't have the data
    if (Array.isArray(models)) {
      const filteredModels = models.filter(model => model.make_id === make.id);
      console.log(`Found ${filteredModels.length} models for make ${makeName}`);
      
      // If we don't have any models, return fallback
      if (filteredModels.length === 0) {
        const fallbackModels = getFallbackModels(make.id);
        console.log(`Using ${fallbackModels.length} fallback models for make ${makeName}`);
        return fallbackModels;
      }
      
      return filteredModels;
    }
    
    return [];
  }, [makes, models, modelsByMake]);
  
  // Get year options for dropdowns
  const getYearOptions = useCallback((startYear: number = 1980): number[] => {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 1; // Include next year's models
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => endYear - i
    );
  }, []);
  
  // Fallback makes data if database is empty or unreachable
  const getFallbackMakes = (): Make[] => {
    return [
      { id: '1', make_name: 'Toyota', logo_url: 'https://www.carlogos.org/car-logos/toyota-logo.png' },
      { id: '2', make_name: 'Honda', logo_url: 'https://www.carlogos.org/car-logos/honda-logo.png' },
      { id: '3', make_name: 'Ford', logo_url: 'https://www.carlogos.org/car-logos/ford-logo.png' },
      { id: '4', make_name: 'Chevrolet', logo_url: 'https://www.carlogos.org/car-logos/chevrolet-logo.png' },
      { id: '5', make_name: 'Nissan', logo_url: 'https://www.carlogos.org/car-logos/nissan-logo.png' },
      { id: '6', make_name: 'BMW', logo_url: 'https://www.carlogos.org/car-logos/bmw-logo.png' },
      { id: '7', make_name: 'Mercedes-Benz', logo_url: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png' },
      { id: '8', make_name: 'Audi', logo_url: 'https://www.carlogos.org/car-logos/audi-logo.png' },
      { id: '9', make_name: 'Lexus', logo_url: 'https://www.carlogos.org/car-logos/lexus-logo.png' },
      { id: '10', make_name: 'Hyundai', logo_url: 'https://www.carlogos.org/car-logos/hyundai-logo.png' },
      { id: '11', make_name: 'Kia', logo_url: 'https://www.carlogos.org/car-logos/kia-logo.png' },
      { id: '12', make_name: 'Subaru', logo_url: 'https://www.carlogos.org/car-logos/subaru-logo.png' },
    ];
  };

  // Get the most complete list of makes available (from DB or fallback)
  const getAvailableMakes = (): Make[] => {
    if (!Array.isArray(makes) || makes.length === 0) {
      const fallback = getFallbackMakes();
      console.log("Using fallback makes data with length:", fallback.length);
      return fallback;
    }
    return makes;
  };
  
  // Mock models for fallback makes if needed
  const getFallbackModels = (makeId: string): Model[] => {
    const modelsByMake: Record<string, string[]> = {
      '1': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', '4Runner'], // Toyota
      '2': ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey'], // Honda
      '3': ['F-150', 'Escape', 'Explorer', 'Mustang', 'Focus'], // Ford
      '4': ['Silverado', 'Malibu', 'Equinox', 'Tahoe', 'Camaro'], // Chevrolet
      '5': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Frontier'], // Nissan
      '6': ['3 Series', '5 Series', 'X3', 'X5', 'M3'], // BMW
      '7': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE'], // Mercedes-Benz
      '8': ['A4', 'A6', 'Q5', 'Q7', 'e-tron'], // Audi
      '9': ['ES', 'RX', 'NX', 'LS', 'IS'], // Lexus
      '10': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade'], // Hyundai
      '11': ['Forte', 'Optima', 'Sportage', 'Sorento', 'Telluride'], // Kia
      '12': ['Forester', 'Outback', 'Impreza', 'Crosstrek', 'Legacy'], // Subaru
    };
    
    const defaultModels = ['Base', 'Standard', 'Deluxe', 'Premium'];
    const makeModels = modelsByMake[makeId] || defaultModels;
    
    return makeModels.map((model, index) => ({
      id: `${makeId}-${index}`,
      make_id: makeId,
      model_name: model
    }));
  };
  
  return {
    makes: getAvailableMakes(),
    models,
    modelsByMake,
    getModelsByMake,
    getYearOptions,
    getFallbackModels,
    isLoading,
    error,
    refreshData
  };
};
