
import React from 'react';
import { Command } from '@/components/ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Model } from '@/hooks/useVehicleData';

interface ModelSelectorProps {
  models: Model[];
  selectedModel: string;
  onSelect: (model: string) => void;
  disabled?: boolean;
}

export function ModelSelector({ models, selectedModel, onSelect, disabled }: ModelSelectorProps) {
  const safeModels = Array.isArray(models) ? models : [];

  return (
    <Command.Group className="max-h-[250px] overflow-y-auto">
      {safeModels.map((model) => (
        <Command.Item
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
        </Command.Item>
      ))}
    </Command.Group>
  );
}
