
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useDealerVehicles } from '@/hooks/useDealerVehicles';
import { Loader2 } from 'lucide-react';
import { useVehicleLookup } from '@/hooks/useVehicleLookup';
import VinLookup from '@/components/lookup/VinLookup';

// Define the Zod schema for the form
const vehicleFormSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1900, 'Year must be at least 1900').max(new Date().getFullYear() + 1),
  price: z.number().min(0, 'Price must be a positive number'),
  mileage: z.number().min(0, 'Mileage must be a positive number').optional().default(0),
  condition: z.enum(['Excellent', 'Good', 'Fair', 'Poor']),
  status: z.enum(['available', 'pending', 'sold']),
  photos: z.array(z.string()),
  transmission: z.enum(['Automatic', 'Manual', 'CVT']).optional(),
  fuel_type: z.enum(['Gasoline', 'Diesel', 'Hybrid', 'Electric']).optional(),
  zip_code: z.string().min(1, 'Zip code is required'),
  description: z.string().optional(),
  vin: z.string().optional(),
  color: z.string().optional(),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface AddEditVehicleFormProps {
  vehicleId?: string;
  onSuccess?: () => void;
}

const AddEditVehicleForm = ({ vehicleId, onSuccess }: AddEditVehicleFormProps) => {
  const [isLookingUp, setIsLookingUp] = useState(false);
  const { addVehicle, isLoading } = useDealerVehicles();
  const { lookupByVin, isLoading: isVinLoading, error: vinError } = useVehicleLookup();

  // Initialize the form with default values
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      condition: 'Good',
      status: 'available',
      photos: [],
      zip_code: '',
      description: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: VehicleFormValues) => {
    try {
      const success = await addVehicle(data);
      if (success) {
        toast.success('Vehicle added successfully');
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error('Failed to add vehicle');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error('An error occurred while adding the vehicle');
    }
  };

  // Handle VIN lookup
  const handleVinLookup = async (vin: string) => {
    setIsLookingUp(true);
    try {
      const vehicleData = await lookupByVin(vin);
      
      if (vehicleData) {
        form.setValue('make', vehicleData.make);
        form.setValue('model', vehicleData.model);
        form.setValue('year', vehicleData.year);
        form.setValue('vin', vin);
        
        if (vehicleData.transmission) {
          form.setValue('transmission', vehicleData.transmission as any);
        }
        
        if (vehicleData.fuelType) {
          form.setValue('fuel_type', vehicleData.fuelType as any);
        }
        
        if (vehicleData.exteriorColor) {
          form.setValue('color', vehicleData.exteriorColor);
        }
        
        toast.success('Vehicle information loaded');
      } else {
        toast.error('No vehicle information found for this VIN');
      }
    } catch (error) {
      console.error("VIN lookup error:", error);
      toast.error('Error looking up VIN');
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-md bg-muted/50">
        <h3 className="text-lg font-medium mb-2">VIN Lookup</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Quickly populate vehicle details by entering a VIN
        </p>
        <VinLookup 
          onSubmit={handleVinLookup} 
          isLoading={isVinLoading || isLookingUp} 
        />
        {vinError && (
          <p className="text-sm text-red-500 mt-2">{vinError}</p>
        )}
      </div>

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
                    <Input placeholder="e.g. Toyota" {...field} />
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
                    <Input placeholder="e.g. Camry" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g. 2023" 
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                      value={field.value || ''}
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
                      placeholder="e.g. 25000" 
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                      value={field.value || ''}
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
                      placeholder="e.g. 15000" 
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <FormControl>
                    <select
                      className="w-full p-2 border rounded-md"
                      {...field}
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </FormControl>
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
                  <FormControl>
                    <select
                      className="w-full p-2 border rounded-md"
                      {...field}
                    >
                      <option value="available">Available</option>
                      <option value="pending">Pending</option>
                      <option value="sold">Sold</option>
                    </select>
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
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Silver" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="transmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transmission</FormLabel>
                  <FormControl>
                    <select
                      className="w-full p-2 border rounded-md"
                      {...field}
                      value={field.value || ''}
                    >
                      <option value="">Select Transmission</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="CVT">CVT</option>
                    </select>
                  </FormControl>
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
                  <FormControl>
                    <select
                      className="w-full p-2 border rounded-md"
                      {...field}
                      value={field.value || ''}
                    >
                      <option value="">Select Fuel Type</option>
                      <option value="Gasoline">Gasoline</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 90210" {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter vehicle description" 
                    className="min-h-[120px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Add Vehicle'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddEditVehicleForm;
