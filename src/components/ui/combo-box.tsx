
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

export interface ComboBoxItem {
  value: string;
  label: string;
  icon?: string;
}

export interface ComboBoxProps {
  value: string;
  onValueChange: (value: string) => void;
  items?: ComboBoxItem[];
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  // Add support for children
  children?: React.ReactNode;
  triggerContent?: React.ReactNode;
}

export const ComboBox = React.forwardRef<HTMLDivElement, ComboBoxProps>(
  ({
    value,
    onValueChange,
    items = [],
    placeholder = "Select an option",
    emptyMessage = "No results found.",
    disabled = false,
    className,
    children,
    triggerContent
  }, ref) => {
    const [open, setOpen] = React.useState(false);

    // Use children if provided, otherwise use the default rendering
    if (children) {
      return (
        <Popover open={open} onOpenChange={setOpen}>
          {children}
        </Popover>
      );
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between",
              className
            )}
          >
            {triggerContent || (
              <>
                {value
                  ? items.find((item) => item.value === value)?.label || value
                  : placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0"
          align="start"
          side="bottom"
          // Remove width property as it's not supported
          // width="target"
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {item.icon && (
                      <img
                        src={item.icon}
                        alt={item.label}
                        className="mr-2 h-4 w-4"
                      />
                    )}
                    <span>{item.label}</span>
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

// Export ComboBox components
export const ComboBoxTrigger = PopoverTrigger;
export const ComboBoxContent = PopoverContent;
export const ComboBoxItem = CommandItem;
export const ComboBoxList = CommandList;
