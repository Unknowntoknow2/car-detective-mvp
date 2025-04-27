
import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVehicleData } from '@/hooks/useVehicleData';
import { ErrorBoundary } from '../ErrorBoundary';

interface VehicleSelectorWithLogosProps {
  selectedMake: string;
  onMakeChange: (make: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
  className?: string;
}

export function VehicleSelectorWithLogos({
  selectedMake,
  onMakeChange,
  selectedModel,
  onModelChange,
  disabled = false,
  className
}: VehicleSelectorWithLogosProps) {
  const [makeOpen, setMakeOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const { makes, getModelsByMake, isLoading, error } = useVehicleData();
  const [models, setModels] = useState<any[]>([]);

  // Ensure we have valid arrays
  const safeMakes = Array.isArray(makes) ? makes : [];

  // Log the makes data to debug
  useEffect(() => {
    console.log("VehicleSelectorWithLogos - Available makes:", { 
      count: safeMakes.length,
      sample: safeMakes.slice(0, 3),
      selectedMake
    });
  }, [safeMakes, selectedMake]);

  // Update models when make changes
  useEffect(() => {
    try {
      if (selectedMake) {
        console.log("Fetching models for make:", selectedMake);
        const availableModels = getModelsByMake(selectedMake);
        const safeModels = Array.isArray(availableModels) ? availableModels : [];
        console.log(`Models for ${selectedMake}:`, { 
          count: safeModels.length,
          sample: safeModels.slice(0, 3)
        });
        setModels(safeModels);
      } else {
        setModels([]);
      }
    } catch (error) {
      console.error("Error updating models:", error);
      setModels([]);
    }
  }, [selectedMake, getModelsByMake]);

  const handleMakeSelect = (make: string) => {
    try {
      console.log("Selected make:", make);
      onMakeChange(make);
      onModelChange(''); // Reset model when make changes
      setMakeOpen(false);
    } catch (error) {
      console.error("Error selecting make:", error);
    }
  };

  const handleModelSelect = (model: string) => {
    try {
      console.log("Selected model:", model);
      onModelChange(model);
      setModelOpen(false);
    } catch (error) {
      console.error("Error selecting model:", error);
    }
  };

  // Ensure we have a valid array for models
  const safeModels = Array.isArray(models) ? models : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading vehicle data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 border border-red-200 rounded-md">
        <p>Error loading vehicle data: {error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={cn("grid gap-4", className)}>
        <Popover open={makeOpen} onOpenChange={setMakeOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={makeOpen}
              className="justify-between h-10"
              disabled={disabled || isLoading}
              data-testid="make-selector"
            >
              {selectedMake ? (
                <div className="flex items-center gap-2">
                  {safeMakes.find(m => m.make_name === selectedMake)?.logo_url && (
                    <img
                      src={safeMakes.find(m => m.make_name === selectedMake)?.logo_url || ''}
                      alt={`${selectedMake} logo`}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        console.log("Image load error");
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  {selectedMake}
                </div>
              ) : (
                <span className="text-muted-foreground">Select make...</span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0 max-h-[300px] overflow-hidden">
            {safeMakes.length > 0 ? (
              <Command>
                <CommandInput placeholder="Search make..." className="h-9" />
                <CommandEmpty>No make found.</CommandEmpty>
                <CommandGroup className="max-h-[250px] overflow-y-auto">
                  {safeMakes.map((make) => (
                    <CommandItem
                      key={make.id || `make-${make.make_name}`}
                      value={make.make_name}
                      onSelect={() => handleMakeSelect(make.make_name)}
                      className="flex items-center gap-2 py-2"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedMake === make.make_name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center gap-2">
                        {make.logo_url && (
                          <img
                            src={make.logo_url}
                            alt={`${make.make_name} logo`}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              console.log("Image load error");
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <span>{make.make_name}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No makes available
              </div>
            )}
          </PopoverContent>
        </Popover>

        <Popover open={modelOpen} onOpenChange={setModelOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={modelOpen}
              className="justify-between h-10"
              disabled={disabled || !selectedMake}
              data-testid="model-selector"
            >
              {selectedModel ? (
                selectedModel
              ) : (
                <span className="text-muted-foreground">
                  {selectedMake ? "Select model..." : "Select make first"}
                </span>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0 max-h-[300px] overflow-hidden">
            {safeModels.length > 0 ? (
              <Command>
                <CommandInput placeholder="Search model..." className="h-9" />
                <CommandEmpty>No model found.</CommandEmpty>
                <CommandGroup className="max-h-[250px] overflow-y-auto">
                  {safeModels.map((model) => (
                    <CommandItem
                      key={model.id || `model-${model.model_name}`}
                      value={model.model_name}
                      onSelect={() => handleModelSelect(model.model_name)}
                      className="py-2"
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
              </Command>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                {selectedMake ? "No models available for this make" : "Select a make first"}
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </ErrorBoundary>
  );
}
