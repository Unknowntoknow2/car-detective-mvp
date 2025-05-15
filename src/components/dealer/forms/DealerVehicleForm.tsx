
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
  initialData?: Partial<DealerVehicleFormData>; // Add initialData property for VehicleUploadModal
  isSubmitting?: boolean; // Add for VehicleUploadModal
  submitLabel?: string; // Add for VehicleUploadModal
  showCancel?: boolean; // Add for VehicleUploadModal
  onCancel?: () => void; // Add for VehicleUploadModal
}

export const DealerVehicleForm: React.FC<DealerVehicleFormProps> = ({ 
  onSuccess, 
  vehicleData = {},
  isEditing = false,
  initialData,
  isSubmitting = false,
  submitLabel = "Save Vehicle",
  showCancel = false,
  onCancel
}) => {
  const [isSubmittingInternal, setIsSubmittingInternal] = useState(false);
  
  // Set default values using the vehicleData or initialData or empty values
  const mergedData = { ...vehicleData, ...initialData };
  
  const defaultValues: Partial<DealerVehicleFormData> = {
    make: mergedData.make || '',
    model: mergedData.model || '',
    year: mergedData.year || new Date().getFullYear(),
    price: mergedData.price || 0,
    mileage: mergedData.mileage || 0,
    condition: mergedData.condition || 'Good',
    description: mergedData.description || '',
    status: mergedData.status || 'Available',
    photos: mergedData.photos || [],
    color: mergedData.color || '',
    features: mergedData.features || [],
    vehicleId: mergedData.vehicleId || '',
    id: mergedData.id || '',
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
    setIsSubmittingInternal(true);
    try {
      // If editing, ensure ID is preserved
      const submissionData = {
        ...data,
        id: isEditing ? mergedData.id || mergedData.vehicleId : undefined
      };

      // Call the onSuccess callback with the form data
      await onSuccess(submissionData);
    } catch (error) {
      console.error('Error submitting vehicle data:', error);
    } finally {
      setIsSubmittingInternal(false);
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Sold">Sold</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Reserved">Reserved</SelectItem>
                      </SelectContent>
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
          <CardFooter className="flex gap-2 justify-end">
            {showCancel && onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting || isSubmittingInternal}
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting || isSubmittingInternal}
            >
              {isSubmitting || isSubmittingInternal ? 'Saving...' : submitLabel || (isEditing ? 'Update Vehicle' : 'Add Vehicle')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default DealerVehicleForm;
