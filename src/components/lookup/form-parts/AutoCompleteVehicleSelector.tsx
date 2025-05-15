// src/components/lookup/manual/form-parts/AutoCompleteVehicleSelector.tsx

import { VehicleSelectorWrapper } from './vehicle-selector/VehicleSelectorWrapper';

interface AutoCompleteVehicleSelectorProps {
  selectedMake: string;
  setSelectedMake: (make: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  disabled?: boolean;
  required?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export const AutoCompleteVehicleSelector = (props: AutoCompleteVehicleSelectorProps) => {
  return <VehicleSelectorWrapper {...props} />;
};
