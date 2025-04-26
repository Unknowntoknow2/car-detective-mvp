
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVehicleData } from '@/hooks/useVehicleData';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AutoCompleteVehicleSelectorProps {
  selectedMake: string;
  setSelectedMake: (make: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  disabled?: boolean;
  required?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export const AutoCompleteVehicleSelector: React.FC<AutoCompleteVehicleSelectorProps> = ({
  selectedMake,
  setSelectedMake,
  selectedModel,
  setSelectedModel,
  disabled = false,
  required = false,
  onValidationChange
}) => {
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

  // Handle search term change for makes
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

  // Handle search term change for models
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

  // Perform validation when required values change
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

  const handleMakeSelect = (make: string) => {
    if (make !== selectedMake) {
      setSelectedMake(make);
      setSelectedModel(''); // Reset selected model when make changes
      setModelSearchTerm('');
    }
    setMakesOpen(false);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setModelsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading vehicle data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-destructive/30 bg-destructive/10 rounded-md">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">Failed to load vehicle data</p>
            <p className="text-xs text-destructive/80 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="make">Make {required && <span className="text-destructive">*</span>}</Label>
          <Popover open={makesOpen} onOpenChange={setMakesOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={makesOpen}
                className={cn(
                  "w-full justify-between bg-white",
                  !selectedMake && "text-muted-foreground",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
                disabled={disabled}
              >
                {selectedMake
                  ? makes.find(make => make.make_name === selectedMake)?.make_name
                  : "Select make..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search make..." 
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
                <CommandList>
                  <CommandEmpty>No makes found.</CommandEmpty>
                  <CommandGroup>
                    {filteredMakes.map(make => (
                      <CommandItem
                        key={make.id}
                        value={make.make_name}
                        onSelect={(value) => handleMakeSelect(value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedMake === make.make_name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex items-center">
                          {make.logo_url && (
                            <img 
                              src={make.logo_url} 
                              alt={`${make.make_name} logo`} 
                              className="h-5 w-5 mr-2 object-contain"
                            />
                          )}
                          {make.make_name}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model {required && <span className="text-destructive">*</span>}</Label>
          <Popover open={modelsOpen} onOpenChange={setModelsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={modelsOpen}
                className={cn(
                  "w-full justify-between bg-white",
                  !selectedModel && "text-muted-foreground",
                  (disabled || !selectedMake) && "opacity-50 cursor-not-allowed"
                )}
                disabled={disabled || !selectedMake}
              >
                {selectedModel || "Select model..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search model..." 
                  value={modelSearchTerm}
                  onValueChange={setModelSearchTerm}
                />
                <CommandList>
                  <CommandEmpty>No models found.</CommandEmpty>
                  <CommandGroup>
                    {filteredModels.map(model => (
                      <CommandItem
                        key={model.id}
                        value={model.model_name}
                        onSelect={(value) => handleModelSelect(value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedModel === model.model_name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {model.model_name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {validationError && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}
