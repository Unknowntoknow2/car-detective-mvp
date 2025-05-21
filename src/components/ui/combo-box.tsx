
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
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ComboBoxItem {
  value: string;
  label: string;
  icon?: string;
}

interface ComboBoxProps {
  items: ComboBoxItem[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  itemClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  showSearch?: boolean;
  disabled?: boolean;
  searchPlaceholder?: string;
  popoverAlign?: "start" | "center" | "end";
  popoverSide?: "top" | "right" | "bottom" | "left";
  renderSelectedItem?: (item: ComboBoxItem | undefined) => React.ReactNode;
  renderItem?: (item: ComboBoxItem) => React.ReactNode;
}

export function ComboBox({
  items,
  value,
  onValueChange,
  placeholder = "Select an item",
  emptyMessage = "No items found.",
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
  showSearch = true,
  disabled = false,
  searchPlaceholder = "Search...",
  popoverAlign = "start",
  popoverSide = "bottom",
  renderSelectedItem,
  renderItem,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedItem = React.useMemo(
    () => items.find((item) => item.value === value),
    [items, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            disabled && "pointer-events-none opacity-50",
            triggerClassName
          )}
          disabled={disabled}
        >
          {renderSelectedItem ? (
            renderSelectedItem(selectedItem)
          ) : selectedItem ? (
            <div className="flex items-center gap-2">
              {selectedItem.icon && (
                <img 
                  src={selectedItem.icon} 
                  alt="" 
                  className="h-4 w-4 object-contain"
                />
              )}
              {selectedItem.label}
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn("p-0", contentClassName)} 
        align={popoverAlign}
        side={popoverSide}
        width="trigger"
      >
        <Command className={className}>
          {showSearch && (
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
          )}
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[var(--radix-popover-content-available-height)] max-h-[300px]">
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => {
                    onValueChange(item.value);
                    setOpen(false);
                  }}
                  className={itemClassName}
                >
                  {renderItem ? (
                    renderItem(item)
                  ) : (
                    <div className="flex items-center gap-2">
                      {item.icon && (
                        <img 
                          src={item.icon} 
                          alt="" 
                          className="h-4 w-4 object-contain"
                        />
                      )}
                      {item.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === item.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                  )}
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
