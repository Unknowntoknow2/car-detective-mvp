
import { useState, useEffect } from 'react';
import { fetchVehicleData } from '@/api/vehicleApi';

export function useVehicleSelectors() {
  const [makes, setMakes] = useState<Array<{ id: string; make_name: string }>>([]);
  const [models, setModels] = useState<Array<{ id: string; model_name: string }>>([]);
  const [selectedMakeId, setSelectedMakeId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch makes on mount
  useEffect(() => {
    async function loadMakes() {
      try {
        setIsLoading(true);
        const vehicleData = await fetchVehicleData();
        
        if (vehicleData && vehicleData.makes) {
          setMakes(vehicleData.makes);
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
        const vehicleData = await fetchVehicleData();
        
        if (vehicleData && vehicleData.models) {
          // Filter models by the selected make
          const filteredModels = vehicleData.models.filter(
            model => 'make_id' in model && model.make_id === selectedMakeId
          );
          setModels(filteredModels);
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
    
    loadModels();
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
