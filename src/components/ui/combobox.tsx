
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboBoxItem {
  value: string
  label: string
  icon?: string | null
}

interface ComboBoxProps {
  items: ComboBoxItem[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
}

export function ComboBox({
  items,
  value,
  onChange,
  placeholder = "Select an option",
  emptyText = "No options found",
  disabled = false,
  className
}: ComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  
  // Ensure items is always an array, never undefined
  const safeItems = Array.isArray(items) ? items : [];
  
  const filteredItems = searchQuery && safeItems.length > 0
    ? safeItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : safeItems;

  const selectedItem = safeItems.find(item => item.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between h-10 px-3 font-normal",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {selectedItem?.icon && (
              <img 
                src={selectedItem.icon} 
                alt={`${selectedItem.label} icon`}
                className="h-5 w-5 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none"
                }}
              />
            )}
            <span className="truncate">
              {selectedItem?.label || placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0 max-h-[300px] overflow-hidden" 
        align="start"
        side="bottom"
      >
        <Command className="w-full" filter={(value, search) => {
          // We handle filtering manually
          return 1
        }}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              className="h-9 flex-1"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </div>
          <CommandEmpty>{emptyText}</CommandEmpty>
          {filteredItems.length > 0 && (
            <CommandGroup className="max-h-[200px] overflow-y-auto">
              {filteredItems.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => {
                    onChange(item.value === value ? "" : item.value)
                    setOpen(false)
                    setSearchQuery("")
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2 w-full">
                    {item.icon && (
                      <img 
                        src={item.icon} 
                        alt={`${item.label} icon`}
                        className="h-5 w-5 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                    )}
                    <span className="truncate flex-1">{item.label}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
