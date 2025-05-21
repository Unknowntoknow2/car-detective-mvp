import React from 'react';
import {
  ComboBox,
  ComboBoxContent,
  ComboBoxItem,
  ComboBoxList,
  ComboBoxTrigger
} from "@/components/ui/combo-box";
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

// Define a local interface that extends the imported one but with the correct icon type
interface LocalComboBoxItem {
  value: string;
  label: string;
  icon?: string | null;
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

  // Convert the items to the correct format before using them
  const formattedMakes: LocalComboBoxItem[] = makes.map(make => ({
    value: make.value,
    label: make.label,
    icon: make.icon
  }));

  return (
    <div className={cn("grid gap-4", className)}>
      <div className="grid grid-cols-[1fr_110px] gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <ComboBox onValueChange={onMakeChange} value={makeValue}>
            <ComboBoxTrigger className="w-full">
              {makeValue
                ? formattedMakes.find((make) => make.value === makeValue)?.label
                : "Select make..."}
            </ComboBoxTrigger>
            <ComboBoxContent>
              <ScrollArea className="h-[200px] w-full">
                <ComboBoxList>
                  {formattedMakes.map((make) => (
                    <ComboBoxItem key={make.value} value={make.value}>
                      {make.label}
                    </ComboBoxItem>
                  ))}
                </ComboBoxList>
              </ScrollArea>
            </ComboBoxContent>
          </ComboBox>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_110px] gap-4">
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <ComboBox onValueChange={onModelChange} value={modelValue}>
            <ComboBoxTrigger className="w-full">
              {modelValue
                ? models.find((model) => model.value === modelValue)?.label
                : "Select model..."}
            </ComboBoxTrigger>
            <ComboBoxContent>
              <ScrollArea className="h-[200px] w-full">
                <ComboBoxList>
                  {models.map((model) => (
                    <ComboBoxItem key={model.value} value={model.value}>
                      {model.label}
                    </ComboBoxItem>
                  ))}
                </ComboBoxList>
              </ScrollArea>
            </ComboBoxContent>
          </ComboBox>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_110px] gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <ComboBox onValueChange={onYearChange} value={yearValue}>
            <ComboBoxTrigger className="w-full">
              {yearValue
                ? years.find((year) => year.value === yearValue)?.label
                : "Select year..."}
            </ComboBoxTrigger>
            <ComboBoxContent>
              <ScrollArea className="h-[200px] w-full">
                <ComboBoxList>
                  {years.map((year) => (
                    <ComboBoxItem key={year.value} value={year.value}>
                      {year.label}
                    </ComboBoxItem>
                  ))}
                </ComboBoxList>
              </ScrollArea>
            </ComboBoxContent>
          </ComboBox>
        </div>
      </div>
    </div>
  );
}
