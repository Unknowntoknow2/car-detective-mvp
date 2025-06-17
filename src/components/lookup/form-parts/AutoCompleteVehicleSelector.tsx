
import React from 'react';
import { VehicleSelectorWrapper } from "./vehicle-selector/VehicleSelectorWrapper";

interface AutoCompleteVehicleSelectorProps {
  selectedMake: string;
  setSelectedMake: (make: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  disabled?: boolean;
  required?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export const AutoCompleteVehicleSelector = (
  props: AutoCompleteVehicleSelectorProps,
) => {
  return (
    <VehicleSelectorWrapper>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Make {props.required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={props.selectedMake}
            onChange={(e) => props.setSelectedMake(e.target.value)}
            disabled={props.disabled}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Make</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Ford">Ford</option>
            <option value="Chevrolet">Chevrolet</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Audi">Audi</option>
            <option value="Lexus">Lexus</option>
            <option value="Acura">Acura</option>
            <option value="Infiniti">Infiniti</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model {props.required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={props.selectedModel}
            onChange={(e) => props.setSelectedModel(e.target.value)}
            disabled={props.disabled || !props.selectedMake}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Model</option>
            {props.selectedMake === 'Toyota' && (
              <>
                <option value="Camry">Camry</option>
                <option value="Corolla">Corolla</option>
                <option value="RAV4">RAV4</option>
                <option value="Highlander">Highlander</option>
                <option value="Prius">Prius</option>
              </>
            )}
            {props.selectedMake === 'Honda' && (
              <>
                <option value="Civic">Civic</option>
                <option value="Accord">Accord</option>
                <option value="CR-V">CR-V</option>
                <option value="Pilot">Pilot</option>
              </>
            )}
            {/* Add more models as needed */}
          </select>
        </div>
      </div>
    </VehicleSelectorWrapper>
  );
};
