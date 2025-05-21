
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { DealerVehicleFormData } from '@/types/dealerVehicle';
import { ImageUploadSection } from './vehicle-upload/ImageUploadSection';
import { ConditionSelector } from './vehicle-upload/ConditionSelector';

interface VehicleUploadFormProps {
  onSubmit: (data: DealerVehicleFormData, photos?: File[]) => void;
  initialData?: Partial<DealerVehicleFormData>;
}

export const VehicleUploadForm: React.FC<VehicleUploadFormProps> = ({
  onSubmit,
  initialData
}) => {
  const [photos, setPhotos] = useState<File[]>([]);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<DealerVehicleFormData>({
    defaultValues: initialData || {
      status: 'available',
      condition: 'Good',
      fuel_type: undefined,
      transmission: undefined,
      zip_code: ''
    }
  });
  
  const selectedCondition = watch('condition');
  
  const handleConditionChange = (condition: "Excellent" | "Good" | "Fair" | "Poor") => {
    setValue('condition', condition);
  };
  
  const handleFormSubmit = (data: DealerVehicleFormData) => {
    onSubmit(data, photos.length > 0 ? photos : undefined);
  };
  
  const handlePhotosChange = (newPhotos: File[]) => {
    setPhotos(newPhotos);
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input 
            id="make" 
            {...register('make', { required: 'Make is required' })} 
          />
          {errors.make && <p className="text-sm text-red-500">{errors.make.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input 
            id="model" 
            {...register('model', { required: 'Model is required' })} 
          />
          {errors.model && <p className="text-sm text-red-500">{errors.model.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input 
            id="year" 
            type="number" 
            {...register('year', { 
              required: 'Year is required',
              valueAsNumber: true,
              min: { value: 1900, message: 'Year must be after 1900' },
              max: { value: new Date().getFullYear() + 1, message: 'Year cannot be in the future' }
            })} 
          />
          {errors.year && <p className="text-sm text-red-500">{errors.year.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input 
            id="mileage" 
            type="number" 
            {...register('mileage', { 
              valueAsNumber: true,
              min: { value: 0, message: 'Mileage cannot be negative' }
            })} 
          />
          {errors.mileage && <p className="text-sm text-red-500">{errors.mileage.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input 
            id="price" 
            type="number" 
            {...register('price', { 
              required: 'Price is required',
              valueAsNumber: true,
              min: { value: 0, message: 'Price cannot be negative' }
            })} 
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select 
            value={selectedCondition} 
            onValueChange={(value) => handleConditionChange(value as "Excellent" | "Good" | "Fair" | "Poor")}
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
          {errors.condition && <p className="text-sm text-red-500">{errors.condition.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            defaultValue={watch('status')} 
            onValueChange={(value) => setValue('status', value as "available" | "pending" | "sold")}
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
          {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fuel_type">Fuel Type</Label>
          <Select 
            defaultValue={watch('fuel_type')} 
            onValueChange={(value) => setValue('fuel_type', value as "Gasoline" | "Diesel" | "Hybrid" | "Electric")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gasoline">Gasoline</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
            </SelectContent>
          </Select>
          {errors.fuel_type && <p className="text-sm text-red-500">{errors.fuel_type.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="transmission">Transmission</Label>
          <Select 
            defaultValue={watch('transmission')} 
            onValueChange={(value) => setValue('transmission', value as "Automatic" | "Manual")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Automatic">Automatic</SelectItem>
              <SelectItem value="Manual">Manual</SelectItem>
            </SelectContent>
          </Select>
          {errors.transmission && <p className="text-sm text-red-500">{errors.transmission.message}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="zip_code">ZIP Code</Label>
        <Input 
          id="zip_code" 
          {...register('zip_code', { 
            required: 'ZIP code is required',
            pattern: {
              value: /^\d{5}$/,
              message: 'Please enter a valid 5-digit ZIP code'
            }
          })} 
        />
        {errors.zip_code && <p className="text-sm text-red-500">{errors.zip_code.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea 
          id="description" 
          className="w-full p-2 border rounded-lg min-h-[100px]"
          {...register('description')} 
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label>Photos</Label>
        <ImageUploadSection onPhotosChange={handlePhotosChange} />
      </div>
      
      <Button type="submit" className="w-full">
        Submit Vehicle
      </Button>
    </form>
  );
};
