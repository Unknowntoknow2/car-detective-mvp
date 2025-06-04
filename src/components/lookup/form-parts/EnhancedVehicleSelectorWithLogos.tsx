<<<<<<< HEAD

import { useState, useEffect, useCallback } from 'react';
import { useVehicleData, MakeData, ModelData } from '@/hooks/useVehicleData';
import { ComboBox } from '@/components/ui/combobox';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocalization } from '@/i18n/useLocalization';
import { errorHandler } from '@/utils/error-handling';
import EnhancedErrorBoundary from '@/components/common/EnhancedErrorBoundary';
=======
import { useEffect, useState } from "react";
import { useVehicleData } from "@/hooks/useVehicleData";
import { ComboBox } from "@/components/ui/combobox";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalization } from "@/i18n/useLocalization";
import { errorHandler } from "@/utils/error-handling";
import EnhancedErrorBoundary from "@/components/common/EnhancedErrorBoundary";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface EnhancedVehicleSelectorWithLogosProps {
  selectedMake: string;
  onMakeChange: (make: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
  required?: boolean;
  onValidChange?: (isValid: boolean) => void;
}

export function EnhancedVehicleSelectorWithLogos({
  selectedMake,
  onMakeChange,
  selectedModel,
  onModelChange,
  disabled = false,
  required = false,
  onValidChange,
}: EnhancedVehicleSelectorWithLogosProps) {
  const { makes, getModelsByMake, isLoading, error } = useVehicleData();
  const [modelOptions, setModelOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const { t, isRTL } = useLocalization();
<<<<<<< HEAD
  const [hasModels, setHasModels] = useState(false);
  
=======

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  // Validate selection and notify parent if necessary
  useEffect(() => {
    if (onValidChange) {
      const isValid = !required || (!!selectedMake && !!selectedModel);
      onValidChange(isValid);
    }
  }, [selectedMake, selectedModel, required, onValidChange]);

  // Memoized function to fetch models - this avoids recreating the function on every render
  const fetchModels = useCallback(async (makeName: string) => {
    if (!makeName) return [];
    
    try {
      setLoadingModels(true);
      const fetchedModels = await getModelsByMake(makeName);
      const safeModels = Array.isArray(fetchedModels) ? fetchedModels : [];
      
      const mappedModels = safeModels.map(model => ({
        value: model.model_name,
        label: model.model_name
      }));
      
      setHasModels(mappedModels.length > 0);
      return mappedModels;
    } catch (error) {
      errorHandler.handle(error, 'VehicleSelector.fetchModels');
      return [];
    } finally {
      setLoadingModels(false);
    }
  }, [getModelsByMake]);

  // Effect to update model options when make changes
  useEffect(() => {
<<<<<<< HEAD
    let mounted = true;
    
    if (!selectedMake) {
      setModelOptions([]);
      setHasModels(false);
      // Clear model when make is cleared
      if (selectedModel) {
        onModelChange('');
=======
    console.log(
      "EnhancedVehicleSelectorWithLogos: Make changed to:",
      selectedMake,
    );

    async function fetchModels() {
      if (selectedMake) {
        try {
          setLoadingModels(true);
          const fetchedModels = await getModelsByMake(selectedMake);
          const safeModels = Array.isArray(fetchedModels) ? fetchedModels : [];
          const mappedModels = safeModels.map((model) => ({
            value: model.model_name,
            label: model.model_name,
          }));
          console.log(
            `EnhancedVehicleSelectorWithLogos: Found ${mappedModels.length} models for make ${selectedMake}`,
          );
          setModelOptions(mappedModels);
        } catch (error) {
          errorHandler.handle(error, "VehicleSelector.fetchModels");
          setModelOptions([]);
        } finally {
          setLoadingModels(false);
        }
      } else {
        console.log(
          "EnhancedVehicleSelectorWithLogos: No make selected, clearing models",
        );
        setModelOptions([]);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      }
      return;
    }
<<<<<<< HEAD
    
    const updateModels = async () => {
      const models = await fetchModels(selectedMake);
      
      if (mounted) {
        setModelOptions(models);
        
        // If current model is not in new options, reset it
        if (selectedModel && !models.some(model => model.value === selectedModel)) {
          onModelChange('');
        }
      }
    };
    
    updateModels();
    
    return () => {
      mounted = false;
    };
  }, [selectedMake, fetchModels, selectedModel, onModelChange]);
=======

    fetchModels();
  }, [selectedMake, getModelsByMake]);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

  if (isLoading) {
    return (
      <div
        className="space-y-4"
        aria-busy="true"
        aria-label={t(
          "vehicle.selector.loadingMakes",
          "Loading vehicle makes...",
        )}
      >
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50">
        <p className="text-red-700 text-sm">
          {t("common.errors.dataLoad", "Failed to load vehicle data")}
        </p>
        <p className="text-red-600 text-xs mt-1">
          {typeof error === "string" ? error : "Unknown error"}
        </p>
      </div>
    );
  }

<<<<<<< HEAD
  // Map MakeData objects to ComboBox items
  const makesOptions = Array.isArray(makes) ? makes.map(make => ({
    value: make.make_name,
    label: make.make_name,
  })) : [];

  const handleMakeChange = (make: string) => {
    onMakeChange(make);
  };

  const handleModelChange = (model: string) => {
=======
  // Ensure makes is properly mapped to ComboBox items
  const makesOptions = Array.isArray(makes)
    ? makes.map((make) => ({
      value: make.make_name,
      label: make.make_name,
      icon: make.logo_url,
    }))
    : [];

  const handleMakeChange = (make: string) => {
    console.log(
      "EnhancedVehicleSelectorWithLogos: Make selection changed to:",
      make,
    );
    onMakeChange(make);
    // Reset model when make changes
    onModelChange("");
  };

  const handleModelChange = (model: string) => {
    console.log(
      "EnhancedVehicleSelectorWithLogos: Model selection changed to:",
      model,
    );
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    onModelChange(model);
  };

  return (
    <EnhancedErrorBoundary context="VehicleSelector">
      <div className={`space-y-4 ${isRTL ? "rtl" : "ltr"}`}>
        <div className="space-y-2">
          <label
            htmlFor="make"
            className="text-sm font-medium flex items-center"
          >
            {t("vehicle.selector.makeLabel", "Make")}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          <ComboBox
            items={makesOptions}
            value={selectedMake}
            onChange={handleMakeChange}
            placeholder={t("vehicle.selector.makePlaceholder", "Select a make")}
            emptyText={t("vehicle.selector.noMakesFound", "No makes found")}
            disabled={disabled}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="model"
            className="text-sm font-medium flex items-center"
          >
            {t("vehicle.selector.modelLabel", "Model")}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>

          <ComboBox
            items={modelOptions}
            value={selectedModel}
            onChange={handleModelChange}
<<<<<<< HEAD
            placeholder={
              selectedMake 
                ? (loadingModels 
                  ? t('vehicle.selector.loadingModels', 'Loading models...') 
                  : t('vehicle.selector.modelPlaceholder', 'Select a model')
                ) 
                : t('vehicle.selector.selectMakeFirst', 'Select a make first')
            }
            emptyText={
              loadingModels
                ? t('vehicle.selector.loadingModels', 'Loading models...')
                : (selectedMake
                  ? (hasModels 
                    ? t('vehicle.selector.noModelsFound', 'No models found')
                    : t('vehicle.selector.noModelsAvailable', 'No models available for this make'))
                  : t('vehicle.selector.selectMakeFirst', 'Select a make first'))
            }
=======
            placeholder={selectedMake
              ? (loadingModels
                ? t("vehicle.selector.loadingModels", "Loading models...")
                : t("vehicle.selector.modelPlaceholder", "Select a model"))
              : t("vehicle.selector.selectMakeFirst", "Select a make first")}
            emptyText={t("vehicle.selector.noModelsFound", "No models found")}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
            disabled={!selectedMake || disabled || loadingModels}
            className="w-full"
          />
        </div>
      </div>
    </EnhancedErrorBoundary>
  );
}

export default EnhancedVehicleSelectorWithLogos;
