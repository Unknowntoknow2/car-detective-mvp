<<<<<<< HEAD

import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicleData } from '@/hooks/useVehicleData';

interface YearMileageInputsProps {
  form: any;
}

export const YearMileageInputs: React.FC<YearMileageInputsProps> = ({ form }) => {
  const { getYearOptions } = useVehicleData();
  const yearOptions = getYearOptions(1990);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField
        control={form.control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year</FormLabel>
            <Select 
              onValueChange={(value) => {
                if (value === '') {
                  field.onChange('');
                } else {
                  field.onChange(parseInt(value));
                }
              }} 
              defaultValue={field.value !== undefined && field.value !== null ? field.value.toString() : ''}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {yearOptions.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
=======
import React from "react";
import { Input } from "@/components/ui/input";
import { useVehicleData } from "@/hooks/useVehicleData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getMileageDescription } from "@/utils/adjustments/descriptions";

interface YearMileageInputsProps {
  selectedYear: number | "";
  setSelectedYear: (year: number | "") => void;
  mileage: string;
  setMileage: (mileage: string) => void;
  isDisabled?: boolean;
}

export const YearMileageInputs: React.FC<YearMileageInputsProps> = ({
  selectedYear,
  setSelectedYear,
  mileage,
  setMileage,
  isDisabled = false,
}) => {
  const { getYearOptions } = useVehicleData();

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const numberValue = parseInt(value, 10);

    if (value === "" || (numberValue > 0 && numberValue <= 999999)) {
      // Format with comma separators for thousands
      if (value) {
        const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const plainValue = formattedValue.replace(/,/g, "");
        setMileage(plainValue);
      } else {
        setMileage(value);
      }
    }
  };

  const getMileageInfo = (miles: string) => {
    const numericMiles = parseInt(miles.replace(/,/g, ""), 10);
    if (!isNaN(numericMiles) && numericMiles > 0) {
      return getMileageDescription(numericMiles);
    }
    return "";
  };

  return (
    <>
      <Select
        onValueChange={(value) => setSelectedYear(Number(value))}
        disabled={isDisabled}
        value={selectedYear ? String(selectedYear) : ""}
      >
        <SelectTrigger className="h-12 bg-white border-2 transition-colors hover:border-primary/50 focus:border-primary">
          <SelectValue placeholder="Select Year" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {getYearOptions().map((year) => (
            <SelectItem
              key={year}
              value={String(year)}
              className="py-2.5 cursor-pointer hover:bg-primary/10"
            >
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="space-y-1 w-full">
        <Input
          type="text"
          inputMode="numeric"
          placeholder="Enter Mileage"
          value={mileage.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          onChange={handleMileageChange}
          disabled={isDisabled}
          className="h-12 bg-white border-2 transition-colors hover:border-primary/50 focus:border-primary"
          onBlur={() => {
            if (mileage === "" || parseInt(mileage, 10) <= 0) {
              toast.error(
                "Mileage must be a positive number greater than zero",
              );
              setMileage("");
            }
          }}
        />
        {mileage && (
          <p className="text-xs text-muted-foreground">
            {getMileageInfo(mileage)}
          </p>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        )}
      />
      
      <FormField
        control={form.control}
        name="mileage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mileage</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                placeholder="e.g. 45000" 
                {...field} 
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value === '') {
                    field.onChange('');
                  } else {
                    field.onChange(parseInt(value));
                  }
                }}
                value={field.value !== undefined && field.value !== null ? field.value.toString() : ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
