
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Make {
  id: string;
  make_name: string;
  logo_url?: string;
  nhtsa_make_id?: number;
}

export interface Model {
  id: string;
  make_id: string;
  model_name: string;
  nhtsa_model_id?: number;
}

export const useVehicleData = () => {
  const [makes, setMakes] = useState<Make[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    const fetchMakes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First check if we have makes cached in localStorage
        const cachedMakes = localStorage.getItem('vehicle_makes');
        
        if (cachedMakes) {
          setMakes(JSON.parse(cachedMakes));
          setIsLoading(false);
          
          // Refresh in background
          refreshMakesData();
        } else {
          await refreshMakesData();
        }
      } catch (err: any) {
        console.error('Error fetching vehicle makes:', err);
        setError(err.message || 'Failed to load vehicle makes');
        setIsLoading(false);
      }
    };
    
    // Fetch models in parallel
    const fetchModels = async () => {
      try {
        const cachedModels = localStorage.getItem('vehicle_models');
        
        if (cachedModels) {
          setModels(JSON.parse(cachedModels));
          
          // Refresh in background
          refreshModelsData();
        } else {
          await refreshModelsData();
        }
      } catch (err) {
        console.error('Error fetching vehicle models:', err);
      }
    };
    
    fetchMakes();
    fetchModels();
  }, []);
  
  const refreshMakesData = async () => {
    try {
      const { data, error } = await supabase
        .from('makes')
        .select('*')
        .order('make_name');
        
      if (error) throw error;
      
      if (data) {
        setMakes(data);
        localStorage.setItem('vehicle_makes', JSON.stringify(data));
      }
    } catch (err: any) {
      console.error('Error refreshing vehicle makes:', err);
      setError(err.message || 'Failed to refresh vehicle makes');
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshModelsData = async () => {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .order('model_name');
        
      if (error) throw error;
      
      if (data) {
        setModels(data);
        localStorage.setItem('vehicle_models', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error refreshing vehicle models:', err);
    }
  };
  
  const getModelsByMake = (makeName: string): Model[] => {
    // Find the make ID for the given make name
    const make = makes.find(m => m.make_name === makeName);
    if (!make) return [];
    
    // Filter models by make ID
    return models.filter(model => model.make_id === make.id);
  };
  
  const getYearOptions = (startYear: number = 1980): number[] => {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 1; // Include next year's models
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => endYear - i
    );
  };
  
  // Fallback mock data if database is empty
  const getFallbackMakes = (): Make[] => {
    return [
      { id: '1', make_name: 'Toyota', logo_url: 'https://www.carlogos.org/car-logos/toyota-logo.png' },
      { id: '2', make_name: 'Honda', logo_url: 'https://www.carlogos.org/car-logos/honda-logo.png' },
      { id: '3', make_name: 'Ford', logo_url: 'https://www.carlogos.org/car-logos/ford-logo.png' },
      { id: '4', make_name: 'Chevrolet', logo_url: 'https://www.carlogos.org/car-logos/chevrolet-logo.png' },
      { id: '5', make_name: 'Nissan', logo_url: 'https://www.carlogos.org/car-logos/nissan-logo.png' },
      { id: '6', make_name: 'BMW', logo_url: 'https://www.carlogos.org/car-logos/bmw-logo.png' },
      { id: '7', make_name: 'Mercedes-Benz', logo_url: 'https://www.carlogos.org/car-logos/mercedes-benz-logo.png' },
      { id: '8', make_name: 'Audi', logo_url: 'https://www.carlogos.org/car-logos/audi-logo.png' },
      { id: '9', make_name: 'Lexus', logo_url: 'https://www.carlogos.org/car-logos/lexus-logo.png' },
      { id: '10', make_name: 'Hyundai', logo_url: 'https://www.carlogos.org/car-logos/hyundai-logo.png' },
      { id: '11', make_name: 'Kia', logo_url: 'https://www.carlogos.org/car-logos/kia-logo.png' },
      { id: '12', make_name: 'Subaru', logo_url: 'https://www.carlogos.org/car-logos/subaru-logo.png' },
    ];
  };
  
  // Return either database data or fallback data if the database is empty
  const getAvailableMakes = (): Make[] => {
    return makes.length > 0 ? makes : getFallbackMakes();
  };
  
  return {
    makes: getAvailableMakes(),
    getModelsByMake,
    getYearOptions,
    isLoading,
    error,
    refreshData: () => {
      refreshMakesData();
      refreshModelsData();
    }
  };
};
