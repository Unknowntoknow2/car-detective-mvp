
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  hasModels = true,
  forcedRender = 0
}: MakeModelSelectorsProps) => {
  // Force the component to re-render when the forcedRender prop changes
  useEffect(() => {
    // This effect just uses the forcedRender prop to trigger a re-render
  }, [forcedRender]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Make Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center">
          Make {required && <span className="text-destructive ml-1">*</span>}
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
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command className="w-full">
              <CommandInput 
                placeholder="Search makes..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No makes found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  <ScrollArea className="h-64">
                    {filteredMakes.map((make) => (
                      <CommandItem
                        key={make}
                        value={make}
                        onSelect={() => {
                          setSelectedMake(make);
                          setMakesOpen(false);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selectedMake === make ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {make}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Model Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center">
          Model {required && <span className="text-destructive ml-1">*</span>}
        </label>
        <Popover open={modelsOpen} onOpenChange={setModelsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={modelsOpen}
              className={cn(
                "w-full justify-between",
                (!selectedMake || loadingModels) && "text-muted-foreground"
              )}
              disabled={!selectedMake || disabled}
            >
              {loadingModels ? (
                "Loading models..."
              ) : selectedModel ? (
                selectedModel
              ) : (
                selectedMake ? "Select model..." : "Select make first"
              )}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command className="w-full">
              <CommandInput 
                placeholder="Search models..." 
                value={modelSearchTerm}
                onValueChange={setModelSearchTerm}
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>
                  {loadingModels ? "Loading models..." : "No models found."}
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  <ScrollArea className="h-64">
                    {filteredModels.map((model) => (
                      <CommandItem
                        key={model}
                        value={model}
                        onSelect={() => {
                          setSelectedModel(model);
                          setModelsOpen(false);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Check
                          className={cn(
                            "h-4 w-4",
                            selectedModel === model ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {model}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
