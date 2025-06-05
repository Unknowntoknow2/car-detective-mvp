
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { vehicleSchema, VehicleFormData } from "./schemas/vehicleSchema";

interface AddEditVehicleFormProps {
  vehicleId?: string;
  onSuccess?: () => void;
}

const AddEditVehicleForm: React.FC<AddEditVehicleFormProps> = ({
  vehicleId,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      status: "available",
      condition: "Good",
      photos: [],
    },
  });

  const onSubmit = async (data: VehicleFormData) => {
    if (!user) {
      toast.error("You must be logged in to add a vehicle");
      return;
    }

    setIsLoading(true);

    try {
      const vehicleData = {
        ...data,
        dealer_id: user.id,
      };

      if (vehicleId) {
        const { error } = await supabase
          .from("dealer_vehicles")
          .update(vehicleData)
          .eq("id", vehicleId);

        if (error) throw error;
        toast.success("Vehicle updated successfully");
      } else {
        const { error } = await supabase
          .from("dealer_vehicles")
          .insert([vehicleData]);

        if (error) throw error;
        toast.success("Vehicle added successfully");
      }

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error saving vehicle:", error);
      toast.error(error.message || "Failed to save vehicle");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            {...register("make")}
            placeholder="Toyota"
          />
          {errors.make && (
            <p className="text-sm text-red-600 mt-1">{errors.make.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            {...register("model")}
            placeholder="Camry"
          />
          {errors.model && (
            <p className="text-sm text-red-600 mt-1">{errors.model.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            {...register("year", { valueAsNumber: true })}
            placeholder="2020"
          />
          {errors.year && (
            <p className="text-sm text-red-600 mt-1">{errors.year.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            {...register("mileage", { valueAsNumber: true })}
            placeholder="50000"
          />
          {errors.mileage && (
            <p className="text-sm text-red-600 mt-1">{errors.mileage.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="25000"
          />
          {errors.price && (
            <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="vin">VIN</Label>
          <Input
            id="vin"
            {...register("vin")}
            placeholder="1HGBH41JXMN109186"
          />
          {errors.vin && (
            <p className="text-sm text-red-600 mt-1">{errors.vin.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="condition">Condition</Label>
          <Select
            onValueChange={(value) => setValue("condition", value as any)}
            defaultValue="Good"
          >
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
          {errors.condition && (
            <p className="text-sm text-red-600 mt-1">{errors.condition.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            onValueChange={(value) => setValue("status", value as any)}
            defaultValue="available"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Additional details about the vehicle..."
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : vehicleId ? "Update Vehicle" : "Add Vehicle"}
        </Button>
      </div>
    </form>
  );
};

export default AddEditVehicleForm;
