
import React from "react";
import { MakeModelSelect } from "@/components/premium/lookup/form-parts/fields/MakeModelSelect";
import { YearMileageInputs } from "@/components/premium/lookup/form-parts/fields/YearMileageInputs";
import { ZipCodeInput } from "@/components/common/ZipCodeInput";
import { Label } from "@/components/ui/label";
import { FormValidationError } from "@/components/premium/common/FormValidationError";

interface BasicVehicleInfoProps {
  selectedMakeId: string;
  setSelectedMakeId: (id: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedYear: number | "";
  setSelectedYear: (year: number | "") => void;
  mileage: string;
  setMileage: (mileage: string) => void;
  zipCode: string;
  setZipCode: (zipCode: string) => void;
  isDisabled?: boolean;
  errors?: Record<string, string>;
}

export function BasicVehicleInfo({
  selectedMakeId,
  setSelectedMakeId,
  selectedModel,
  setSelectedModel,
  selectedYear,
  setSelectedYear,
  mileage,
  setMileage,
  zipCode,
  setZipCode,
  isDisabled,
  errors = {},
}: BasicVehicleInfoProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <MakeModelSelect
          selectedMakeId={selectedMakeId}
          setSelectedMakeId={setSelectedMakeId}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          isDisabled={isDisabled}
          errors={errors}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <YearMileageInputs
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          mileage={mileage}
          setMileage={setMileage}
          isDisabled={isDisabled}
          errors={errors}
        />
      </div>

      <div className="sm:w-1/2">
        <div className="space-y-2">
          <Label
            htmlFor="zipCode"
            className="text-sm font-medium text-slate-700"
          >
            ZIP Code
          </Label>
          <ZipCodeInput
            value={zipCode}
            onChange={setZipCode}
            placeholder="Enter ZIP code"
            disabled={isDisabled}
            className={`h-10 transition-all duration-200 ${
              errors.zipCode
                ? "border-red-300 focus:ring-red-200"
                : "focus:ring-primary/20 focus:border-primary hover:border-primary/30"
            }`}
            showLabel={false}
          />
          {errors.zipCode && <FormValidationError error={errors.zipCode} />}
          <p className="text-xs text-slate-500">
            Your location helps us determine regional market values
          </p>
        </div>
      </div>
    </div>
  );
}
