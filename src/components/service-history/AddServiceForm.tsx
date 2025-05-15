
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

// Define the form schema
const formSchema = z.object({
  serviceType: z.string().min(1, { message: 'Service type is required' }),
  mileage: z.coerce.number().min(0, { message: 'Mileage must be a positive number' }),
  date: z.string().min(1, { message: 'Date is required' }),
  cost: z.coerce.number().min(0, { message: 'Cost must be a positive number' }),
  shop: z.string().optional(),
  notes: z.string().optional(),
});

// Form data type
type ServiceFormData = z.infer<typeof formSchema>;

interface AddServiceFormProps {
  onSubmit: (data: ServiceFormData) => Promise<void>;
  isLoading?: boolean;
}

export const AddServiceForm: React.FC<AddServiceFormProps> = ({ onSubmit, isLoading = false }) => {
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: '',
      mileage: 0,
      date: new Date().toISOString().split('T')[0],
      cost: 0,
      shop: '',
      notes: '',
    },
  });

  const handleSubmit = async (data: ServiceFormData) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type</FormLabel>
                <FormControl>
                  <Input placeholder="Oil Change, Brake Service, etc." {...field} />
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
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="shop"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Shop (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Where the service was performed" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional details about the service"
                  className="resize-y"
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
              Adding Service Record...
            </>
          ) : (
            'Add Service Record'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddServiceForm;
