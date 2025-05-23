
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
    loadingModels
  } = useVehicleSelector({
    selectedMake,
    setSelectedMake,
    selectedModel,
    setSelectedModel,
    required,
    onValidationChange
  });

  if (isLoading) {
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

  return (
    <div className="space-y-4">
      <MakeModelSelectors
        selectedMake={selectedMake}
        setSelectedMake={setSelectedMake}
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
      />
      <ValidationMessage error={validationError} />
    </div>
  );
};
