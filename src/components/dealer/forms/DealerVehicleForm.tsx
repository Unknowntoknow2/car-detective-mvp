
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Update the interface to include missing fields and isEditing property
export interface DealerVehicleFormData {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: string;
  description?: string;
  status: string;
  photos: string[];
  id?: string;
  vehicleId?: string;
  color?: string;
  features?: string[];
}

export interface DealerVehicleFormProps {
  onSuccess: (data: DealerVehicleFormData) => void;
  vehicleData?: Partial<DealerVehicleFormData>;
  isEditing?: boolean; // Add isEditing property
}

export const DealerVehicleForm: React.FC<DealerVehicleFormProps> = ({ 
  onSuccess, 
  vehicleData = {},
  isEditing = false 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set default values using the vehicleData or empty values
  const defaultValues: Partial<DealerVehicleFormData> = {
    make: vehicleData.make || '',
    model: vehicleData.model || '',
    year: vehicleData.year || new Date().getFullYear(),
    price: vehicleData.price || 0,
    mileage: vehicleData.mileage || 0,
    condition: vehicleData.condition || 'Good',
    description: vehicleData.description || '',
    status: vehicleData.status || 'Available',
    photos: vehicleData.photos || [],
    color: vehicleData.color || '',
    features: vehicleData.features || [],
    vehicleId: vehicleData.vehicleId || '',
    id: vehicleData.id || '',
  };

  // Create form schema with Zod
  const formSchema = z.object({
    make: z.string().min(1, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.coerce.number().min(1900, 'Year must be at least 1900').max(new Date().getFullYear() + 1),
    price: z.coerce.number().min(0, 'Price cannot be negative'),
    mileage: z.coerce.number().min(0, 'Mileage cannot be negative'),
    condition: z.string().min(1, 'Condition is required'),
    description: z.string().optional(),
    status: z.string().min(1, 'Status is required'),
    photos: z.array(z.string()),
    color: z.string().optional(),
    features: z.array(z.string()).optional(),
    vehicleId: z.string().optional(),
    id: z.string().optional(),
  });

  const form = useForm<DealerVehicleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const handleSubmit = async (data: DealerVehicleFormData) => {
    setIsSubmitting(true);
    try {
      // If editing, ensure ID is preserved
      const submissionData = {
        ...data,
        id: isEditing ? vehicleData.id || vehicleData.vehicleId : undefined
      };

      // Call the onSuccess callback with the form data
      await onSuccess(submissionData);
    } catch (error) {
      console.error('Error submitting vehicle data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
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
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                      <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Select condition" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="Excellent">Excellent</Select.Item>
                        <Select.Item value="Good">Good</Select.Item>
                        <Select.Item value="Fair">Fair</Select.Item>
                        <Select.Item value="Poor">Poor</Select.Item>
                      </Select.Content>
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
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Select status" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="Available">Available</Select.Item>
                        <Select.Item value="Sold">Sold</Select.Item>
                        <Select.Item value="Pending">Pending</Select.Item>
                        <Select.Item value="Reserved">Reserved</Select.Item>
                      </Select.Content>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Silver" {...field} />
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
                      placeholder="Vehicle details..."
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Photo upload would be added here */}
            <div>
              <Label htmlFor="photos">Vehicle Photos</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Upload up to 10 photos of the vehicle
              </p>
              {/* Photo upload component would go here */}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default DealerVehicleForm;
