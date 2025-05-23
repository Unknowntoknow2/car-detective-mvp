
import { useState, useEffect } from 'react';
import { useVehicleSelector } from '@/hooks/useVehicleSelector';
import { LoadingMessage } from './LoadingMessage';
import { ErrorMessage } from './ErrorMessage';
import { MakeModelSelectors } from './MakeModelSelectors';
import { ValidationMessage } from './ValidationMessage';

interface VehicleSelectorWrapperProps {
  selectedMake: string;
  setSelectedMake: (make: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  disabled?: boolean;
  required?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export const VehicleSelectorWrapper = ({
  selectedMake,
  setSelectedMake,
  selectedModel,
  setSelectedModel,
  disabled = false,
  required = false,
  onValidationChange
}: VehicleSelectorWrapperProps) => {
  const [attempts, setAttempts] = useState(0);
  const [forcedRender, setForcedRender] = useState(0);

  const {
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
    fetchAttempts
  } = useVehicleSelector({
    selectedMake,
    setSelectedMake,
    selectedModel,
    setSelectedModel,
    required,
    onValidationChange
  });

  // Force a re-render if we've exceeded fetch attempts to ensure fallback data is used
  useEffect(() => {
    if (fetchAttempts > 2 && selectedMake && !loadingModels && models.length === 0) {
      // Force a re-render to ensure everything is correctly wired up
      const timer = setTimeout(() => {
        setForcedRender(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [fetchAttempts, selectedMake, loadingModels, models.length]);

  if (isLoading && attempts < 2) {
    // After 2 attempts, we'll show the UI even if it's still loading
    // This prevents an infinite loading state
    setTimeout(() => setAttempts(prev => prev + 1), 1000);
    return <LoadingMessage />;
  }

  if (error) {
    // Convert any error to string safely
    const errorMessage = typeof error === 'string' ? error : String(error);
    return <ErrorMessage error={errorMessage} />;
  }

  // Convert MakeData objects to make names (strings) for the MakeModelSelectors component
  const makeNames = filteredMakes.map(make => make.make_name);
  
  // Get model names for the selector
  const modelNames = filteredModels.map(model => model.model_name);

  const handleMakeChange = (make: string) => {
    setSelectedMake(make);
    setSelectedModel(''); // Always reset model when make changes
  };

  // Check if models are available for the selected make
  const hasModels = models && models.length > 0;

  return (
    <div className="space-y-4">
      <MakeModelSelectors
        selectedMake={selectedMake}
        setSelectedMake={handleMakeChange}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        makesOpen={makesOpen}
        setMakesOpen={setMakesOpen}
        modelsOpen={modelsOpen}
        setModelsOpen={setModelsOpen}
        filteredMakes={makeNames}
        filteredModels={modelNames}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        modelSearchTerm={modelSearchTerm}
        setModelSearchTerm={setModelSearchTerm}
        disabled={disabled}
        required={required}
        loadingModels={loadingModels}
        hasModels={hasModels}
        forcedRender={forcedRender}
      />
      <ValidationMessage error={validationError} />
    </div>
  );
};
