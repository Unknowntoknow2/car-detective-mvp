
import React, { useRef, useEffect } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

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
  loadingModels: boolean;
  hasModels: boolean;
  forcedRender?: number;
}

export function MakeModelSelectors({
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
  loadingModels,
  hasModels,
  forcedRender = 0
}: MakeModelSelectorsProps) {
  const modelTriggerRef = useRef<HTMLButtonElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the command input when popover opens
  useEffect(() => {
    if (makesOpen && commandInputRef.current) {
      setTimeout(() => {
        commandInputRef.current?.focus();
      }, 100);
    }
  }, [makesOpen]);

  // Auto-focus the command input for models when that popover opens
  useEffect(() => {
    if (modelsOpen && commandInputRef.current) {
      setTimeout(() => {
        commandInputRef.current?.focus();
      }, 100);
    }
  }, [modelsOpen]);

  // Special effect to force the model dropdown to open when selected make changes
  useEffect(() => {
    if (selectedMake && hasModels && !loadingModels && !selectedModel) {
      const timer = setTimeout(() => {
        setModelsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedMake, hasModels, loadingModels, selectedModel, setModelsOpen]);

  // Effect for forced render (usually to recover from errors)
  useEffect(() => {
    if (forcedRender > 0 && selectedMake && !selectedModel && filteredModels.length > 0) {
      const timer = setTimeout(() => {
        setModelsOpen(true);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [forcedRender, selectedMake, selectedModel, filteredModels.length, setModelsOpen]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Make Selector */}
      <div className="space-y-2">
        <Popover open={makesOpen} onOpenChange={setMakesOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={makesOpen}
              className={cn(
                "w-full justify-between",
                !selectedMake && "text-muted-foreground"
              )}
              onClick={() => setMakesOpen(!makesOpen)}
              disabled={disabled}
            >
              {selectedMake || "Select make"}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full min-w-[200px] max-h-[300px]" align="start">
            <Command>
              <CommandInput 
                placeholder="Search make..." 
                className="h-9" 
                value={searchTerm}
                onValueChange={setSearchTerm}
                ref={commandInputRef}
              />
              <CommandEmpty>No make found.</CommandEmpty>
              <CommandGroup className="max-h-[210px] overflow-auto">
                {filteredMakes.map((make) => (
                  <CommandItem
                    key={make}
                    value={make}
                    onSelect={() => {
                      setSelectedMake(make);
                      setMakesOpen(false);
                      setSelectedModel(''); // Reset model when make changes
                    }}
                  >
                    {make}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedMake === make ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {required && !selectedMake && (
          <p className="text-xs text-destructive">Make is required</p>
        )}
      </div>

      {/* Model Selector */}
      <div className="space-y-2">
        <Popover open={modelsOpen} onOpenChange={setModelsOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={modelTriggerRef}
              variant="outline"
              role="combobox"
              aria-expanded={modelsOpen}
              className={cn(
                "w-full justify-between",
                !selectedModel && "text-muted-foreground"
              )}
              onClick={() => {
                if (selectedMake) {
                  setModelsOpen(!modelsOpen);
                }
              }}
              disabled={disabled || !selectedMake || loadingModels}
            >
              {loadingModels ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading models...
                </span>
              ) : (
                selectedModel || "Select model"
              )}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full min-w-[200px] max-h-[300px]" align="start">
            <Command>
              <CommandInput 
                placeholder="Search model..." 
                className="h-9" 
                value={modelSearchTerm}
                onValueChange={setModelSearchTerm}
                ref={commandInputRef}
              />
              {loadingModels ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">Loading models...</span>
                </div>
              ) : (
                <>
                  <CommandEmpty>No model found.</CommandEmpty>
                  <CommandGroup className="max-h-[210px] overflow-auto">
                    {filteredModels.map((model) => (
                      <CommandItem
                        key={model}
                        value={model}
                        onSelect={() => {
                          setSelectedModel(model);
                          setModelsOpen(false);
                        }}
                      >
                        {model}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedModel === model ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </Command>
          </PopoverContent>
        </Popover>
        {required && selectedMake && !selectedModel && (
          <p className="text-xs text-destructive">Model is required</p>
        )}
      </div>
    </div>
  );
}
