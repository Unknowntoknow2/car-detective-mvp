
import { useVehicleSelector } from "@/hooks/useVehicleSelector";
import { LoadingMessage } from "./LoadingMessage";
import { ErrorMessage } from "./ErrorMessage";
import { MakeModelSelectors } from "./MakeModelSelectors";
import { ValidationMessage } from "./ValidationMessage";

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
  onValidationChange,
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
    loadingModels,
    models,
  } = useVehicleSelector({
    selectedMake,
    setSelectedMake,
    selectedModel,
    setSelectedModel,
    required,
    onValidationChange,
  });

  if (isLoading) {
    return <LoadingMessage />;
  }

  if (error) {
    const errorMessage = typeof error === "string" ? error : String(error);
    return <ErrorMessage error={errorMessage} />;
  }

  const handleMakeChange = (make: string) => {
    setSelectedMake(make);
    setSelectedModel('');
  };

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
        filteredMakes={filteredMakes || []}
        filteredModels={filteredModels || []}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        modelSearchTerm={modelSearchTerm}
        setModelSearchTerm={setModelSearchTerm}
        disabled={disabled}
        required={required}
        loadingModels={loadingModels}
        hasModels={hasModels}
      />
      <ValidationMessage error={validationError} />
    </div>
  );
};
