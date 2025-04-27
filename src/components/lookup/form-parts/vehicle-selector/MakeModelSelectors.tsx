
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
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
  filteredMakes: any[];
  filteredModels: any[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  modelSearchTerm: string;
  setModelSearchTerm: (term: string) => void;
  disabled?: boolean;
  required?: boolean;
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
  required = false
}: MakeModelSelectorsProps) => {
  const handleMakeSelect = (make: string) => {
    if (make !== selectedMake) {
      setSelectedMake(make);
      setSelectedModel('');
      setModelSearchTerm('');
    }
    setMakesOpen(false);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setModelsOpen(false);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="make" className="text-sm font-medium">
          Make {required && <span className="text-destructive">*</span>}
        </label>
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
              <CommandGroup>
                {filteredMakes.map(make => (
                  <CommandItem
                    key={make.id}
                    value={make.make_name}
                    onSelect={handleMakeSelect}
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
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      {make.make_name}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label htmlFor="model" className="text-sm font-medium">
          Model {required && <span className="text-destructive">*</span>}
        </label>
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
              <CommandGroup>
                {filteredModels.map(model => (
                  <CommandItem
                    key={model.id}
                    value={model.model_name}
                    onSelect={handleModelSelect}
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
    </div>
  );
};
