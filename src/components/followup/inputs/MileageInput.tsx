
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MileageInputProps {
  register: any;
  label?: string;
  required?: boolean;
  className?: string;
}

export function MileageInput({ 
  register,
  label = "Current Mileage", 
  required = false,
  className = ""
}: MileageInputProps) {
  return (
    <div className={className}>
      <Label htmlFor="mileage" className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="mt-1">
        <Input
          id="mileage"
          type="number"
          placeholder="Enter mileage"
          {...register("mileage", { valueAsNumber: true })}
          required={required}
        />
      </div>
    </div>
  );
}
