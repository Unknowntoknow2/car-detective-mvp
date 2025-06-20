
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
  isDisabled,
  errors = {},
}: YearMileageInputsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label
          htmlFor="year"
          className="text-sm font-medium text-slate-700"
        >
          Year
        </Label>
        <Input
          id="year"
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : "")}
          placeholder="2020"
          disabled={isDisabled}
          className={`h-10 transition-all duration-200 ${
            errors.year
              ? "border-red-300 focus:ring-red-200"
              : "focus:ring-primary/20 focus:border-primary hover:border-primary/30"
          }`}
        />
        {errors.year && <FormValidationError error={errors.year} />}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="mileage"
          className="text-sm font-medium text-slate-700"
        >
          Mileage
        </Label>
        <Input
          id="mileage"
          type="number"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
          placeholder="50,000"
          disabled={isDisabled}
          className={`h-10 transition-all duration-200 ${
            errors.mileage
              ? "border-red-300 focus:ring-red-200"
              : "focus:ring-primary/20 focus:border-primary hover:border-primary/30"
          }`}
        />
        {errors.mileage && <FormValidationError error={errors.mileage} />}
      </div>
    </>
  );
}
