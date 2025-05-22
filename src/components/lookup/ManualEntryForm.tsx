
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ManualEntryFormData, ConditionLevel } from './types/manualEntry';

// Create schema for form validation
const manualEntrySchema = z.object({
  make: z.string().min(1, { message: "Make is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  year: z.coerce.number().min(1900, { message: "Year must be after 1900" }).max(new Date().getFullYear() + 1),
  mileage: z.coerce.number().min(0, { message: "Mileage must be a positive number" }).optional(),
  condition: z.string().optional(),
  zipCode: z.string().optional(),
  vin: z.string().optional(),
  trim: z.string().optional(),
  color: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  bodyType: z.string().optional()
});

export interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  initialData?: Partial<ManualEntryFormData>;
  isPremium?: boolean;
}

const ManualEntryForm: React.FC<ManualEntryFormProps> = ({
  onSubmit,
  isLoading = false,
  submitButtonText = "Submit",
  initialData = {},
  isPremium = false
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ManualEntryFormData>({
    resolver: zodResolver(manualEntrySchema),
    defaultValues: {
      make: initialData.make || '',
      model: initialData.model || '',
      year: initialData.year || new Date().getFullYear(),
      mileage: initialData.mileage || 0,
      condition: initialData.condition || ConditionLevel.Good,
      zipCode: initialData.zipCode || '',
      vin: initialData.vin || '',
      ...initialData
    }
  });
  
  const conditions = [
    { value: ConditionLevel.Excellent, label: "Excellent" },
    { value: ConditionLevel.VeryGood, label: "Very Good" },
    { value: ConditionLevel.Good, label: "Good" },
    { value: ConditionLevel.Fair, label: "Fair" },
    { value: ConditionLevel.Poor, label: "Poor" }
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  
  const onFormSubmit = (data: ManualEntryFormData) => {
    // Ensure mileage is a number
    if (data.mileage !== undefined) {
      data.mileage = Number(data.mileage);
    }
    onSubmit(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Make input */}
        <div className="space-y-2">
          <Label htmlFor="make">Make *</Label>
          <Input
            id="make"
            placeholder="e.g., Toyota"
            {...register("make")}
            className={errors.make ? "border-red-500" : ""}
          />
          {errors.make && (
            <p className="text-sm text-red-500">{errors.make.message}</p>
          )}
        </div>
        
        {/* Model input */}
        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Input
            id="model"
            placeholder="e.g., Camry"
            {...register("model")}
            className={errors.model ? "border-red-500" : ""}
          />
          {errors.model && (
            <p className="text-sm text-red-500">{errors.model.message}</p>
          )}
        </div>
        
        {/* Year input */}
        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Select defaultValue={currentYear.toString()} {...register("year")}>
            <SelectTrigger className={errors.year ? "border-red-500" : ""}>
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
          {errors.year && (
            <p className="text-sm text-red-500">{errors.year.message}</p>
          )}
        </div>
        
        {/* Mileage input */}
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            placeholder="e.g., 50000"
            {...register("mileage", { valueAsNumber: true })}
            className={errors.mileage ? "border-red-500" : ""}
          />
          {errors.mileage && (
            <p className="text-sm text-red-500">{errors.mileage.message}</p>
          )}
        </div>
        
        {/* Condition input */}
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select defaultValue={ConditionLevel.Good} {...register("condition")}>
            <SelectTrigger className={errors.condition ? "border-red-500" : ""}>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {conditions.map((condition) => (
                <SelectItem key={condition.value} value={condition.value}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.condition && (
            <p className="text-sm text-red-500">{errors.condition.message}</p>
          )}
        </div>
        
        {/* Zip Code input */}
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            placeholder="e.g., 90210"
            {...register("zipCode")}
            className={errors.zipCode ? "border-red-500" : ""}
          />
          {errors.zipCode && (
            <p className="text-sm text-red-500">{errors.zipCode.message}</p>
          )}
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processing..." : submitButtonText}
      </Button>
    </form>
  );
};

export default ManualEntryForm;
