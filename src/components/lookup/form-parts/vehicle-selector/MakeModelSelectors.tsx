
import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  hasModels?: boolean;
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
  filteredMakes,
  filteredModels,
  searchTerm,
  setSearchTerm,
  modelSearchTerm,
  setModelSearchTerm,
  disabled = false,
  required = false,
  loadingModels = false,
  hasModels = false
}) => {
  return (
    <div className="flex flex-col space-y-4">
      {/* Make Selector */}
      <div className="space-y-2">
        <label htmlFor="make-selector" className="text-sm font-medium flex items-center">
          Make {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Popover open={makesOpen} onOpenChange={setMakesOpen}>
          <PopoverTrigger asChild>
            <button
              id="make-selector-button"
              type="button"
              className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                !selectedMake && "text-muted-foreground"
              )}
              disabled={disabled}
              data-testid="make-selector-button"
            >
              {selectedMake || "Select make..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search make..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                <CommandEmpty>No makes found.</CommandEmpty>
                <CommandGroup>
                  {filteredMakes.map((make) => (
                    <CommandItem
                      key={make}
                      value={make}
                      onSelect={() => {
                        setSelectedMake(make);
                        setMakesOpen(false);
                      }}
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
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Model Selector */}
      <div className="space-y-2">
        <label htmlFor="model-selector" className="text-sm font-medium flex items-center">
          Model {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Popover 
          open={modelsOpen} 
          onOpenChange={(open) => {
            // Only allow opening if a make is selected and not in loading state
            if (disabled || !selectedMake) return;
            setModelsOpen(open);
          }}
        >
          <PopoverTrigger asChild>
            <button
              id="model-selector-button"
              type="button"
              className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                (!selectedModel || !selectedMake) && "text-muted-foreground"
              )}
              disabled={disabled || !selectedMake || loadingModels}
              data-testid="model-selector-button"
            >
              {selectedModel || (selectedMake ? (loadingModels ? "Loading models..." : "Select model...") : "Select make first")}
              {loadingModels ? (
                <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Search model..." 
                value={modelSearchTerm}
                onValueChange={setModelSearchTerm}
                disabled={loadingModels}
              />
              <CommandList>
                {loadingModels ? (
                  <div className="py-6 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2">Loading models...</span>
                  </div>
                ) : (
                  <>
                    <CommandEmpty>
                      {filteredModels.length === 0 && hasModels 
                        ? "No matching models found." 
                        : (filteredModels.length === 0 
                            ? "No models available for this make." 
                            : "No models found.")}
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredModels.map((model) => (
                        <CommandItem
                          key={model}
                          value={model}
                          onSelect={() => {
                            setSelectedModel(model);
                            setModelsOpen(false);
                          }}
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
