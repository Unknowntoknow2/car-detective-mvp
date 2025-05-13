
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MakeModel {
  id: number;
  name: string;
}

export function useVehicleDBData() {
  const [makes, setMakes] = useState<MakeModel[]>([]);
  const [models, setModels] = useState<MakeModel[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMake, setSelectedMake] = useState<number | null>(null);
  
  // Fetch makes
  useEffect(() => {
    async function fetchMakes() {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('makes')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        setMakes(data || []);
      } catch (err) {
        console.error('Error fetching makes:', err);
        setError('Failed to load vehicle makes');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMakes();
  }, []);
  
  // Fetch models when make changes
  useEffect(() => {
    async function fetchModels() {
      if (!selectedMake) {
        setModels([]);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('models')
          .select('id, name')
          .eq('make_id', selectedMake)
          .order('name');
          
        if (error) throw error;
        
        setModels(data || []);
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('Failed to load vehicle models');
      } finally {
        setLoading(false);
      }
    }
    
    fetchModels();
  }, [selectedMake]);
  
  // Fetch years (this could be based on make/model or static range)
  useEffect(() => {
    function generateYears() {
      const currentYear = new Date().getFullYear();
      const yearsList = [];
      for (let year = currentYear; year >= currentYear - 20; year--) {
        yearsList.push(year);
      }
      setYears(yearsList);
    }
    
    generateYears();
  }, []);
  
  // Function to get make name by ID
  const getMakeName = async (makeId: number): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('makes')
        .select('name')
        .eq('id', makeId)
        .single();
        
      if (error) throw error;
      
      return data?.name || 'Unknown Make';
    } catch (err) {
      console.error('Error fetching make name:', err);
      return 'Unknown Make';
    }
  };
  
  // Function to get model name by ID
  const getModelName = async (modelId: number): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('name')
        .eq('id', modelId)
        .single();
        
      if (error) throw error;
      
      return data?.name || 'Unknown Model';
    } catch (err) {
      console.error('Error fetching model name:', err);
      return 'Unknown Model';
    }
  };
  
  return {
    makes,
    models,
    years,
    loading,
    error,
    setSelectedMake,
    getMakeName,
    getModelName
  };
}
