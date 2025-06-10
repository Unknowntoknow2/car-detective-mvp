
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
  makesOpen: boolean;
  setMakesOpen: (open: boolean) => void;
  modelsOpen: boolean;
  setModelsOpen: (open: boolean) => void;
  filteredMakes: any[];
  filteredModels: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  modelSearchTerm: string;
  setModelSearchTerm: (term: string) => void;
  validationError: string | null;
  loadingModels: boolean;
}

interface UseVehicleSelectorProps {
  selectedMake: string;
  setSelectedMake: (make: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  required?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export function useVehicleSelector(props?: UseVehicleSelectorProps): UseVehicleSelectorReturn {
  const { makes, models, isLoading, error } = useMakeModels();
  const [selectedMakeId, setSelectedMakeId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [makesOpen, setMakesOpen] = useState(false);
  const [modelsOpen, setModelsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modelSearchTerm, setModelSearchTerm] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loadingModels, setLoadingModels] = useState(false);

  // Filter makes based on search term
  const filteredMakes = makes.filter(make => 
    make.make_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter models based on search term
  const filteredModels = models.filter(model => 
    model.model_name?.toLowerCase().includes(modelSearchTerm.toLowerCase())
  );

  // Validation
  useEffect(() => {
    if (props?.required) {
      if (!selectedMakeId) {
        setValidationError('Make is required');
        props.onValidationChange?.(false);
      } else if (!selectedModelId) {
        setValidationError('Model is required');
        props.onValidationChange?.(false);
      } else {
        setValidationError(null);
        props.onValidationChange?.(true);
      }
    }
  }, [selectedMakeId, selectedModelId, props]);

  return {
    makes,
    models,
    selectedMakeId,
    selectedModelId,
    setSelectedMakeId,
    setSelectedModelId,
    isLoading,
    error,
    makesOpen,
    setMakesOpen,
    modelsOpen,
    setModelsOpen,
    filteredMakes,
    filteredModels,
    searchTerm,
    setSearchTerm,
    modelSearchTerm,
    setModelSearchTerm,
    validationError,
    loadingModels,
  };
}
