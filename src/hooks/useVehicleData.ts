
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
      
      let makesData: Make[] = [];
      let modelsData: Model[] = [];
      
      if (cachedMakes && cachedModels) {
        // Use cached data first for fast loading
        makesData = JSON.parse(cachedMakes);
        modelsData = JSON.parse(cachedModels);
        
        setMakes(makesData);
        setModels(modelsData);
        
        console.log(`Loaded ${makesData.length} makes and ${modelsData.length} models from cache`);
        
        // Refresh data in background
        refreshData();
      } else {
        // No cache, fetch directly
        const freshData = await refreshData();
        if (!freshData) {
          throw new Error("Failed to load vehicle data");
        }
      }
    } catch (err: any) {
      console.error('Error fetching vehicle data:', err);
      setError(err.message || 'Failed to load vehicle data');
      
      // Try to use fallback data if available
      const fallbackMakes = getFallbackMakes();
      if (fallbackMakes.length > 0) {
        console.log('Using fallback data for makes');
        setMakes(fallbackMakes);
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
      
      if (makesData && makesData.length > 0) {
        setMakes(makesData);
        localStorage.setItem('vehicle_makes', JSON.stringify(makesData));
        console.log(`Loaded ${makesData.length} makes from the database`);
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
      
      if (modelsData) {
        setModels(modelsData);
        localStorage.setItem('vehicle_models', JSON.stringify(modelsData));
        console.log(`Loaded ${modelsData.length} models from the database`);
      }
      
      return { makes: makesData, models: modelsData };
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
    // First, find the make ID
    const make = makes.find(m => m.make_name === makeName);
    if (!make) return [];
    
    // Then filter models by make ID
    const filteredModels = models.filter(model => model.make_id === make.id);
    console.log(`Found ${filteredModels.length} models for make ${makeName}`);
    return filteredModels;
  }, [makes, models]);
  
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
    return makes.length > 0 ? makes : getFallbackMakes();
  };
  
  // Mock models for fallback makes if needed
  const getFallbackModels = (makeId: string): Model[] => {
    const modelsByMake: Record<string, string[]> = {
      '1': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', '4Runner'], // Toyota
      '2': ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey'], // Honda
      '3': ['F-150', 'Escape', 'Explorer', 'Mustang', 'Focus'], // Ford
      '4': ['Silverado', 'Malibu', 'Equinox', 'Tahoe', 'Camaro'], // Chevrolet
      '5': ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Frontier'], // Nissan
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
    getModelsByMake,
    getYearOptions,
    getFallbackModels,
    isLoading,
    error,
    refreshData
  };
};
