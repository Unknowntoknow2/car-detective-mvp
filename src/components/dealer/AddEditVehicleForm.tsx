
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { LoaderCircle, Upload } from 'lucide-react';
import { DealerVehicleFormData } from '@/types/dealerVehicle';

interface AddEditVehicleFormProps {
  initialData?: Partial<DealerVehicleFormData>;
  onSubmit: (data: DealerVehicleFormData, photos?: File[]) => void;
  isSubmitting?: boolean;
  title?: string;
  buttonText?: string;
}

export const AddEditVehicleForm: React.FC<AddEditVehicleFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  title = 'Add Vehicle',
  buttonText = 'Add Vehicle'
}) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<DealerVehicleFormData>({
    defaultValues: initialData
  });
  
  const onFormSubmit = (data: DealerVehicleFormData) => {
    onSubmit(data, photos.length > 0 ? photos : undefined);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      setPhotos([...photos, ...fileList]);
      
      // Display file names
      const names = fileList.map(file => file.name);
      setPhotoNames([...photoNames, ...names]);
      
      // Reset input
      e.target.value = '';
    }
  };
  
  const removePhoto = (index: number) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
    
    const updatedPhotoNames = [...photoNames];
    updatedPhotoNames.splice(index, 1);
    setPhotoNames(updatedPhotoNames);
  };
  
  const removePhotoByName = (photoName: string) => {
    const index = photoNames.findIndex(name => name === photoName);
    if (index !== -1) {
      removePhoto(index);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input 
                id="make" 
                {...register('make', { required: 'Make is required' })}
              />
              {errors.make && <p className="text-red-500 text-sm">{errors.make.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input 
                id="model" 
                {...register('model', { required: 'Model is required' })}
              />
              {errors.model && <p className="text-red-500 text-sm">{errors.model.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input 
                id="year" 
                type="number" 
                {...register('year', { 
                  required: 'Year is required',
                  valueAsNumber: true,
                  min: {
                    value: 1900,
                    message: 'Year must be at least 1900'
                  },
                  max: {
                    value: new Date().getFullYear() + 1,
                    message: 'Year cannot be in the future'
                  }
                })}
              />
              {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input 
                id="price" 
                type="number" 
                {...register('price', { 
                  required: 'Price is required',
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: 'Price must be positive'
                  }
                })}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input 
                id="mileage" 
                type="number" 
                {...register('mileage', { 
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: 'Mileage must be positive'
                  }
                })}
              />
              {errors.mileage && <p className="text-red-500 text-sm">{errors.mileage.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <select 
                id="condition"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('condition', { required: 'Condition is required' })}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
              {errors.condition && <p className="text-red-500 text-sm">{errors.condition.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('status', { required: 'Status is required' })}
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <select 
                id="transmission"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('transmission')}
              >
                <option value="">Select transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fuel_type">Fuel Type</Label>
              <select 
                id="fuel_type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register('fuel_type')}
              >
                <option value="">Select fuel type</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input 
                id="zip_code" 
                {...register('zip_code')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vin">VIN</Label>
              <Input 
                id="vin" 
                {...register('vin')}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              rows={4}
              {...register('description')}
              placeholder="Enter vehicle description"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="photos">Photos</Label>
            <div className="border-2 border-dashed rounded-md p-4 text-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('photo-upload')?.click()}
                className="w-full py-8"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Photos
              </Button>
              <input 
                id="photo-upload" 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleFileChange}
                className="hidden" 
              />
            </div>
            
            {photoNames.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-1">Selected Files:</p>
                <ul className="text-sm space-y-1">
                  {photoNames.map((name, index) => (
                    <li key={index} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                      <span className="truncate">{name}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removePhoto(index)}
                        className="h-6 w-6 p-0"
                      >
                        &times;
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              buttonText
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddEditVehicleForm;
