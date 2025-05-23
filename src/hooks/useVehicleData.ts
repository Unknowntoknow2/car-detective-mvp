
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { loadFromCache, saveToCache } from '@/utils/vehicle/cacheUtils';
import { VEHICLE_MAKES, VEHICLE_MODELS } from '@/data/vehicle-data';

export interface MakeData {
  id: string;
  make_name: string;
  logo_url?: string | null;
}

export interface ModelData {
  id: string;
  make_id: string;
  model_name: string;
}

export interface TrimData {
  id: string;
  model_id: string;
  trim_name: string;
}

export const useVehicleData = () => {
  const [makes, setMakes] = useState<MakeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | Error | null>(null);

  // Fetch makes from Supabase or local data
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try to load from cache first
        const cachedData = loadFromCache();
        if (cachedData?.makes?.length) {
          console.log(`Loaded ${cachedData.makes.length} makes from cache`);
          setMakes(cachedData.makes);
          setIsLoading(false);
          return;
        }

        // If no cached data, try to fetch from Supabase
        try {
          const { data, error } = await supabase
            .from('makes')
            .select('id, make_name')
            .order('make_name');
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            console.log(`Fetched ${data.length} makes from Supabase`);
            // Convert to MakeData format
            const makesData: MakeData[] = data.map(make => ({
              id: make.id,
              make_name: make.make_name
            }));
            
            setMakes(makesData);
            
            // Cache the data for future use
            if (makesData.length > 0) {
              saveToCache(makesData, []);
            }
          } else {
            throw new Error('No makes data returned from database');
          }
        } catch (supabaseError) {
          console.error('Error fetching makes from Supabase:', supabaseError);
          
          // Fallback to local data if Supabase fails
          const localMakes: MakeData[] = VEHICLE_MAKES.map((make, index) => ({
            id: `local-${index}`,
            make_name: make
          }));
          
          console.log(`Using ${localMakes.length} local makes data as fallback`);
          setMakes(localMakes);
        }
      } catch (err) {
        console.error('Error in fetchMakes:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMakes();
  }, []);

  // Function to get models by make name
  const getModelsByMake = useCallback(async (makeName: string): Promise<ModelData[]> => {
    if (!makeName) {
      console.error('getModelsByMake called with empty make name');
      return [];
    }
    
    console.log('Getting models for make:', makeName);
    
    try {
      // Find the make ID for the given make name
      const make = makes.find(m => m.make_name === makeName);
      
      if (!make) {
        console.error('Make not found:', makeName);
        return [];
      }
      
      console.log('Found make ID:', make.id, 'for make:', makeName);
      
      // Try to fetch from Supabase first
      try {
        const { data, error } = await supabase
          .from('models')
          .select('id, model_name, make_id')
          .eq('make_id', make.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log(`Fetched ${data.length} models for make: ${makeName}`);
          return data as ModelData[];
        }
      } catch (supabaseError) {
        console.error('Error fetching models from Supabase:', supabaseError);
      }
      
      // Fallback to local data if no models found in Supabase
      // For local data, simulate the relationship based on our predefined models
      if (make.id.startsWith('local-')) {
        const localModels: ModelData[] = [];
        
        // For Toyota
        if (makeName === 'Toyota') {
          ['Avalon', 'Camry', 'Corolla', 'GR86', 'Highlander', 'Land Cruiser', 'Prius', 'RAV4', 'Sequoia', 'Sienna', 'Tacoma', 'Tundra', '4Runner'].forEach((model, idx) => {
            localModels.push({
              id: `local-model-${idx + 80}`,
              model_name: model,
              make_id: make.id
            });
          });
        }
        // For Honda
        else if (makeName === 'Honda') {
          ['Accord', 'Civic', 'CR-V', 'Fit', 'HR-V', 'Insight', 'Odyssey', 'Passport', 'Pilot', 'Ridgeline'].forEach((model, idx) => {
            localModels.push({
              id: `local-model-${idx + 50}`,
              model_name: model,
              make_id: make.id
            });
          });
        }
        // For Ford
        else if (makeName === 'Ford') {
          ['Bronco', 'EcoSport', 'Edge', 'Escape', 'Expedition', 'Explorer', 'F-150', 'F-250', 'F-350', 'Fusion', 'Mustang', 'Ranger', 'Transit'].forEach((model, idx) => {
            localModels.push({
              id: `local-model-${idx + 20}`,
              model_name: model,
              make_id: make.id
            });
          });
        }
        // For Chevrolet
        else if (makeName === 'Chevrolet') {
          ['Blazer', 'Bolt', 'Camaro', 'Colorado', 'Corvette', 'Equinox', 'Impala', 'Malibu', 'Silverado', 'Suburban', 'Tahoe', 'Trailblazer', 'Traverse', 'Trax'].forEach((model, idx) => {
            localModels.push({
              id: `local-model-${idx}`,
              model_name: model,
              make_id: make.id
            });
          });
        }
        // For other makes, add some generic models
        else {
          // Pick some models from our vehicle_models list as a fallback
          const filteredModels = VEHICLE_MODELS.filter((_, idx) => idx % 5 === 0); // Just grab some models
          filteredModels.forEach((model, idx) => {
            localModels.push({
              id: `local-model-${make.id}-${idx}`,
              model_name: model,
              make_id: make.id
            });
          });
        }
        
        if (localModels.length > 0) {
          console.log(`Using ${localModels.length} local models for make: ${makeName}`, localModels);
          return localModels;
        }
      }
      
      // If we still don't have any models, return an empty array
      console.warn(`No models found for make: ${makeName}, returning empty array`);
      return [];
    } catch (err) {
      console.error('Error in getModelsByMake:', err);
      return [];
    }
  }, [makes]);

  // Function to get trims by model
  const getTrimsByModel = useCallback(async (modelId: string): Promise<TrimData[]> => {
    if (!modelId) {
      console.error('getTrimsByModel called with empty model ID');
      return [];
    }
    
    console.log('Getting trims for model ID:', modelId);
    
    try {
      // Try to fetch from Supabase first
      try {
        const { data, error } = await supabase
          .from('model_trims')
          .select('id, trim_name, model_id')
          .eq('model_id', modelId);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log(`Fetched ${data.length} trims for model ID: ${modelId}`);
          return data as TrimData[];
        }
      } catch (supabaseError) {
        console.error('Error fetching trims from Supabase:', supabaseError);
      }
      
      // Generate default trims if no data from Supabase
      console.log('Using default trims for model:', modelId);
      const defaultTrims: TrimData[] = [
        { id: `default-trim-${modelId}-1`, trim_name: 'Standard', model_id: modelId },
        { id: `default-trim-${modelId}-2`, trim_name: 'Deluxe', model_id: modelId },
        { id: `default-trim-${modelId}-3`, trim_name: 'Premium', model_id: modelId }
      ];
      
      console.log('Fetched trims:', defaultTrims);
      return defaultTrims;
    } catch (err) {
      console.error('Error in getTrimsByModel:', err);
      return [];
    }
  }, []);

  // Generate years from 1990 to current year + 1
  const getYearOptions = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let year = currentYear + 1; year >= 1990; year--) {
      years.push(year);
    }
    
    return years;
  }, []);

  return {
    makes,
    isLoading,
    error,
    getModelsByMake,
    getTrimsByModel,
    getYearOptions
  };
};
