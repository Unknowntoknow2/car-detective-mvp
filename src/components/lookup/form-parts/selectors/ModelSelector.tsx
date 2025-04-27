
import React from 'react';
import {
  CommandItem,
  CommandGroup,
  CommandEmpty
} from '@/components/ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Model } from '@/hooks/types/vehicle';

interface ModelSelectorProps {
  models: Model[];
  selectedModel: string;
  onSelect: (model: string) => void;
  disabled?: boolean;
}

export function ModelSelector({ models, selectedModel, onSelect, disabled }: ModelSelectorProps) {
  // Ensure models is always an array, even if it's undefined
  const safeModels = Array.isArray(models) ? models : [];
  
  // Return empty state component if no models
  if (safeModels.length === 0) {
    return <CommandEmpty className="py-6 text-center text-sm">No models available for this make</CommandEmpty>;
  }

  return (
    <CommandGroup className="overflow-y-auto max-h-[300px]">
      {safeModels.map((model) => (
        <CommandItem
          key={model.id || `model-${model.model_name}`}
          value={model.model_name}
          onSelect={onSelect}
          className="py-2"
          data-testid={`model-option-${model.model_name}`}
          disabled={disabled}
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
  );
}
