
import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DealerVehicleFormData } from '@/types/dealerVehicle';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useVehicleUpload } from './hooks/useVehicleUpload';

// Define a schema for form validation that matches DealerVehicleFormData
const vehicleFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900, "Year must be valid").max(new Date().getFullYear() + 1),
  price: z.number().min(0, "Price must be a positive number"),
  mileage: z.number().min(0, "Mileage must be a positive number").nullable().optional(),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor"]),
  status: z.enum(["available", "pending", "sold"]),
  photos: z.array(z.string()).default([]),
  transmission: z.enum(["Automatic", "Manual", "CVT"]).optional(),
  fuel_type: z.enum(["Gasoline", "Diesel", "Hybrid", "Electric"]).optional(),
  zip_code: z.string().optional(),
  description: z.string().optional(),
  vin: z.string().optional(),
  color: z.string().optional(),
});

// Define the type from the schema
type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface AddEditVehicleFormProps {
  vehicleId?: string;
  onSuccess?: () => void;
}

export const AddEditVehicleForm: React.FC<AddEditVehicleFormProps> = ({ vehicleId, onSuccess }) => {
  const [formData, setFormData] = useState<VehicleFormValues>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    condition: 'Good',
    status: 'available',
    photos: [],
    color: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [filePhotos, setFilePhotos] = useState<File[]>([]);
  const { fetchVehicle, updateVehicle, addVehicle, photoUrls, setPhotoUrls, handlePhotoUpload } = useVehicleUpload();

  // Initialize the form with zodResolver
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    if (vehicleId) {
      const loadVehicle = async () => {
        setIsLoading(true);
        try {
          const vehicleData = await fetchVehicle(vehicleId);
          if (vehicleData) {
            // Convert the vehicle data to match our form structure
            const formattedData: VehicleFormValues = {
              make: vehicleData.make,
              model: vehicleData.model,
              year: vehicleData.year,
              price: vehicleData.price,
              mileage: vehicleData.mileage || null,
              condition: vehicleData.condition,
              status: vehicleData.status,
              photos: vehicleData.photos || [],
              transmission: vehicleData.transmission,
              fuel_type: vehicleData.fuel_type,
              zip_code: vehicleData.zip_code,
              description: vehicleData.description,
              vin: vehicleData.vin,
              color: vehicleData.color,
            };
            
            setFormData(formattedData);
            setPhotoUrls(formattedData.photos);
            form.reset(formattedData);
          }
        } catch (error) {
          console.error('Error loading vehicle:', error);
          toast.error('Failed to load vehicle data');
        } finally {
          setIsLoading(false);
        }
      };

      loadVehicle();
    }
  }, [vehicleId, fetchVehicle, form, setPhotoUrls]);

  const onSubmit: SubmitHandler<VehicleFormValues> = async (data) => {
    setIsLoading(true);
    try {
      // Convert the form data to match our DealerVehicleFormData structure
      const vehicleData: DealerVehicleFormData = {
        ...data,
        photos: photoUrls,
      };

      if (vehicleId) {
        await updateVehicle(vehicleId, vehicleData);
        toast.success('Vehicle updated successfully');
      } else {
        await addVehicle(vehicleData);
        toast.success('Vehicle added successfully');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast.error('Failed to save vehicle data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files);
      setFilePhotos(prev => [...prev, ...newFiles]);
      handlePhotoUpload(newFiles);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Toyota" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Camry" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))}
                      placeholder="2020" 
                      disabled={isLoading} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                      placeholder="25000" 
                      disabled={isLoading} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mileage</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="35000" 
                      disabled={isLoading} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="White" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="transmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transmission</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fuel_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zip_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="90210" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Vehicle Identification Number" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="Provide a detailed description of the vehicle" 
                    className="h-32" 
                    disabled={isLoading} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Photos</FormLabel>
            <div className="grid grid-cols-3 gap-4">
              {photoUrls.map((url, index) => (
                <div key={index} className="relative h-24 bg-gray-100 rounded overflow-hidden">
                  <img src={url} alt={`Vehicle ${index}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoUrls(photoUrls.filter((_, i) => i !== index))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleFileChange}
                disabled={isLoading}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary/80"
              />
              <FormDescription>
                Upload photos of the vehicle. Multiple photos can be selected.
              </FormDescription>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onSuccess && onSuccess()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : vehicleId ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddEditVehicleForm;
