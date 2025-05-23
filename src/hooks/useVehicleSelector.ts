
import { useState, useEffect, useRef, useCallback } from 'react';
import { useVehicleData, MakeData, ModelData } from '@/hooks/useVehicleData';
import { toast } from 'sonner';

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
  
  const modelFetchTimeout = useRef<NodeJS.Timeout | null>(null);
  const modelsInitialized = useRef(false);
  const fetchAttempts = useRef(0);
  const maxFetchAttempts = 3;

  // Initialize filtered makes list
  useEffect(() => {
    if (makes.length > 0) {
      setFilteredMakes(makes);
    }
  }, [makes]);

  // Debounced fetch of models to prevent excessive API calls
  const debouncedFetchModels = useCallback(async (makeName: string) => {
    if (!makeName) {
      setModels([]);
      setFilteredModels([]);
      modelsInitialized.current = false;
      return;
    }
    
    try {
      setLoadingModels(true);
      
      // Clear any existing timeout
      if (modelFetchTimeout.current) {
        clearTimeout(modelFetchTimeout.current);
      }
      
      // Set a timeout to avoid rapid repeated calls
      modelFetchTimeout.current = setTimeout(async () => {
        // Check if we've exceeded the maximum fetch attempts
        if (fetchAttempts.current >= maxFetchAttempts) {
          console.log(`Exceeded max fetch attempts (${maxFetchAttempts}) for ${makeName}`);
          setLoadingModels(false);
          
          // Only show toast for first error
          if (fetchAttempts.current === maxFetchAttempts) {
            toast.error("Having trouble loading models. Using fallback data.", {
              id: "model-fetch-error",
              duration: 3000
            });
          }
          
          return;
        }
        
        fetchAttempts.current++;
        console.log(`Fetching models for make: ${makeName} (attempt ${fetchAttempts.current})`);
        
        const availableModels = await getModelsByMake(makeName);
        
        // Reset fetch attempts on success
        if (availableModels.length > 0) {
          fetchAttempts.current = 0;
        }
        
        setModels(availableModels);
        setFilteredModels(availableModels);
        modelsInitialized.current = true;
        
        // If current selected model is not in the list of available models, reset it
        if (selectedModel && !availableModels.some(model => model.model_name === selectedModel)) {
          console.log('Resetting model because current selection is not in models list');
          setSelectedModel('');
        }
        
        setLoadingModels(false);
      }, 200);
    } catch (error) {
      console.error("Error in debouncedFetchModels:", error);
      setLoadingModels(false);
      
      // Show toast only on the first error
      if (fetchAttempts.current <= 1) {
        toast.error("Error loading models. Please try again.", {
          id: "model-fetch-error",
          duration: 3000
        });
      }
      
      setModels([]);
      setFilteredModels([]);
    }
  }, [getModelsByMake, selectedModel, setSelectedModel]);

  // Get models for selected make
  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedMake) {
        setModels([]);
        setFilteredModels([]);
        modelsInitialized.current = false;
        return;
      }
      
      await debouncedFetchModels(selectedMake);
    };
    
    fetchModels();
    
    return () => {
      if (modelFetchTimeout.current) {
        clearTimeout(modelFetchTimeout.current);
      }
    };
  }, [selectedMake, debouncedFetchModels]);

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

  // Open models dropdown when models are loaded and user has selected a make
  useEffect(() => {
    if (selectedMake && models.length > 0 && !selectedModel && !modelsOpen && !loadingModels) {
      // Delay opening to avoid rapid UI changes
      const timer = setTimeout(() => {
        setModelsOpen(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [selectedMake, models.length, selectedModel, modelsOpen, loadingModels]);

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
    loadingModels,
    models,
    fetchAttempts: fetchAttempts.current
  };
};
