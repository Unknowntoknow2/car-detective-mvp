
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { VEHICLE_MAKES } from '@/data/vehicle-data';

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
          // Return empty array if error
          return [];
        }
        
        if (data && data.length > 0) {
          setModelsList(data); // Update the models list state
          return data;
        }
      }
      
      // If no models found in Supabase or no make id, fallback to hard-coded logic
      // Here we'd typically filter the models from our local data
      // For now, just return some sample models based on make
      const sampleModels = [
        { id: '1', make_id: '1', model_name: 'Sample Model' },
        { id: '2', make_id: '1', model_name: 'Another Model' }
      ];
      
      setModelsList(sampleModels);
      return sampleModels;
    } catch (err) {
      console.error('Error in getModelsByMake:', err);
      return [];
    }
  }, [makes]);

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
