
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Make = {
  id: string;
  make_name: string;
  logo_url: string | null;
  country_of_origin: string | null;
};

export type Model = {
  id: string;
  model_name: string;
  make_id: string;
  popular: boolean;
};

export type ModelTrim = {
  id: string;
  model_id: string;
  trim_name: string;
  engine_type: string | null;
};

export function useVehicleSelectors() {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [trims, setTrims] = useState<ModelTrim[]>([]);
  const [selectedMakeId, setSelectedMakeId] = useState<string>('');
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch makes on mount
  useEffect(() => {
    async function loadMakes() {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('makes')
          .select('*')
          .order('make_name');
        
        if (error) throw error;
        
        if (data) {
          setMakes(data);
          console.log(`Loaded ${data.length} makes`);
        }
      } catch (err) {
        console.error('Error fetching makes:', err);
        setError('Failed to load vehicle makes');
        toast.error('Failed to load vehicle makes');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadMakes();
  }, []);

  // Fetch models when make is selected
  useEffect(() => {
    async function loadModels() {
      if (!selectedMakeId) {
        setModels([]);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('models')
          .select('*')
          .eq('make_id', selectedMakeId)
          .order('model_name');
        
        if (error) throw error;
        
        if (data) {
          setModels(data);
          console.log(`Loaded ${data.length} models for make ${selectedMakeId}`);
        }
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('Failed to load vehicle models');
        toast.error('Failed to load vehicle models');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadModels();
  }, [selectedMakeId]);

  // Fetch trims when model is selected
  useEffect(() => {
    async function loadTrims() {
      if (!selectedModelId) {
        setTrims([]);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('model_trims')
          .select('*')
          .eq('model_id', selectedModelId)
          .order('trim_name');
        
        if (error) throw error;
        
        if (data) {
          setTrims(data);
          console.log(`Loaded ${data.length} trims for model ${selectedModelId}`);
        }
      } catch (err) {
        console.error('Error fetching trims:', err);
        setError('Failed to load vehicle trims');
        toast.error('Failed to load vehicle trims');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadTrims();
  }, [selectedModelId]);

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    setTrims([]); // Clear trims when model changes
  };

  return {
    makes,
    models,
    trims,
    selectedMakeId,
    selectedModelId,
    setSelectedMakeId,
    setSelectedModelId: handleModelSelect,
    isLoading,
    error
  };
}
