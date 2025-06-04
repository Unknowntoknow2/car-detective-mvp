<<<<<<< HEAD

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DealerVehicle } from '@/types/dealerVehicle';
=======
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { VehicleFormValues, vehicleSchema } from "./schemas/vehicleSchema";
import { useVehicleUpload } from "./hooks/useVehicleUpload";
import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { VehicleForm } from "./modals/VehicleForm";
import { DealerVehicleFormData } from "@/types/vehicle";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface AddEditVehicleFormProps {
  vehicle?: DealerVehicle;
  vehicleId?: string;
  onSubmit?: (vehicle: Partial<DealerVehicle>) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
}

<<<<<<< HEAD
export const AddEditVehicleForm: React.FC<AddEditVehicleFormProps> = ({
  vehicle,
  vehicleId,
  onSubmit,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    price: vehicle?.price || 0,
    mileage: vehicle?.mileage || 0,
    vin: vehicle?.vin || '',
    status: vehicle?.status || 'available'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Call onSubmit if provided
    if (onSubmit) {
      onSubmit(formData);
    }
    
    // Call onSuccess if provided (for modal closing)
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
=======
const AddEditVehicleForm: React.FC<AddEditVehicleFormProps> = (
  { vehicleId, onSuccess },
) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    isUploading,
    photoUrls,
    setPhotoUrls,
    handlePhotoUpload,
    removePhoto,
    addVehicle,
    updateVehicle,
    fetchVehicle,
  } = useVehicleUpload();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: null,
      condition: "Good",
      status: "available",
      transmission: undefined,
      fuel_type: undefined,
      zip_code: "",
    },
  });

  useEffect(() => {
    const loadVehicle = async () => {
      const idToUse = vehicleId || id;
      if (idToUse) {
        setIsLoading(true);
        try {
          const vehicle = await fetchVehicle(idToUse);
          if (vehicle) {
            form.reset({
              make: vehicle.make,
              model: vehicle.model,
              year: vehicle.year,
              price: vehicle.price,
              mileage: vehicle.mileage,
              condition: vehicle.condition as
                | "Excellent"
                | "Good"
                | "Fair"
                | "Poor",
              status: vehicle.status as "available" | "pending" | "sold",
              transmission: vehicle.transmission as
                | "Automatic"
                | "Manual"
                | undefined,
              fuel_type: vehicle.fuel_type as
                | "Gasoline"
                | "Diesel"
                | "Hybrid"
                | "Electric"
                | undefined,
              zip_code: vehicle.zip_code || "",
            });

            if (vehicle.photos && Array.isArray(vehicle.photos)) {
              // Convert JSON array to string array
              const photoUrlStrings = vehicle.photos.map((photo) =>
                String(photo)
              );
              setPhotoUrls(photoUrlStrings);
            }
          } else {
            toast.error("Vehicle not found");
            navigate("/dealer/inventory");
          }
        } catch (error) {
          toast.error("Failed to load vehicle");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadVehicle();
  }, [vehicleId, id, fetchVehicle, form, navigate, setPhotoUrls]);

  const onSubmit = async (data: VehicleFormValues) => {
    try {
      setIsSubmitting(true);

      // Convert VehicleFormValues to DealerVehicleFormData
      const vehicleData: DealerVehicleFormData = {
        make: data.make,
        model: data.model,
        year: data.year,
        price: data.price,
        mileage: data.mileage,
        condition: data.condition,
        status: data.status,
        transmission: data.transmission,
        fuel_type: data.fuel_type,
        zip_code: data.zip_code,
      };

      const idToUpdate = vehicleId || id;
      if (idToUpdate) {
        await updateVehicle(idToUpdate, vehicleData);
        toast.success("Vehicle updated successfully");
      } else {
        await addVehicle(vehicleData);
        toast.success("Vehicle added successfully");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/dealer/inventory");
      }
    } catch (error) {
      console.error("Error saving vehicle:", error);
      toast.error("Failed to save vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loading />
      </div>
    );
  }
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="make">Make</Label>
        <Input
          id="make"
          value={formData.make}
          onChange={(e) => handleInputChange('make', e.target.value)}
          required
        />
<<<<<<< HEAD
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

      <div>
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          type="number"
          value={formData.year}
          onChange={(e) => handleInputChange('year', parseInt(e.target.value) || new Date().getFullYear())}
          required
        />
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
          required
        />
      </div>

      <div>
        <Label htmlFor="mileage">Mileage</Label>
        <Input
          id="mileage"
          type="number"
          value={formData.mileage}
          onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
          required
        />
      </div>

      <div>
        <Label htmlFor="vin">VIN</Label>
        <Input
          id="vin"
          value={formData.vin}
          onChange={(e) => handleInputChange('vin', e.target.value)}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">
          {vehicle || vehicleId ? 'Update Vehicle' : 'Add Vehicle'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
=======

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dealer/inventory")}
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting || isUploading
              ? "Saving..."
              : id || vehicleId
              ? "Update Vehicle"
              : "Add Vehicle"}
          </Button>
        </div>
      </form>
    </Form>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
};

export default AddEditVehicleForm;
