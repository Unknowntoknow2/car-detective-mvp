
import React from 'react';
import { ComboBox, ComboBoxProps, ComboBoxItem } from "@/components/ui/combo-box";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Props {
  makes: { value: string; label: string; icon?: string | null }[];
  models: { value: string; label: string }[];
  years: { value: string; label: string }[];
  makeValue: string;
  modelValue: string;
  yearValue: string;
  onMakeChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onYearChange: (value: string) => void;
  className?: string;
}

export function VehicleSelectorWithLogos({
  makes,
  models,
  years,
  makeValue,
  modelValue,
  yearValue,
  onMakeChange,
  onModelChange,
  onYearChange,
  className,
}: Props) {
  // Convert makes with possible null icons to valid ComboBoxItem[]
  const formattedMakes = makes.map(make => ({
    value: make.value,
    label: make.label,
    icon: make.icon || undefined
  }));

  const formattedModels = models.map(model => ({
    value: model.value,
    label: model.label
  }));

  const formattedYears = years.map(year => ({
    value: year.value,
    label: year.label
  }));

  return (
    <div className={cn("grid gap-4", className)}>
      <div className="grid grid-cols-[1fr_110px] gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <ComboBox 
            value={makeValue} 
            onValueChange={onMakeChange}
            items={formattedMakes}
            placeholder="Select make..."
          />
        </div>
      </div>
      <div className="grid grid-cols-[1fr_110px] gap-4">
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <ComboBox 
            value={modelValue}
            onValueChange={onModelChange}
            items={formattedModels}
            placeholder="Select model..."
          />
        </div>
      </div>
      <div className="grid grid-cols-[1fr_110px] gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <ComboBox 
            value={yearValue}
            onValueChange={onYearChange}
            items={formattedYears}
            placeholder="Select year..."
          />
        </div>
      </div>
    </div>
  );
}
