
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DealerSignupData } from '@/types/dealer';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { isValidEmail, isValidPhone, validatePassword } from '@/components/auth/forms/signup/validation';

const dealerFormSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .refine(isValidEmail, 'Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .refine((value) => validatePassword(value) === '', {
      message: validatePassword('dummy') // This triggers the validation message
    }),
  business_name: z.string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name cannot exceed 100 characters'),
  contact_name: z.string()
    .min(2, 'Contact name must be at least 2 characters')
    .max(100, 'Contact name cannot exceed 100 characters'),
  phone: z.string()
    .refine(isValidPhone, 'Please enter a valid phone number (e.g. +1234567890)'),
});

export function DealerSignupForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DealerSignupData>({
    resolver: zodResolver(dealerFormSchema),
    defaultValues: {
      email: '',
      password: '',
      business_name: '',
      contact_name: '',
      phone: '',
    },
  });

  const onSubmit = async (data: DealerSignupData) => {
    setIsLoading(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpError) throw signUpError;

      const { error: dealerError } = await supabase.from('dealers').insert({
        id: authData.user!.id,
        business_name: data.business_name,
        contact_name: data.contact_name,
        phone: data.phone,
        email: data.email,
      });

      if (dealerError) throw dealerError;

      toast.success('Registration successful', {
        description: 'Your application has been submitted and is pending approval.',
      });
      form.reset();
    } catch (error: any) {
      toast.error('Registration failed', {
        description: error.message || 'Please try again later',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="business_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your business name"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter contact person name"
                  {...field}
                  disabled={isLoading}
                />
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter phone number (e.g. +1234567890)"
                  {...field}
                  type="tel"
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Please include country code (e.g. +1 for US)
              </FormDescription>
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
                <Input 
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password"
                  placeholder="Create a password"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Password must contain at least 8 characters, including uppercase, lowercase, and numbers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? 'Processing...' : 'Submit Application'}
        </Button>
      </form>
    </Form>
  );
}
