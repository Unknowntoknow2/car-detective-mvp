
import { useState, useEffect, useCallback } from 'react';
import { fetchVehicleDetails } from '@/api/vehicleApi';

interface Make {
  id: string;
  make_name: string;
  logo_url?: string;
}

interface Model {
  id: string;
  model_name: string;
  make_id: string;
}

interface VehicleCounts {
  makes: number;
  models: number;
}

export const useVehicleData = (vin?: string | null) => {
  const [vehicle, setVehicle] = useState(null);
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [counts, setCounts] = useState<VehicleCounts>({ makes: 0, models: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch vehicle details by VIN
  useEffect(() => {
    const getVehicleData = async () => {
      if (!vin) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchVehicleDetails(vin);
        setVehicle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch vehicle data');
        console.error('Error fetching vehicle data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getVehicleData();
  }, [vin]);

  // Function to refresh vehicle data (makes and models)
  const refreshData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate fetching makes and models from an API
      // In a real implementation, this would call an actual API
      setTimeout(() => {
        const sampleMakes: Make[] = [
          { id: '1', make_name: 'Toyota', logo_url: 'https://example.com/toyota.png' },
          { id: '2', make_name: 'Honda', logo_url: 'https://example.com/honda.png' },
          { id: '3', make_name: 'Ford', logo_url: 'https://example.com/ford.png' },
          { id: '4', make_name: 'Chevrolet', logo_url: 'https://example.com/chevrolet.png' },
          { id: '5', make_name: 'BMW', logo_url: 'https://example.com/bmw.png' },
        ];
        
        const sampleModels: Model[] = [
          { id: '1', model_name: 'Camry', make_id: '1' },
          { id: '2', model_name: 'Corolla', make_id: '1' },
          { id: '3', model_name: 'Civic', make_id: '2' },
          { id: '4', model_name: 'Accord', make_id: '2' },
          { id: '5', model_name: 'F-150', make_id: '3' },
        ];
        
        setMakes(sampleMakes);
        setModels(sampleModels);
        setCounts({ makes: sampleMakes.length, models: sampleModels.length });
        setIsLoading(false);
      }, 500);
      
      return { 
        success: true, 
        makeCount: 5, 
        modelCount: 10 
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh vehicle data');
      console.error('Error refreshing vehicle data:', err);
      setIsLoading(false);
      return { success: false, makeCount: 0, modelCount: 0 };
    }
  }, []);

  // Get models by make ID
  const getModelsByMake = useCallback(async (makeName: string) => {
    try {
      // In a real implementation, this would filter models from the API
      // For now, just return sample data
      return models.filter(model => {
        const makeId = makes.find(m => m.make_name === makeName)?.id;
        return model.make_id === makeId;
      });
    } catch (err) {
      console.error('Error getting models by make:', err);
      return [];
    }
  }, [makes, models]);

  // Get year options for vehicle selection
  const getYearOptions = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear + 1; year >= 1990; year--) {
      years.push(year);
    }
    return years;
  }, []);

  // Initialize data on first load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return { 
    vehicle, 
    makes, 
    models, 
    counts, 
    isLoading, 
    error, 
    refreshData, 
    getModelsByMake,
    getYearOptions 
  };
};
