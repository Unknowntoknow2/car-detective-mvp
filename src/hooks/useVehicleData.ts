
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { VEHICLE_MAKES, VEHICLE_MODELS } from '@/data/vehicle-data';

export interface Make {
  id: string;
  make_name: string;
  logo_url?: string;
}

export interface Model {
  id: string;
  make_id: string;
  model_name: string;
}

export function useVehicleData() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [modelsList, setModelsList] = useState<Model[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch makes from Supabase
  useEffect(() => {
    async function fetchMakes() {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('makes')
          .select('id, make_name')
          .order('make_name');
          
        if (error) {
          console.error('Error fetching makes from Supabase:', error);
          // Fall back to local data
          const localMakes: Make[] = VEHICLE_MAKES.map((makeName, index) => ({
            id: String(index + 1),
            make_name: makeName
          }));
          setMakes(localMakes);
        } else if (data && data.length > 0) {
          setMakes(data);
        } else {
          // If no data in Supabase, use local data
          const localMakes: Make[] = VEHICLE_MAKES.map((makeName, index) => ({
            id: String(index + 1),
            make_name: makeName
          }));
          setMakes(localMakes);
        }
      } catch (err) {
        console.error('Error in fetchMakes:', err);
        setError('Failed to load vehicle makes');
        
        // Fall back to local data
        const localMakes: Make[] = VEHICLE_MAKES.map((makeName, index) => ({
          id: String(index + 1),
          make_name: makeName
        }));
        setMakes(localMakes);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMakes();
  }, []);

  // Function to get models for a make
  const getModelsByMake = useCallback(async (makeName: string): Promise<Model[]> => {
    try {
      console.log('Fetching models for make:', makeName);
      // Find the make id
      const make = makes.find(m => m.make_name === makeName);
      
      if (make) {
        // Try to fetch from Supabase first
        const { data, error } = await supabase
          .from('models')
          .select('id, make_id, model_name')
          .eq('make_id', make.id)
          .order('model_name');
          
        if (error) {
          console.error('Error fetching models from Supabase:', error);
          // Fall back to filtered local data
          const filteredModels = getFilteredLocalModels(makeName);
          setModelsList(prevModels => [...prevModels, ...filteredModels]);
          return filteredModels;
        }
        
        if (data && data.length > 0) {
          setModelsList(data); // Update the models list state
          return data;
        }
        
        // If no models found in Supabase, use filtered local data
        const filteredModels = getFilteredLocalModels(makeName);
        setModelsList(prevModels => [...prevModels, ...filteredModels]);
        return filteredModels;
      }
      
      // Fallback to filtered local data if make not found
      const filteredModels = getFilteredLocalModels(makeName);
      setModelsList(prevModels => [...prevModels, ...filteredModels]);
      return filteredModels;
    } catch (err) {
      console.error('Error in getModelsByMake:', err);
      const filteredModels = getFilteredLocalModels(makeName);
      return filteredModels;
    }
  }, [makes]);

  // Helper function to filter local models based on make
  const getFilteredLocalModels = (makeName: string): Model[] => {
    // This is a simplified logic to map makes to models from our local data
    // In a real app, this would be more sophisticated or use a proper mapping
    const makeModelsMap: Record<string, string[]> = {
      'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', '4Runner'],
      'Honda': ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey', 'Fit', 'HR-V'],
      'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Fusion', 'Ranger'],
      'Chevrolet': ['Silverado', 'Camaro', 'Equinox', 'Malibu', 'Traverse', 'Tahoe', 'Suburban'],
      'BMW': ['3 Series', '5 Series', 'X3', 'X5', '7 Series', 'X1', 'X7'],
      'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'A-Class', 'GLA'],
      'Audi': ['A4', 'Q5', 'A6', 'Q7', 'A3', 'Q3', 'A8'],
      'Nissan': ['Altima', 'Rogue', 'Sentra', 'Pathfinder', 'Murano', 'Maxima', 'Frontier'],
      'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona', 'Palisade', 'Venue'],
      'Kia': ['Optima', 'Sorento', 'Sportage', 'Forte', 'Telluride', 'Soul', 'Seltos']
    };
    
    // If we have a mapping for this make, use it
    const modelsForMake = makeModelsMap[makeName] || [];
    
    // If no specific mapping, try to find models that might match this make from our static data
    if (modelsForMake.length === 0) {
      const fallbackModels = VEHICLE_MODELS.slice(0, 5); // Just use the first few models as a fallback
      return fallbackModels.map((modelName, index) => ({
        id: `local-${index}`,
        make_id: makes.find(m => m.make_name === makeName)?.id || 'unknown',
        model_name: modelName
      }));
    }
    
    // Return the mapped models
    return modelsForMake.map((modelName, index) => ({
      id: `local-${makeName}-${index}`,
      make_id: makes.find(m => m.make_name === makeName)?.id || 'unknown',
      model_name: modelName
    }));
  };

  // Function to get years range
  const getYearOptions = useCallback(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 50 }, (_, i) => currentYear - i);
  }, []);

  // Function to refresh data
  const refreshData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    
    try {
      const { data: makesData, error: makesError } = await supabase
        .from('makes')
        .select('id, make_name')
        .order('make_name');
        
      if (makesError) {
        throw makesError;
      }
      
      if (makesData && makesData.length > 0) {
        setMakes(makesData);
      }
      
      // For demo purposes, let's just return a success message
      return {
        success: true,
        makeCount: makesData?.length || 0,
        modelCount: modelsList.length
      };
    } catch (error) {
      console.error('Error refreshing vehicle data:', error);
      return { success: false, makeCount: 0, modelCount: 0 };
    } finally {
      setIsLoading(false);
    }
  }, [modelsList.length]);

  // Calculate counts
  const counts = {
    makes: makes.length,
    models: modelsList.length
  };

  return {
    makes,
    models: modelsList, // Add models to the return object
    isLoading,
    error,
    getModelsByMake,
    getYearOptions,
    refreshData, // Add refreshData to the return object
    counts // Add counts to the return object
  };
}
