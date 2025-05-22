
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

// Define form validation schema
const followUpSchema = z.object({
  mileage: z.string()
    .min(1, 'Mileage is required')
    .refine(val => !isNaN(Number(val)), {
      message: 'Mileage must be a number',
    }),
  zipCode: z.string()
    .min(5, 'ZIP Code must be at least 5 characters')
    .max(10, 'ZIP Code must be at most 10 characters'),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']),
  hasAccidents: z.enum(['yes', 'no']),
  ownerCount: z.string().optional(),
});

type FollowUpFormValues = z.infer<typeof followUpSchema>;

interface FollowUpFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

const FollowUpForm: React.FC<FollowUpFormProps> = ({ 
  onSubmit, 
  initialData = {}, 
  isLoading = false 
}) => {
  // Initialize form with react-hook-form
  const form = useForm<FollowUpFormValues>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      mileage: initialData.mileage?.toString() || '',
      zipCode: initialData.zipCode || '90210',
      condition: initialData.condition || 'good',
      hasAccidents: initialData.hasAccidents || 'no',
      ownerCount: initialData.ownerCount?.toString() || '1',
    },
  });

  // Handle form submission
  const handleSubmit = (values: FollowUpFormValues) => {
    // Convert string values to appropriate types
    const processedData = {
      ...values,
      mileage: parseInt(values.mileage, 10),
      ownerCount: values.ownerCount ? parseInt(values.ownerCount, 10) : 1,
      // Map condition to labels for display
      conditionLabel: getConditionLabel(values.condition),
    };
    
    onSubmit(processedData);
  };

  // Helper function to get readable condition labels
  const getConditionLabel = (condition: string): string => {
    switch (condition) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'fair': return 'Fair';
      case 'poor': return 'Poor';
      default: return 'Unknown';
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="mileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Mileage</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number" 
                  placeholder="e.g., 35000" 
                  disabled={isLoading}
                />
              </FormControl>
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
                <Input 
                  {...field} 
                  placeholder="e.g., 90210" 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Overall Condition</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                  disabled={isLoading}
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="excellent" />
                    </FormControl>
                    <FormLabel className="font-normal">Excellent - Like new condition</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="good" />
                    </FormControl>
                    <FormLabel className="font-normal">Good - Minor wear and tear</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="fair" />
                    </FormControl>
                    <FormLabel className="font-normal">Fair - Noticeable wear, may need repairs</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="poor" />
                    </FormControl>
                    <FormLabel className="font-normal">Poor - Significant damage or issues</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hasAccidents"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Accident History</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                  disabled={isLoading}
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="no" />
                    </FormControl>
                    <FormLabel className="font-normal">No Accidents</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="yes" />
                    </FormControl>
                    <FormLabel className="font-normal">Has Accidents</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="ownerCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Previous Owners</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of owners" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1 Owner</SelectItem>
                  <SelectItem value="2">2 Owners</SelectItem>
                  <SelectItem value="3">3 Owners</SelectItem>
                  <SelectItem value="4">4+ Owners</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default FollowUpForm;
