
import React, { useState } from 'react';
import { X, Loader2, Save, Car, UploadCloud } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VehicleFormValues, vehicleSchema } from '../schemas/vehicleSchema';
import { useVehicleUploadModal } from '../hooks/useVehicleUploadModal';
import { useVehicleUpload } from '../hooks/useVehicleUpload';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { ImageUploadSection } from './ImageUploadSection';
import { ConditionSelector } from './ConditionSelector';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const VehicleUploadModal = () => {
  const { isOpen, onClose } = useVehicleUploadModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    isUploading,
    uploadProgress,
    photoUrls,
    handlePhotoUpload,
    removePhoto,
    addVehicle,
  } = useVehicleUpload();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: null,
      condition: 'Good',
      status: 'available',
    },
  });

  const handleSubmit = async (data: VehicleFormValues) => {
    setIsSubmitting(true);
    try {
      await addVehicle(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error adding vehicle:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Add New Vehicle
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Vehicle Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Input 
                      id="make" 
                      placeholder="e.g. Toyota" 
                      {...form.register("make")} 
                    />
                    {form.formState.errors.make && (
                      <p className="text-destructive text-sm">{form.formState.errors.make.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input 
                      id="model" 
                      placeholder="e.g. Camry" 
                      {...form.register("model")} 
                    />
                    {form.formState.errors.model && (
                      <p className="text-destructive text-sm">{form.formState.errors.model.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input 
                      id="year" 
                      type="number" 
                      placeholder="e.g. 2022" 
                      {...form.register("year", { valueAsNumber: true })} 
                    />
                    {form.formState.errors.year && (
                      <p className="text-destructive text-sm">{form.formState.errors.year.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      placeholder="e.g. 25000" 
                      {...form.register("price", { valueAsNumber: true })} 
                    />
                    {form.formState.errors.price && (
                      <p className="text-destructive text-sm">{form.formState.errors.price.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input 
                      id="mileage" 
                      type="number" 
                      placeholder="e.g. 15000" 
                      {...form.register("mileage", { valueAsNumber: true })} 
                    />
                    {form.formState.errors.mileage && (
                      <p className="text-destructive text-sm">{form.formState.errors.mileage.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select 
                      onValueChange={(value) => form.setValue("condition", value as "Excellent" | "Good" | "Fair" | "Poor")} 
                      defaultValue={form.getValues("condition")}
                    >
                      <SelectTrigger id="condition">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.condition && (
                      <p className="text-destructive text-sm">{form.formState.errors.condition.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      onValueChange={(value) => form.setValue("status", value as "available" | "pending" | "sold")} 
                      defaultValue={form.getValues("status")}
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
                    {form.formState.errors.status && (
                      <p className="text-destructive text-sm">{form.formState.errors.status.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">ZIP Code</Label>
                    <Input 
                      id="zip_code" 
                      placeholder="e.g. 90210" 
                      {...form.register("zip_code")} 
                    />
                    {form.formState.errors.zip_code && (
                      <p className="text-destructive text-sm">{form.formState.errors.zip_code.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission</Label>
                    <Select 
                      onValueChange={(value) => form.setValue("transmission", value as "Automatic" | "Manual")} 
                      defaultValue={form.getValues("transmission") || undefined}
                    >
                      <SelectTrigger id="transmission">
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.transmission && (
                      <p className="text-destructive text-sm">{form.formState.errors.transmission.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuel_type">Fuel Type</Label>
                    <Select 
                      onValueChange={(value) => form.setValue("fuel_type", value as "Gasoline" | "Diesel" | "Hybrid" | "Electric")} 
                      defaultValue={form.getValues("fuel_type") || undefined}
                    >
                      <SelectTrigger id="fuel_type">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gasoline">Gasoline</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.fuel_type && (
                      <p className="text-destructive text-sm">{form.formState.errors.fuel_type.message}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Photos Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Vehicle Photos</h3>
                <ImageUploadSection 
                  photoUrls={photoUrls}
                  handlePhotoUpload={handlePhotoUpload}
                  removePhoto={removePhoto}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting || isUploading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || isUploading}
                className="gap-2"
              >
                {isSubmitting || isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Vehicle
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
