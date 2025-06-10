
import { useState, useEffect } from 'react';
import { Make, Model } from '@/hooks/types/vehicle';

interface UseMakeModelsReturn {
  makes: Make[];
  models: Model[];
  isLoading: boolean;
  error: string | null;
  fetchModelsByMakeId: (makeId: string) => Promise<void>;
  findMakeById: (makeId: string) => Make | undefined;
  findModelById: (modelId: string) => Model | undefined;
}

export function useMakeModels(): UseMakeModelsReturn {
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  useEffect(() => {
    setMakes([
      { id: '1', make_name: 'Toyota', popular: true },
      { id: '2', make_name: 'Honda', popular: true },
      { id: '3', make_name: 'Ford', popular: true },
      { id: '4', make_name: 'Chevrolet', popular: true },
      { id: '5', make_name: 'BMW', popular: false },
    ]);
  }, []);

  const fetchModelsByMakeId = async (makeId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock model data based on make
      const mockModels: Model[] = [
        { id: '1', make_id: makeId, model_name: 'Camry', popular: true },
        { id: '2', make_id: makeId, model_name: 'Corolla', popular: true },
        { id: '3', make_id: makeId, model_name: 'RAV4', popular: true },
      ];
      
      setModels(mockModels);
    } catch (err) {
      setError('Failed to fetch models');
    } finally {
      setIsLoading(false);
    }
  };

  const findMakeById = (makeId: string): Make | undefined => {
    return makes.find(make => make.id === makeId);
  };

  const findModelById = (modelId: string): Model | undefined => {
    return models.find(model => model.id === modelId);
  };

  return {
    makes,
    models,
    isLoading,
    error,
    fetchModelsByMakeId,
    findMakeById,
    findModelById,
  };
}
