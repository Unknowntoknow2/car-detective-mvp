
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Make, Model } from './types/vehicle';

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
        
        // Transform the data to match the Make type
        const transformedMakes: Make[] = (data || []).map(item => ({
          id: item.id,
          make_name: item.make_name,
          logo_url: null,
          country_of_origin: null,
          // Ensure nhtsa_make_id is null or a number, not a string
          nhtsa_make_id: item.make_id ? Number(item.make_id) : null
        }));
        
        setMakes(transformedMakes);
        console.log(`Loaded ${transformedMakes.length || 0} makes`);
      } catch (err) {
        console.error('Error fetching makes:', err);
        setError('Failed to load vehicle makes');
        toast.error('Failed to load vehicle makes');
        // Make sure we set empty array on error
        setMakes([]);
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
        
        // Ensure we're using the proper ID format for the query
        const makeIdParam = selectedMakeId;
        
        const { data, error } = await supabase
          .from('models')
          .select('*')
          .eq('make_id', makeIdParam)
          .order('model_name');
        
        if (error) throw error;
        
        // Transform the data to match the Model type
        const transformedModels: Model[] = (data || []).map(item => ({
          id: item.id,
          make_id: String(item.make_id), // Ensure it's a string
          model_name: item.model_name,
          nhtsa_model_id: null,
          popular: false // Add the missing property
        }));
        
        setModels(transformedModels);
        console.log(`Loaded ${transformedModels.length || 0} models for make ${selectedMakeId}`);
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('Failed to load vehicle models');
        toast.error('Failed to load vehicle models');
        // Make sure we set empty array on error
        setModels([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadModels();
  }, [selectedMakeId]);

  // Define the ModelTrim type
  type ModelTrim = {
    id: string;
    model_id: string;
    trim_name: string;
    engine_type: string | null;
  };

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
        
        // Ensure we set an empty array if data is null or undefined
        setTrims(data || []);
        console.log(`Loaded ${data?.length || 0} trims for model ${selectedModelId}`);
      } catch (err) {
        console.error('Error fetching trims:', err);
        setError('Failed to load vehicle trims');
        toast.error('Failed to load vehicle trims');
        // Make sure we set empty array on error
        setTrims([]);
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
  
  // Add a utility function for getting year options
  const getYearOptions = (startYear: number = 1990) => {
    const currentYear = new Date().getFullYear() + 1; // Include next year's models
    const years: number[] = [];
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
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
    error,
    getYearOptions,
    // Add a counts property for VehicleDataInfo component
    counts: {
      makes: makes.length,
      models: models.length
    }
  };
}
