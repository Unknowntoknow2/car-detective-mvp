
import { useState, useEffect } from 'react';
import { useVehicleData, MakeData, ModelData } from '@/hooks/useVehicleData';

interface UseVehicleSelectorProps {
  selectedMake: string;
  setSelectedMake: (make: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  required?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export const useVehicleSelector = ({
  selectedMake,
  setSelectedMake,
  selectedModel,
  setSelectedModel,
  required = false,
  onValidationChange
}: UseVehicleSelectorProps) => {
  const { makes, getModelsByMake, isLoading, error } = useVehicleData();
  const [makesOpen, setMakesOpen] = useState(false);
  const [modelsOpen, setModelsOpen] = useState(false);
  const [filteredMakes, setFilteredMakes] = useState<MakeData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modelSearchTerm, setModelSearchTerm] = useState('');
  const [models, setModels] = useState<ModelData[]>([]);
  const [filteredModels, setFilteredModels] = useState<ModelData[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [loadingModels, setLoadingModels] = useState(false);

  // Initialize filtered makes list
  useEffect(() => {
    if (makes.length > 0) {
      setFilteredMakes(makes);
    }
  }, [makes]);

  // Get models for selected make
  useEffect(() => {
    async function fetchModels() {
      if (selectedMake) {
        try {
          setLoadingModels(true);
          console.log('Fetching models for make:', selectedMake);
          const availableModels = await getModelsByMake(selectedMake);
          console.log('Models fetched:', availableModels);
          setModels(availableModels);
          setFilteredModels(availableModels);
        } catch (error) {
          console.error("Error fetching models:", error);
          setModels([]);
          setFilteredModels([]);
        } finally {
          setLoadingModels(false);
        }
      } else {
        setModels([]);
        setFilteredModels([]);
      }
    }
    
    fetchModels();
  }, [selectedMake, getModelsByMake]);

  // Handle search terms for makes
  useEffect(() => {
    if (searchTerm) {
      const filtered = makes.filter(make => 
        make.make_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMakes(filtered);
    } else {
      setFilteredMakes(makes);
    }
  }, [searchTerm, makes]);

  // Handle search terms for models
  useEffect(() => {
    if (modelSearchTerm) {
      const filtered = models.filter(model => 
        model.model_name.toLowerCase().includes(modelSearchTerm.toLowerCase())
      );
      setFilteredModels(filtered);
    } else {
      setFilteredModels(models);
    }
  }, [modelSearchTerm, models]);

  // Validation
  useEffect(() => {
    let error = null;
    if (required) {
      if (!selectedMake) {
        error = "Make is required";
      } else if (!selectedModel) {
        error = "Model is required";
      }
    }
    
    setValidationError(error);
    
    if (onValidationChange) {
      onValidationChange(error === null);
    }
  }, [selectedMake, selectedModel, required, onValidationChange]);

  return {
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
    loadingModels
  };
};
