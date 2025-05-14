
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Make = {
  id: string;
  make_name: string;
};

type Model = {
  id: string;
  model_name: string;
  make_id: string;
};

export const useVehicleSelectors = () => {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedMakeId, setSelectedMakeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch makes on component mount
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('makes')
          .select('id, make_name')
          .order('make_name');
          
        if (error) throw error;
        
        setMakes(data || []);
      } catch (err: any) {
        console.error('Error fetching makes:', err);
        setError('Failed to load vehicle makes');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMakes();
  }, []);
  
  // Fetch models when make is selected
  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedMakeId) {
        setModels([]);
        return;
      }
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('models')
          .select('id, model_name, make_id')
          .eq('make_id', selectedMakeId)
          .order('model_name');
          
        if (error) throw error;
        
        setModels(data || []);
      } catch (err: any) {
        console.error('Error fetching models:', err);
        setError('Failed to load vehicle models');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchModels();
  }, [selectedMakeId]);
  
  // Generate years
  const getYearOptions = (startYear: number) => {
    const currentYear = new Date().getFullYear() + 1; // Include next year for new models
    const years: number[] = [];
    
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }
    
    return years;
  };
  
  return {
    makes,
    models,
    selectedMakeId,
    setSelectedMakeId,
    isLoading,
    error,
    getYearOptions
  };
};
