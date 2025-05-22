
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DealerVehicleFormData } from '@/types/dealerVehicle';
import { Loader2 } from 'lucide-react';

// Create the form schema
const vehicleFormSchema = z.object({
  make: z.string().min(1, { message: 'Make is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(0),
  mileage: z.coerce.number().min(0).optional().nullable(),
  condition: z.enum(['Excellent', 'Good', 'Fair', 'Poor']),
  status: z.enum(['available', 'pending', 'sold']),
  transmission: z.enum(['Automatic', 'Manual', 'CVT']).optional(),
  fuel_type: z.enum(['Gasoline', 'Diesel', 'Hybrid', 'Electric']).optional(),
  zip_code: z.string().optional(),
  description: z.string().optional(),
  vin: z.string().optional(),
  color: z.string().optional(),
  photos: z.array(z.string())
});

interface AddEditVehicleFormProps {
  vehicleId?: string;
  initialData?: Partial<DealerVehicleFormData>;
  onSuccess?: () => void;
}

const AddEditVehicleForm: React.FC<AddEditVehicleFormProps> = ({
  vehicleId,
  initialData,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>(initialData?.photos || []);
  
  const form = useForm<z.infer<typeof vehicleFormSchema>>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      make: initialData?.make || '',
      model: initialData?.model || '',
      year: initialData?.year || new Date().getFullYear(),
      price: initialData?.price || 0,
      mileage: initialData?.mileage || 0,
      condition: initialData?.condition || 'Good',
      status: initialData?.status || 'available',
      transmission: initialData?.transmission || undefined,
      fuel_type: initialData?.fuel_type || undefined,
      zip_code: initialData?.zip_code || '',
      description: initialData?.description || '',
      vin: initialData?.vin || '',
      color: initialData?.color || '',
      photos: initialData?.photos || []
    }
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    
    // In a real app, you would upload these files to a storage service
    // For now, we'll create fake URLs
    const newUrls = files.map((file) => URL.createObjectURL(file));
    
    setPhotoUrls((prev) => [...prev, ...newUrls]);
    form.setValue('photos', [...photoUrls, ...newUrls]);
    
    toast({
      description: `${files.length} photos added successfully`,
      variant: "success",
    });
  };

  const handleRemovePhoto = (index: number) => {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
    form.setValue('photos', photoUrls.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: z.infer<typeof vehicleFormSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Ensure mileage is not null
      const formattedData = {
        ...data,
        mileage: data.mileage || 0,
        photos: photoUrls
      };
      
      console.log('Submitting vehicle data:', formattedData);
      
      // In a real app, you would send this data to your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        description: vehicleId 
          ? 'Vehicle updated successfully' 
          : 'Vehicle added successfully',
        variant: "success",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting vehicle data:', error);
      toast({
        description: 'Failed to save vehicle data. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Toyota" {...field} />
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
                    <Input placeholder="e.g., Camry" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 2022" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber || 0);
                        }}
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
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 25000" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber || 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mileage</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 30000" 
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber || 0);
                      }}
                    />
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
                  <FormLabel>VIN (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Vehicle Identification Number" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Silver" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Vehicle Details</h3>
            
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
            
            <FormField
              control={form.control}
              name="transmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transmission (Optional)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
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
                  <FormLabel>Fuel Type (Optional)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
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
                  <FormLabel>Zip Code (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 90210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add details about the vehicle" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Photos Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Vehicle Photos</h3>
          
          <div className="flex flex-col gap-4">
            {photoUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Vehicle preview ${index + 1}`}
                        className="object-cover w-full h-full" 
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-1 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  JPEG, PNG or WebP (max 10MB)
                </p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                multiple 
                onChange={handlePhotoUpload}
              />
            </label>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {vehicleId ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              vehicleId ? 'Update Vehicle' : 'Add Vehicle'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Both default and named exports for compatibility
export default AddEditVehicleForm;
export { AddEditVehicleForm };
