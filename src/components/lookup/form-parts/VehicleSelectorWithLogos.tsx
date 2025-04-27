
import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVehicleData } from '@/hooks/useVehicleData';

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
  const { makes, getModelsByMake, isLoading } = useVehicleData();
  const [models, setModels] = useState<any[]>([]);

  useEffect(() => {
    if (selectedMake) {
      const availableModels = getModelsByMake(selectedMake);
      setModels(availableModels);
    }
  }, [selectedMake, getModelsByMake]);

  const handleMakeSelect = (make: string) => {
    onMakeChange(make);
    onModelChange(''); // Reset model when make changes
    setMakeOpen(false);
  };

  const handleModelSelect = (model: string) => {
    onModelChange(model);
    setModelOpen(false);
  };

  return (
    <div className={cn("grid gap-4", className)}>
      <Popover open={makeOpen} onOpenChange={setMakeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={makeOpen}
            className="justify-between"
            disabled={disabled || isLoading}
          >
            {selectedMake ? (
              <div className="flex items-center gap-2">
                {makes.find(m => m.make_name === selectedMake)?.logo_url && (
                  <img
                    src={makes.find(m => m.make_name === selectedMake)?.logo_url}
                    alt={`${selectedMake} logo`}
                    className="w-6 h-6 object-contain"
                  />
                )}
                {selectedMake}
              </div>
            ) : (
              "Select make..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search make..." />
            <CommandEmpty>No make found.</CommandEmpty>
            <CommandGroup>
              {makes.map((make) => (
                <CommandItem
                  key={make.id}
                  value={make.make_name}
                  onSelect={() => handleMakeSelect(make.make_name)}
                >
                  <div className="flex items-center gap-2">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedMake === make.make_name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {make.logo_url && (
                      <img
                        src={make.logo_url}
                        alt={`${make.make_name} logo`}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <span>{make.make_name}</span>
                    {make.country_of_origin && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {make.country_of_origin}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={modelOpen} onOpenChange={setModelOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={modelOpen}
            className="justify-between"
            disabled={disabled || !selectedMake}
          >
            {selectedModel || "Select model..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search model..." />
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.model_name}
                  onSelect={() => handleModelSelect(model.model_name)}
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
        </PopoverContent>
      </Popover>
    </div>
  );
}
