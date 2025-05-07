
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { validateVIN, VinInfoMessage } from '@/utils/validation/vin-validation-helpers';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { AlertCircle } from 'lucide-react';

// Extend the form schema to include VIN
const formSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().regex(/^\d{4}$/, "Enter a valid 4-digit year"),
  mileage: z.string().regex(/^\d+$/, "Enter a valid mileage"),
  condition: z.string().min(1, "Condition is required"),
  zipCode: z.string().regex(/^\d{5}$/, "Enter a valid 5-digit ZIP code"),
  vin: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface ManualEntryFormProps {
  onSubmit: (data: FormValues) => void;
}

export const ManualEntryForm: React.FC<ManualEntryFormProps> = ({ onSubmit }) => {
  const [vinError, setVinError] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: '',
      model: '',
      year: '',
      mileage: '',
      condition: '',
      zipCode: '',
      vin: ''
    }
  });
  
  // Watch the VIN field for changes
  const vinValue = form.watch('vin');
  
  // Validate VIN whenever it changes
  useEffect(() => {
    if (!vinValue || vinValue.trim() === '') {
      setVinError(null);
      return;
    }
    
    const { isValid, error } = validateVIN(vinValue);
    setVinError(isValid ? null : error);
  }, [vinValue]);

  const handleSubmit = (values: FormValues) => {
    // Only check VIN validation if a value is provided
    if (values.vin && values.vin.trim() !== '') {
      const { isValid, error } = validateVIN(values.vin);
      if (!isValid) {
        setVinError(error);
        return;
      }
    }
    
    onSubmit(values);
  };

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2019" {...field} />
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
                  <Input placeholder="e.g., 50000" {...field} />
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
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {conditionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 90210" {...field} maxLength={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* New VIN field with validation */}
        <FormField
          control={form.control}
          name="vin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Identification Number (VIN)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter 17-character VIN (optional)" 
                  {...field} 
                  maxLength={17} 
                  className={vinError ? "border-destructive" : ""}
                />
              </FormControl>
              {vinError && (
                <div className="flex items-center gap-1.5 mt-1.5 text-destructive text-sm">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{vinError}</span>
                </div>
              )}
              <VinInfoMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full">
          Get Valuation
        </Button>
      </form>
    </Form>
  );
};
