
import { useState, useEffect } from 'react';
import { useVehicleData } from '@/hooks/useVehicleData';

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
  const [filteredMakes, setFilteredMakes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modelSearchTerm, setModelSearchTerm] = useState('');
  const [models, setModels] = useState<any[]>([]);
  const [filteredModels, setFilteredModels] = useState<any[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize filtered makes list
  useEffect(() => {
    if (makes.length > 0) {
      setFilteredMakes(makes);
    }
  }, [makes]);

  // Get models for selected make
  useEffect(() => {
    if (selectedMake) {
      const availableModels = getModelsByMake(selectedMake);
      setModels(availableModels);
      setFilteredModels(availableModels);
    } else {
      setModels([]);
      setFilteredModels([]);
    }
  }, [selectedMake, getModelsByMake]);

  // Handle search terms
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
    validationError
  };
};
