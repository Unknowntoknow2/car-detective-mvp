
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Loader2 } from 'lucide-react';
import { useVehicleData } from '@/hooks/useVehicleData';
import { ErrorBoundary } from '../ErrorBoundary';
import { MakeSelector } from './selectors/MakeSelector';
import { ModelSelector } from './selectors/ModelSelector';

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

  // Safe array of makes
  const safeMakes = Array.isArray(makes) ? makes : [];
  const safeModels = selectedMake ? getModelsByMake(selectedMake) : [];

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
      <div className="grid gap-4">
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
            <Command>
              <CommandInput placeholder="Search make..." className="h-9" />
              <CommandList>
                {safeMakes.length > 0 ? (
                  <CommandGroup heading="Makes">
                    <MakeSelector
                      makes={safeMakes}
                      selectedMake={selectedMake}
                      onSelect={(make) => {
                        onMakeChange(make);
                        setMakeOpen(false);
                      }}
                      disabled={disabled}
                    />
                  </CommandGroup>
                ) : (
                  <CommandEmpty>No makes found.</CommandEmpty>
                )}
              </CommandList>
            </Command>
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
            <Command>
              <CommandInput placeholder="Search model..." className="h-9" />
              <CommandList>
                {selectedMake && safeModels.length > 0 ? (
                  <CommandGroup heading="Models">
                    <ModelSelector
                      models={safeModels}
                      selectedModel={selectedModel}
                      onSelect={(model) => {
                        onModelChange(model);
                        setModelOpen(false);
                      }}
                      disabled={disabled}
                    />
                  </CommandGroup>
                ) : (
                  <CommandEmpty>
                    {selectedMake ? 'No models found.' : 'Select a make first.'}
                  </CommandEmpty>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </ErrorBoundary>
  );
}
