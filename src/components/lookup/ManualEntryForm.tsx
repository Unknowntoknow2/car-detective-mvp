<<<<<<< HEAD

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
=======
import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { validateVin } from "@/utils/validation/vin-validation";
import { AlertCircle } from "lucide-react";
import {
  ConditionLevel,
  ManualEntryFormData,
} from "@/components/lookup/types/manualEntry";

// Import our component parts
import { VehicleBasicInfoFields } from "./manual/components/VehicleBasicInfoFields";
import { VehicleDetailsFields } from "./manual/components/VehicleDetailsFields";
import { ConditionAndZipFields } from "./manual/components/ConditionAndZipFields";
import { VinInputField } from "./manual/components/VinInputField";

// Extend the form schema to include VIN
const formSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().regex(/^\d{4}$/, "Enter a valid 4-digit year"),
  mileage: z.string().regex(/^\d+$/, "Enter a valid mileage"),
  condition: z.string().min(1, "Condition is required"),
  zipCode: z.string().regex(/^\d{5}$/, "Enter a valid 5-digit ZIP code"),
  vin: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  trim: z.string().optional(),
  color: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export interface ManualEntryFormProps {
  onSubmit?: (data: ManualEntryFormData) => void;
  onVehicleFound?: (data: any) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}

<<<<<<< HEAD
export function ManualEntryForm({ 
  onSubmit, 
  onVehicleFound, 
  isLoading = false, 
  submitButtonText = 'Continue with Manual Entry',
  isPremium = false 
}: ManualEntryFormProps) {
  const [formData, setFormData] = useState({
    year: '',
    make: '',
    model: '',
    mileage: '',
    vin: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulate manual entry processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const vehicleData = {
        ...formData,
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage),
        vin: formData.vin || 'MANUAL_ENTRY'
      };

      toast.success('Vehicle information entered successfully!');
      
      // Call the appropriate handler
      if (onSubmit) {
        onSubmit(vehicleData as ManualEntryFormData);
=======
export const ManualEntryForm: React.FC<ManualEntryFormProps> = ({
  onSubmit,
  isLoading = false,
  submitButtonText = "Get Valuation",
  isPremium = false,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      mileage: "",
      condition: "",
      zipCode: "",
      vin: "",
      fuelType: "",
      transmission: "",
      trim: "",
      color: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    // Only check VIN validation if a value is provided
    if (values.vin && values.vin.trim() !== "") {
      const validation = validateVin(values.vin);
      if (!validation.isValid) {
        // We don't need to set error state here as it's handled in the VinInputField component
        return;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      }
      if (onVehicleFound) {
        onVehicleFound(vehicleData);
      }
    } catch (error) {
      console.error('Manual entry error:', error);
      toast.error('Failed to process vehicle information');
    }
<<<<<<< HEAD
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Manual Vehicle Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                placeholder="2020"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                placeholder="Toyota"
                required
              />
            </div>
          </div>
=======

    // Convert string values to appropriate types for ManualEntryFormData
    const formattedData: ManualEntryFormData = {
      make: values.make,
      model: values.model,
      year: parseInt(values.year),
      mileage: parseInt(values.mileage),
      condition: (values.condition as ConditionLevel) || ConditionLevel.Good,
      zipCode: values.zipCode,
      fuelType: values.fuelType,
      transmission: values.transmission,
      trim: values.trim,
      color: values.color,
      vin: values.vin,
    };

    onSubmit(formattedData);
  };

  const conditionOptions = [
    { value: ConditionLevel.Excellent, label: "Excellent" },
    { value: ConditionLevel.Good, label: "Good" },
    { value: ConditionLevel.Fair, label: "Fair" },
    { value: ConditionLevel.Poor, label: "Poor" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <VehicleBasicInfoFields form={form} />
          <VehicleDetailsFields form={form} />
          <ConditionAndZipFields
            form={form}
            conditionOptions={conditionOptions}
          />
        </div>

        {/* VIN field with validation */}
        <VinInputField form={form} />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Processing..." : submitButtonText}
        </Button>
      </form>
    </Form>
  );
};
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                placeholder="Camry"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                placeholder="50000"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vin">VIN (Optional)</Label>
            <Input
              id="vin"
              value={formData.vin}
              onChange={(e) => setFormData(prev => ({ ...prev, vin: e.target.value.toUpperCase() }))}
              placeholder="17-character VIN (optional)"
              maxLength={17}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Default export for compatibility
export default ManualEntryForm;
