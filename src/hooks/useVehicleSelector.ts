
import { useState, useEffect } from 'react';
import { useMakeModels } from './useMakeModels';

export interface UseVehicleSelectorReturn {
  makes: any[];
  models: any[];
  selectedMakeId: string;
  selectedModelId: string;
  setSelectedMakeId: (id: string) => void;
  setSelectedModelId: (id: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function useVehicleSelector(): UseVehicleSelectorReturn {
  const { makes, models, isLoading, error } = useMakeModels();
  const [selectedMakeId, setSelectedMakeId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');

  return {
    makes,
    models,
    selectedMakeId,
    selectedModelId,
    setSelectedMakeId,
    setSelectedModelId,
    isLoading,
    error
  };
}
