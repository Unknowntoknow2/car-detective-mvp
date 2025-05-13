
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MakeModel {
  id: string;
  name: string;
}

export function useVehicleDBData() {
  const [makes, setMakes] = useState<MakeModel[]>([]);
  const [models, setModels] = useState<MakeModel[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  
  // Fetch makes
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
        
        // Map the data to match the MakeModel interface
        const formattedMakes: MakeModel[] = (data || []).map(make => ({
          id: make.id,
          name: make.make_name
        }));
        
        setMakes(formattedMakes);
      } catch (err: any) {
        console.error('Error fetching makes:', err);
        setError('Failed to load vehicle makes');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMakes();
  }, []);
  
  // Function to fetch models by make ID
  const getModelsByMakeId = async (makeId: string) => {
    if (!makeId) {
      setModels([]);
      return [];
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('models')
        .select('id, model_name')
        .eq('make_id', makeId)
        .order('model_name');
        
      if (error) throw error;
      
      // Map the data to match the MakeModel interface
      const formattedModels: MakeModel[] = (data || []).map(model => ({
        id: model.id,
        name: model.model_name
      }));
      
      setModels(formattedModels);
      return formattedModels;
    } catch (err: any) {
      console.error('Error fetching models:', err);
      setError('Failed to load vehicle models');
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generate years (this could be based on make/model or static range)
  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const yearsList = [];
    for (let year = currentYear; year >= currentYear - 20; year--) {
      yearsList.push(year);
    }
    return yearsList;
  };
  
  // Function to get make name by ID
  const getMakeName = async (makeId: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('makes')
        .select('make_name')
        .eq('id', makeId)
        .single();
        
      if (error) throw error;
      
      return data?.make_name || 'Unknown Make';
    } catch (err: any) {
      console.error('Error fetching make name:', err);
      return 'Unknown Make';
    }
  };
  
  // Function to get model name by ID
  const getModelName = async (modelId: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('model_name')
        .eq('id', modelId)
        .single();
        
      if (error) throw error;
      
      return data?.model_name || 'Unknown Model';
    } catch (err: any) {
      console.error('Error fetching model name:', err);
      return 'Unknown Model';
    }
  };
  
  return {
    makes,
    models,
    years: getYears(),
    isLoading,
    error,
    setSelectedMake,
    getMakeName,
    getModelName,
    getModelsByMakeId,
    getYears
  };
}
