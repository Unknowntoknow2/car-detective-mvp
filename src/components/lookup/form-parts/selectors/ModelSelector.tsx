
import React from 'react';
import {
  CommandItem,
  CommandGroup
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
  
  // Only render CommandGroup if we have models
  if (safeModels.length === 0) {
    return <div className="py-6 text-center text-sm">No models available for this make</div>;
  }

  return (
    <CommandGroup className="overflow-y-auto">
      {safeModels.map((model) => (
        <CommandItem
          key={model.id || `model-${model.model_name}`}
          value={model.model_name}
          onSelect={onSelect}
          className="py-2"
          data-testid={`model-option-${model.model_name}`}
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
