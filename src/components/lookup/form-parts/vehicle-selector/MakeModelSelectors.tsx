
import React from "react";
import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MakeSelector } from "../selectors/MakeSelector";
import { ModelSelector } from "../selectors/ModelSelector";
import { Make, Model } from "@/hooks/types/vehicle";

interface MakeModelSelectorsProps {
  selectedMake: string;
  setSelectedMake: (make: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  makesOpen: boolean;
  setMakesOpen: (open: boolean) => void;
  modelsOpen: boolean;
  setModelsOpen: (open: boolean) => void;
  filteredMakes: Make[];
  filteredModels: Model[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  modelSearchTerm: string;
  setModelSearchTerm: (term: string) => void;
  disabled?: boolean;
  required?: boolean;
  loadingModels?: boolean;
  hasModels?: boolean;
  forcedRender?: number;
}

export const MakeModelSelectors = ({
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
  hasModels = false,
  forcedRender,
}: MakeModelSelectorsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
            >
              {selectedMake || "Select make..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder="Search makes..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <MakeSelector
                makes={filteredMakes}
                selectedMake={selectedMake}
                onSelect={(value) => {
                  setSelectedMake(value === selectedMake ? "" : value);
                  setMakesOpen(false);
                }}
                disabled={disabled}
              />
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
            >
              {loadingModels ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading models...
                </>
              ) : (
                selectedModel || "Select model..."
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder="Search models..."
                value={modelSearchTerm}
                onValueChange={setModelSearchTerm}
              />
              <ModelSelector
                models={filteredModels}
                selectedModel={selectedModel}
                onSelect={(value) => {
                  setSelectedModel(value === selectedModel ? "" : value);
                  setModelsOpen(false);
                }}
                disabled={disabled}
              />
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
