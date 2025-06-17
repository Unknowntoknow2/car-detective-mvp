
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const dealerSignupSchema = z.object({
  dealershipName: z.string().min(2, 'Dealership name must be at least 2 characters'),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Please enter a valid address'),
  licenseNumber: z.string().min(1, 'Dealer license number is required'),
});

type DealerSignupFormData = z.infer<typeof dealerSignupSchema>;

export const DealerSignupForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<DealerSignupFormData>({
    resolver: zodResolver(dealerSignupSchema),
    defaultValues: {
      dealershipName: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      licenseNumber: '',
    },
  });

  const onSubmit = async (data: DealerSignupFormData) => {
    setIsLoading(true);
    try {
      console.log('Dealer signup data:', data);
      // Handle signup logic here
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="dealershipName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dealership Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your dealership name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contactName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your business address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="licenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dealer License Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your dealer license number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Dealer Account'}
        </Button>
      </form>
    </Form>
  );
};
