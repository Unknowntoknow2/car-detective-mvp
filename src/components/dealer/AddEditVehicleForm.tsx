import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { vehicleSchema, VehicleFormValues } from './schemas/vehicleSchema';
import { useVehicleUpload } from './hooks/useVehicleUpload';
import { Loading } from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DealerVehicleFormData } from '@/types/vehicle';

export interface AddEditVehicleFormProps {
  vehicleId?: string;
  onSuccess?: () => void;
}

const AddEditVehicleForm: React.FC<AddEditVehicleFormProps> = ({ vehicleId, onSuccess }) => {
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
    fetchVehicle
  } = useVehicleUpload();
  
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      condition: 'Good',
      status: 'available',
      transmission: undefined,
      fuel_type: undefined,
      zip_code: ''
    }
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
              mileage: vehicle.mileage || 0,
              condition: vehicle.condition as "Excellent" | "Good" | "Fair" | "Poor",
              status: vehicle.status as "available" | "pending" | "sold",
              transmission: vehicle.transmission as "Automatic" | "Manual" | undefined,
              fuel_type: vehicle.fuel_type as "Gasoline" | "Diesel" | "Hybrid" | "Electric" | undefined,
              zip_code: vehicle.zip_code || '',
              description: vehicle.description || ''
            });
            
            if (vehicle.photos && Array.isArray(vehicle.photos)) {
              // Convert JSON array to string array
              const photoUrlStrings = vehicle.photos.map(photo => String(photo));
              setPhotoUrls(photoUrlStrings);
            }
          } else {
            toast.error('Vehicle not found');
            navigate('/dealer/inventory');
          }
        } catch (error) {
          toast.error('Failed to load vehicle');
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
        description: data.description
      };
      
      const idToUpdate = vehicleId || id;
      if (idToUpdate) {
        await updateVehicle(idToUpdate, vehicleData);
        toast.success('Vehicle updated successfully');
      } else {
        await addVehicle(vehicleData);
        toast.success('Vehicle added successfully');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dealer/inventory');
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast.error('Failed to save vehicle');
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
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Vehicle information fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Make field */}
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Toyota" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Model field */}
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Camry" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Year field */}
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
                    onChange={(e) => field.onChange(parseInt(e.target.value) || new Date().getFullYear())}
                    placeholder="e.g. 2020" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Price field */}
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
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    placeholder="e.g. 25000" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Mileage field */}
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
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    value={field.value ?? 0}
                    placeholder="e.g. 50000" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Condition field */}
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
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
          
          {/* Status field */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
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
          
          {/* Transmission field */}
          <FormField
            control={form.control}
            name="transmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transmission</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Not specified</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Fuel Type field */}
          <FormField
            control={form.control}
            name="fuel_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Not specified</SelectItem>
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
          
          {/* Zip Code field */}
          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. 10001" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Description field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  value={field.value || ''}
                  placeholder="Enter vehicle description" 
                  className="min-h-[100px]" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Photos upload section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Photos</h3>
            <Button 
              type="button"
              variant="outline"
              onClick={() => document.getElementById('photo-upload')?.click()}
              disabled={isSubmitting || isUploading}
            >
              Add Photos
            </Button>
            <input
              id="photo-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  handlePhotoUpload(Array.from(e.target.files))
                }
              }}
              className="hidden"
            />
          </div>
          
          {/* Photos preview */}
          {photoUrls.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photoUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={url} 
                    alt={`Vehicle photo ${index + 1}`} 
                    className="w-full h-32 object-cover rounded-md" 
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded-md">
              <p className="text-gray-500">No photos uploaded</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/dealer/inventory')}
            disabled={isSubmitting || isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting || isUploading ? 'Saving...' : id || vehicleId ? 'Update Vehicle' : 'Add Vehicle'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddEditVehicleForm;
