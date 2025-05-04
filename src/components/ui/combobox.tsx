
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboBoxItem {
  label: string;
  value: string;
  icon?: string;
}

interface ComboBoxProps {
  id?: string;
  items?: ComboBoxItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
}

// Export both ComboBox and Combobox to maintain compatibility
export function ComboBox({
  id,
  items = [],
  value,
  onChange,
  placeholder = "Select...",
  emptyText = "No options",
  disabled = false,
  className,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  
  React.useEffect(() => {
    // Debug log
    console.log(`ComboBox (${id || 'unnamed'}): ${items?.length || 0} items, current value: ${value || 'none'}`);
  }, [items, value, id]);
  
  // Ensure we have a valid array
  const safeItems = Array.isArray(items) ? items : [];
  
  // Find the currently selected item
  const selectedItem = safeItems.find((item) => item.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            className
          )}
          disabled={disabled}
          onClick={() => {
            console.log(`ComboBox (${id || 'unnamed'}): Button clicked, items:`, safeItems.length);
            if (safeItems.length === 0) {
              console.warn(`ComboBox (${id || 'unnamed'}): No items available to display`);
            }
          }}
        >
          {selectedItem ? selectedItem.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[300px] p-0 bg-white border border-gray-200 shadow-lg rounded-md max-h-[300px] overflow-auto z-50"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder={placeholder}
            className="border-b px-3 py-2"
          />
          <CommandList className="max-h-[200px] overflow-y-auto">
            {safeItems.length === 0 ? (
              <CommandEmpty className="p-3 text-center text-sm text-muted-foreground">
                {emptyText}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {safeItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => {
                      // Use item.value directly from the map to ensure correct selection
                      console.log(`ComboBox (${id || 'unnamed'}): Selected ${item.label} (${item.value})`);
                      onChange(item.value);
                      setOpen(false);
                    }}
                    className="cursor-pointer hover:bg-gray-100 px-3 py-2 flex items-center gap-2 rounded-sm transition-colors text-black"
                  >
                    {item.icon && (
                      <img
                        src={item.icon}
                        alt=""
                        className="h-4 w-4 object-contain"
                        onError={(e) => {
                          console.log("Image load error");
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <span className="text-black font-normal">{item.label}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4 text-primary",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Add this alias export to support both naming conventions
export const Combobox = ComboBox;
