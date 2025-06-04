<<<<<<< HEAD

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DealerVehicleFormData } from '@/types/dealerVehicle';
=======
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DealerVehicleFormData,
  DealerVehicleStatus,
} from "@/types/dealerVehicle";
import { ImageUploadSection } from "./vehicle-upload/ImageUploadSection";
import { ConditionSelector } from "./vehicle-upload/ConditionSelector";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface VehicleUploadFormProps {
  onSubmit: (data: DealerVehicleFormData, photos?: File[]) => Promise<void>;
}

<<<<<<< HEAD
export const VehicleUploadForm: React.FC<VehicleUploadFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<DealerVehicleFormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: null,
    price: 0,
    condition: 'Good',
    status: 'available',
    photos: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof DealerVehicleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

=======
export const VehicleUploadForm: React.FC<VehicleUploadFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const [photos, setPhotos] = useState<File[]>([]);

  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<DealerVehicleFormData>({
      defaultValues: initialData || {
        status: "available",
        condition: "good",
        fuel_type: "",
        transmission: "",
        zip_code: "",
      },
    });

  const selectedCondition = watch("condition");

  const handleConditionChange = (condition: string) => {
    setValue("condition", condition);
  };

  const handleFormSubmit = (data: DealerVehicleFormData) => {
    onSubmit(data, photos.length > 0 ? photos : undefined);
  };

  const handlePhotosChange = (newPhotos: File[]) => {
    setPhotos(newPhotos);
  };

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
<<<<<<< HEAD
            value={formData.make}
            onChange={(e) => handleInputChange('make', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => handleInputChange('model', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
=======
            {...register("make", { required: "Make is required" })}
          />
          {errors.make && (
            <p className="text-sm text-red-500">{errors.make.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            {...register("model", { required: "Model is required" })}
          />
          {errors.model && (
            <p className="text-sm text-red-500">{errors.model.message}</p>
          )}
        </div>

        <div className="space-y-2">
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
<<<<<<< HEAD
            value={formData.year}
            onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
            required
          />
        </div>
        <div>
=======
            {...register("year", {
              required: "Year is required",
              min: { value: 1900, message: "Year must be after 1900" },
              max: {
                value: new Date().getFullYear() + 1,
                message: "Year cannot be in the future",
              },
            })}
          />
          {errors.year && (
            <p className="text-sm text-red-500">{errors.year.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
<<<<<<< HEAD
            value={formData.mileage || ''}
            onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || null)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
          required
        />
      </div>

      <div>
        <Label htmlFor="condition">Condition</Label>
        <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Excellent">Excellent</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Fair">Fair</SelectItem>
            <SelectItem value="Poor">Poor</SelectItem>
          </SelectContent>
        </Select>
=======
            {...register("mileage", {
              valueAsNumber: true,
              min: { value: 0, message: "Mileage cannot be negative" },
            })}
          />
          {errors.mileage && (
            <p className="text-sm text-red-500">{errors.mileage.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: { value: 0, message: "Price cannot be negative" },
            })}
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            defaultValue={initialData?.status || "available"}
            onValueChange={(value) =>
              setValue("status", value as DealerVehicleStatus)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuel_type">Fuel Type</Label>
          <Select
            defaultValue={initialData?.fuel_type || ""}
            onValueChange={(value) =>
              setValue("fuel_type", value)}
          >
            <SelectTrigger id="fuel_type">
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gasoline">Gasoline</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transmission">Transmission</Label>
          <Select
            defaultValue={initialData?.transmission || ""}
            onValueChange={(value) =>
              setValue("transmission", value)}
          >
            <SelectTrigger id="transmission">
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automatic">Automatic</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="cvt">CVT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zip_code">ZIP Code</Label>
        <Input
          id="zip_code"
          {...register("zip_code", {
            pattern: {
              value: /^\d{5}(-\d{4})?$/,
              message: "Please enter a valid ZIP code",
            },
          })}
        />
        {errors.zip_code && (
          <p className="text-sm text-red-500">{errors.zip_code.message}</p>
        )}
      </div>

      <ConditionSelector
        selectedCondition={selectedCondition}
        onConditionChange={handleConditionChange}
      />

      <ImageUploadSection onChange={handlePhotosChange} />

      <div className="pt-4">
        <Button type="submit" className="w-full">
          Add Vehicle
        </Button>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </div>

      <Button type="submit" className="w-full">
        Add Vehicle
      </Button>
    </form>
  );
};
