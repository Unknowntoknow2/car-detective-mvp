
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useVehicleSelectors() {
  const [makes, setMakes] = useState<Array<{ id: string; make_name: string }>>([]);
  const [models, setModels] = useState<Array<{ id: string; model_name: string }>>([]);
  const [selectedMakeId, setSelectedMakeId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch makes on mount
  useEffect(() => {
    async function fetchMakes() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('makes')
          .select('id, make_name')
          .order('make_name');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Ensure data has the correct structure
          const formattedMakes = data.map(make => ({
            id: make.id,
            make_name: make.make_name || make.make || ''
          }));
          setMakes(formattedMakes);
        } else {
          setMakes([]);
        }
      } catch (err) {
        console.error('Error fetching makes:', err);
        setError('Failed to load vehicle makes');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMakes();
  }, []);

  // Fetch models when make is selected
  useEffect(() => {
    async function fetchModels() {
      if (!selectedMakeId) {
        setModels([]);
        return;
      }
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('models')
          .select('id, model_name')
          .eq('make_id', selectedMakeId)
          .order('model_name');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Ensure data has the correct structure
          const formattedModels = data.map(model => ({
            id: model.id,
            model_name: model.model_name || model.model || ''
          }));
          setModels(formattedModels);
        } else {
          setModels([]);
        }
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('Failed to load vehicle models');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchModels();
  }, [selectedMakeId]);

  return {
    makes,
    models,
    selectedMakeId,
    setSelectedMakeId,
    isLoading,
    error
  };
}
