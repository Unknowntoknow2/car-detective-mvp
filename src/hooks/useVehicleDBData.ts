
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

export interface DBMake {
  id: string;
  make_name: string;
}

export interface DBModel {
  id: string;
  model_name: string;
  make_id: string;
}

export function useVehicleDBData() {
  const [makes, setMakes] = useState<DBMake[]>([]);
  const [models, setModels] = useState<DBModel[]>([]);
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
        
        if (error) throw error;
        
        setMakes(data || []);
        console.log(`Loaded ${data?.length || 0} makes from Supabase`);
      } catch (err) {
        console.error('Error fetching makes:', err);
        setError('Failed to load vehicle makes from database');
        setMakes([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMakes();
  }, []);

  // Function to fetch models by make ID
  const getModelsByMakeId = async (makeId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('models')
        .select('id, model_name, make_id')
        .eq('make_id', makeId)
        .order('model_name');
      
      if (error) throw error;
      
      setModels(data || []);
      console.log(`Loaded ${data?.length || 0} models for make ID ${makeId}`);
      return data;
    } catch (err) {
      console.error('Error fetching models:', err);
      setError('Failed to load vehicle models for selected make');
      setModels([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Generate years (from current year back to 1990)
  const getYears = () => {
    const currentYear = new Date().getFullYear() + 1; // Include next year's models
    const years: number[] = [];
    for (let year = currentYear; year >= 1990; year--) {
      years.push(year);
    }
    return years;
  };

  return {
    makes,
    models,
    getModelsByMakeId,
    getYears,
    isLoading,
    error
  };
}
