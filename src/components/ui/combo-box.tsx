
import React, { useState, forwardRef } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export interface ComboBoxItem {
  value: string;
  label: string;
  icon?: string | undefined;
}

export interface ComboBoxProps {
  items: ComboBoxItem[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  loading?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const ComboBox = forwardRef<HTMLButtonElement, ComboBoxProps>(
  ({ 
    items, 
    value, 
    onValueChange, 
    placeholder = 'Select an option...', 
    emptyText = 'No items found.',
    loading = false,
    error,
    disabled = false,
    className
  }, ref) => {
    const [open, setOpen] = useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", className, {
              "border-red-500": error
            })}
            disabled={disabled || loading}
          >
            {value 
              ? items.find((item) => item.value === value)?.label || placeholder
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full min-w-[var(--radix-popover-trigger-width)]">
          <Command>
            <CommandInput placeholder={`Search...`} />
            <CommandList>
              <CommandEmpty>{loading ? 'Loading...' : emptyText}</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => {
                      onValueChange(item.value);
                      setOpen(false);
                    }}
                  >
                    {item.icon && (
                      <img 
                        src={item.icon} 
                        alt={item.label}
                        className="mr-2 h-4 w-4 rounded-sm" 
                      />
                    )}
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

ComboBox.displayName = "ComboBox";
