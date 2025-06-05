
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormValidationError } from "@/components/premium/common/FormValidationError";

interface YearMileageInputsProps {
  selectedYear: number | "";
  setSelectedYear: (year: number | "") => void;
  mileage: string;
  setMileage: (mileage: string) => void;
  isDisabled?: boolean;
  errors?: Record<string, string>;
}

export function YearMileageInputs({
  selectedYear,
  setSelectedYear,
  mileage,
  setMileage,
  isDisabled,
  errors = {},
}: YearMileageInputsProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setMileage(value);
  };

  return (
    <>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Year</Label>
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(parseInt(value))}
          disabled={isDisabled}
        >
          <SelectTrigger className={`h-10 ${errors.year ? "border-red-300" : ""}`}>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.year && <FormValidationError error={errors.year} />}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Mileage</Label>
        <Input
          type="text"
          value={mileage ? parseInt(mileage).toLocaleString() : ""}
          onChange={handleMileageChange}
          placeholder="Enter mileage"
          className={`h-10 ${errors.mileage ? "border-red-300" : ""}`}
          disabled={isDisabled}
        />
        {errors.mileage && <FormValidationError error={errors.mileage} />}
      </div>
    </>
  );
}
