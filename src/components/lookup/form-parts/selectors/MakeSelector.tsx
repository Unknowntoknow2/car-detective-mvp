
import React from 'react';
import { Command } from '@/components/ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Make } from '@/hooks/useVehicleData';

interface MakeSelectorProps {
  makes: Make[];
  selectedMake: string;
  onSelect: (make: string) => void;
  disabled?: boolean;
}

export function MakeSelector({ makes, selectedMake, onSelect, disabled }: MakeSelectorProps) {
  const safeMakes = Array.isArray(makes) ? makes : [];

  return (
    <Command.Group className="max-h-[250px] overflow-y-auto">
      {safeMakes.map((make) => (
        <Command.Item
          key={make.id || `make-${make.make_name}`}
          value={make.make_name}
          onSelect={onSelect}
          className="flex items-center gap-2 py-2"
          data-testid={`make-option-${make.make_name}`}
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
        </Command.Item>
      ))}
    </Command.Group>
  );
}
