
import React from "react";
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
  isDisabled = false,
  errors = {},
}: YearMileageInputsProps) {
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setSelectedYear("");
    } else {
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        setSelectedYear(numValue);
      }
    }
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setMileage(value);
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="year" className="text-sm font-medium text-slate-700">
          Year
        </Label>
        <Input
          id="year"
          type="number"
          value={selectedYear === "" ? "" : selectedYear}
          onChange={handleYearChange}
          placeholder="Enter year"
          min={1900}
          max={currentYear + 1}
          className={`h-10 transition-all duration-200 ${
            errors.year
              ? "border-red-300 focus:ring-red-200"
              : "focus:ring-primary/20 focus:border-primary hover:border-primary/30"
          }`}
          disabled={isDisabled}
        />
        {errors.year && <FormValidationError error={errors.year} />}
      </div>

      <div className="space-y-2">
        <Label htmlFor="mileage" className="text-sm font-medium text-slate-700">
          Mileage
        </Label>
        <Input
          id="mileage"
          type="text"
          value={mileage}
          onChange={handleMileageChange}
          placeholder="Enter mileage"
          className={`h-10 transition-all duration-200 ${
            errors.mileage
              ? "border-red-300 focus:ring-red-200"
              : "focus:ring-primary/20 focus:border-primary hover:border-primary/30"
          }`}
          disabled={isDisabled}
        />
        {errors.mileage && <FormValidationError error={errors.mileage} />}
        <p className="text-xs text-slate-500">
          Lower mileage typically increases vehicle value
        </p>
      </div>
    </>
  );
}
