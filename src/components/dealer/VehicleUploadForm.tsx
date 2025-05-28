
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

// Define ImageUploadSectionProps interface
interface ImageUploadSectionProps {
  onPhotosChange: (newPhotos: File[]) => void;
  photos?: File[];
}

// Simple implementation of ImageUploadSection
const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({ 
  onPhotosChange, 
  photos = [] 
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      onPhotosChange(selectedFiles);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Vehicle Photos</Label>
      <div className="border-2 border-dashed rounded-md p-4 text-center">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <Label htmlFor="file-upload" className="cursor-pointer">
          <div className="py-8 flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG, WEBP up to 10MB
            </p>
          </div>
        </Label>
      </div>
      
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
              <img
                src={URL.createObjectURL(photo)}
                alt={`Vehicle photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Simple implementation of ConditionSelector
const ConditionSelector: React.FC<{
  value: "Excellent" | "Good" | "Fair" | "Poor";
  onChange: (value: "Excellent" | "Good" | "Fair" | "Poor") => void;
}> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="condition">Condition</Label>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as "Excellent" | "Good" | "Fair" | "Poor")}
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
    </div>
  );
};

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
    setPhotos([...photos, ...newPhotos]);
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
        <ConditionSelector
          value={selectedCondition}
          onChange={handleConditionChange}
        />
        
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
            onValueChange={(value) => setValue('fuel_type', value as "Gasoline" | "Diesel" | "Hybrid" | "Electric" | undefined)}
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
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="transmission">Transmission</Label>
          <Select 
            defaultValue={watch('transmission')} 
            onValueChange={(value) => setValue('transmission', value as "Automatic" | "Manual" | "CVT" | undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Automatic">Automatic</SelectItem>
              <SelectItem value="Manual">Manual</SelectItem>
              <SelectItem value="CVT">CVT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register('description')}
          className="w-full rounded-md border border-gray-300 p-2"
          rows={4}
        ></textarea>
      </div>
      
      <ImageUploadSection
        onPhotosChange={handlePhotosChange}
        photos={photos}
      />
      
      <div className="flex justify-end">
        <Button type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default VehicleUploadForm;
