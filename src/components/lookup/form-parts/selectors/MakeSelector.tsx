
import React from 'react';
import {
  CommandItem,
  CommandGroup,
  CommandEmpty
} from '@/components/ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Make } from '@/hooks/types/vehicle';

interface MakeSelectorProps {
  makes: Make[];
  selectedMake: string;
  onSelect: (make: string) => void;
  disabled?: boolean;
}

export function MakeSelector({ makes, selectedMake, onSelect, disabled }: MakeSelectorProps) {
  // Ensure makes is always an array, even if it's undefined
  const safeMakes = Array.isArray(makes) ? makes : [];
  
  // Return empty state component if no makes
  if (safeMakes.length === 0) {
    return <CommandEmpty className="py-6 text-center text-sm">No makes available</CommandEmpty>;
  }

  return (
    <CommandGroup className="overflow-y-auto max-h-[300px]">
      {safeMakes.map((make) => (
        <CommandItem
          key={make.id || `make-${make.make_name}`}
          value={make.make_name}
          onSelect={onSelect}
          className="flex items-center gap-2 py-2"
          data-testid={`make-option-${make.make_name}`}
          disabled={disabled}
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
  );
}
