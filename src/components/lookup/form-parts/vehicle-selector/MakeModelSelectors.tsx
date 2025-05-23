
import React from 'react';
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MakeModelSelectorsProps {
  selectedMake: string;
  setSelectedMake: (make: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  makesOpen: boolean;
  setMakesOpen: (open: boolean) => void;
  modelsOpen: boolean;
  setModelsOpen: (open: boolean) => void;
  filteredMakes: string[];
  filteredModels: string[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  modelSearchTerm: string;
  setModelSearchTerm: (term: string) => void;
  disabled?: boolean;
  required?: boolean;
  loadingModels?: boolean;
}

export const MakeModelSelectors: React.FC<MakeModelSelectorsProps> = ({
  selectedMake,
  setSelectedMake,
  selectedModel,
  setSelectedModel,
  makesOpen,
  setMakesOpen,
  modelsOpen,
  setModelsOpen,
  filteredMakes = [],
  filteredModels = [],
  searchTerm,
  setSearchTerm,
  modelSearchTerm,
  setModelSearchTerm,
  disabled = false,
  required = false,
  loadingModels = false
}) => {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      {/* Make Selector */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Make {required && <span className="text-red-500">*</span>}
        </label>
        <Popover open={makesOpen} onOpenChange={setMakesOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={makesOpen}
              className="w-full justify-between"
              disabled={disabled}
              data-testid="make-selector-button"
            >
              {selectedMake || "Select make..."}
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
                {Array.isArray(filteredMakes) && filteredMakes.length > 0 && (
                  <CommandGroup>
                    {filteredMakes.map((make) => (
                      <CommandItem
                        key={make}
                        value={make}
                        onSelect={(currentValue) => {
                          setSelectedMake(currentValue === selectedMake ? "" : currentValue);
                          setMakesOpen(false);
                          if (currentValue !== selectedMake) {
                            setSelectedModel(""); // Reset model when make changes
                          }
                        }}
                        data-testid={`make-option-${make}`}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedMake === make ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {make}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Model Selector */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model {required && <span className="text-red-500">*</span>}
        </label>
        <Popover open={modelsOpen} onOpenChange={setModelsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={modelsOpen}
              className="w-full justify-between"
              disabled={disabled || !selectedMake}
              data-testid="model-selector-button"
            >
              {selectedModel || "Select model..."}
              {loadingModels ? (
                <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              )}
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
                {loadingModels ? (
                  <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading models...
                  </div>
                ) : (
                  <>
                    <CommandEmpty>No models found.</CommandEmpty>
                    {Array.isArray(filteredModels) && filteredModels.length > 0 ? (
                      <CommandGroup>
                        {filteredModels.map((model) => (
                          <CommandItem
                            key={model}
                            value={model}
                            onSelect={(currentValue) => {
                              setSelectedModel(currentValue === selectedModel ? "" : currentValue);
                              setModelsOpen(false);
                            }}
                            data-testid={`model-option-${model}`}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedModel === model ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {model}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : (
                      selectedMake && <CommandEmpty>No models available for this make.</CommandEmpty>
                    )}
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
