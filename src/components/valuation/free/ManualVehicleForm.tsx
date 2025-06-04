<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ManualVehicleInfo } from '@/hooks/useManualValuation';
import { useVehicleDBData } from '@/hooks/useVehicleDBData';
import { Skeleton } from '@/components/ui/skeleton';
=======
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ManualVehicleInfo } from "@/hooks/useManualValuation";
import { useVehicleDBData } from "@/hooks/useVehicleDBData";
import { Skeleton } from "@/components/ui/skeleton";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface ManualVehicleFormProps {
  formData: ManualVehicleInfo;
  setFormData: (data: ManualVehicleInfo) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}

export function ManualVehicleForm({
  formData,
  setFormData,
  onSubmit,
  isLoading,
  error,
}: ManualVehicleFormProps) {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const {
    makes,
    models,
    isLoading: isDataLoading,
    error: dataError,
    getModelsByMakeId,
    getYears,
  } = useVehicleDBData();
  const [loadingModels, setLoadingModels] = useState(false);
  const years = getYears();
  const currentYear = new Date().getFullYear();

  const initialFormData = {
    make: '',
    model: '',
    year: currentYear,
    mileage: '',
    condition: 'Good',
    trim: '',
    features: []
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear validation error for this field if it exists
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });

    // If changing make, fetch models for this make and reset model
<<<<<<< HEAD
    if (name === 'make') {
=======
    if (name === "makeId") {
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      handleMakeChange(value);
    }

    // Clear validation error for this field if it exists
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors };
      delete newErrors[name];
      setValidationErrors(newErrors);
    }
  };

  const handleMakeChange = async (makeId: string) => {
    try {
      setLoadingModels(true);
      // Update formData with the new makeId and reset modelId
<<<<<<< HEAD
      setFormData({ ...formData, make: makeId, model: '' });
      
=======
      setFormData({ ...formData, makeId, modelId: "" });

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      // Get make name for display
      const selectedMake = makes.find((m) => m.id === makeId);
      console.log(`Selected make: ${selectedMake?.name} (${makeId})`);

      // Fetch models for this make
      await getModelsByMakeId(makeId);
    } catch (err) {
      console.error("Error handling make change:", err);
    } finally {
      setLoadingModels(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
<<<<<<< HEAD
    
    if (!formData.make || formData.make.trim() === '')
      errors.make = 'Make is required';
    
    if (!formData.model || formData.model.trim() === '')
      errors.model = 'Model is required';
    
    if (!formData.year || formData.year <= 0)
      errors.year = 'Valid year is required';
    
    if (!formData.mileage || formData.mileage <= 0)
      errors.mileage = 'Valid mileage is required';
    
    if (!formData.zipCode || formData.zipCode.trim() === '')
      errors.zipCode = 'ZIP code is required';
    
    if (!formData.condition || formData.condition.trim() === '')
      errors.condition = 'Condition is required';
    
=======

    if (!formData.makeId || formData.makeId.trim() === "") {
      errors.makeId = "Make is required";
    }

    if (!formData.modelId || formData.modelId.trim() === "") {
      errors.modelId = "Model is required";
    }

    if (!formData.year || formData.year <= 0) {
      errors.year = "Valid year is required";
    }

    if (!formData.mileage || formData.mileage <= 0) {
      errors.mileage = "Valid mileage is required";
    }

    if (!formData.zipCode || formData.zipCode.trim() === "") {
      errors.zipCode = "ZIP code is required";
    }

    if (!formData.condition || formData.condition.trim() === "") {
      errors.condition = "Condition is required";
    }

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmitForm} className="space-y-6">
      {(error || dataError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || dataError}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
<<<<<<< HEAD
          <Label htmlFor="make">Make</Label>
          {isDataLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              disabled={isLoading || isDataLoading}
              value={formData.make}
              onValueChange={(value) => handleSelectChange('make', value)}
            >
              <SelectTrigger id="make" className={validationErrors.make ? 'border-red-500' : ''}>
=======
          <Label htmlFor="makeId">Make</Label>
          {isDataLoading ? <Skeleton className="h-10 w-full" /> : (
            <Select
              disabled={isLoading || isDataLoading}
              value={formData.makeId}
              onValueChange={(value) => handleSelectChange("makeId", value)}
            >
              <SelectTrigger
                id="makeId"
                className={validationErrors.makeId ? "border-red-500" : ""}
              >
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
                <SelectValue placeholder="Select make" />
              </SelectTrigger>
              <SelectContent>
                {makes.map((make) => (
                  <SelectItem key={make.id} value={make.id}>
                    {make.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {validationErrors.make && (
            <p className="text-sm text-red-500">{validationErrors.make}</p>
          )}
        </div>

        <div className="space-y-2">
<<<<<<< HEAD
          <Label htmlFor="model">Model</Label>
          {isDataLoading || loadingModels ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              disabled={isLoading || !formData.make}
              value={formData.model}
              onValueChange={(value) => handleSelectChange('model', value)}
            >
              <SelectTrigger id="model" className={validationErrors.model ? 'border-red-500' : ''}>
                <SelectValue placeholder={formData.make ? "Select model" : "Select make first"} />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {validationErrors.model && (
            <p className="text-sm text-red-500">{validationErrors.model}</p>
=======
          <Label htmlFor="modelId">Model</Label>
          {isDataLoading || loadingModels
            ? <Skeleton className="h-10 w-full" />
            : (
              <Select
                disabled={isLoading || !formData.makeId}
                value={formData.modelId}
                onValueChange={(value) => handleSelectChange("modelId", value)}
              >
                <SelectTrigger
                  id="modelId"
                  className={validationErrors.modelId ? "border-red-500" : ""}
                >
                  <SelectValue
                    placeholder={formData.makeId
                      ? "Select model"
                      : "Select make first"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          {validationErrors.modelId && (
            <p className="text-sm text-red-500">{validationErrors.modelId}</p>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select
            disabled={isLoading}
            value={formData.year ? formData.year.toString() : ""}
            onValueChange={(value) => handleSelectChange("year", value)}
          >
            <SelectTrigger
              id="year"
              className={validationErrors.year ? "border-red-500" : ""}
            >
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
          {validationErrors.year && (
            <p className="text-sm text-red-500">{validationErrors.year}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            min="0"
            value={formData.mileage || ""}
            onChange={handleChange}
            placeholder="e.g., 42000"
            disabled={isLoading}
            className={validationErrors.mileage ? "border-red-500" : ""}
          />
          {validationErrors.mileage && (
            <p className="text-sm text-red-500">{validationErrors.mileage}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={formData.zipCode || ""}
            onChange={handleChange}
            placeholder="e.g., 90210"
            maxLength={5}
            disabled={isLoading}
            className={validationErrors.zipCode ? "border-red-500" : ""}
          />
          {validationErrors.zipCode && (
            <p className="text-sm text-red-500">{validationErrors.zipCode}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select
            disabled={isLoading}
            value={formData.condition || ""}
            onValueChange={(value) => handleSelectChange("condition", value)}
          >
            <SelectTrigger
              id="condition"
              className={validationErrors.condition ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
          {validationErrors.condition && (
            <p className="text-sm text-red-500">{validationErrors.condition}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading
          ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting Valuation...
            </>
          )
          : (
            "Get Free Valuation"
          )}
      </Button>
    </form>
  );
}
