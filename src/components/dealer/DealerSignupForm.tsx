
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
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { isValidEmail, isValidPhone, validatePassword } from '@/components/auth/forms/signup/validation';

// Define the dealer signup form schema
const dealerFormSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters'),
  email: z.string()
    .min(1, 'Email is required')
    .refine(isValidEmail, {
      message: 'Invalid email format',
    }),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .refine((value) => validatePassword(value) === '', {
      message: validatePassword,
    }),
  dealershipName: z.string()
    .min(2, 'Dealership name must be at least 2 characters')
    .max(100, 'Dealership name cannot exceed 100 characters'),
  phone: z.string()
    .optional()
    .refine((val) => !val || isValidPhone(val), {
      message: 'Please enter a valid phone number (e.g. +1234567890)',
    }),
});

// Define the dealer signup data type
type DealerSignupData = z.infer<typeof dealerFormSchema>;

export function DealerSignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [dealershipError, setDealershipError] = useState('');
  const navigate = useNavigate();

  const form = useForm<DealerSignupData>({
    resolver: zodResolver(dealerFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      dealershipName: '',
      phone: '',
    },
  });

  // Check if dealership name already exists
  const checkDealershipName = async (name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('dealership_name', name)
        .limit(1);
      
      if (error) throw error;
      
      // Return true if dealership exists (data has at least one item)
      return data && data.length > 0;
    } catch (err) {
      console.error('Error checking dealership name:', err);
      return false; // Default to allowing submit on error
    }
  };

  const onSubmit = async (data: DealerSignupData) => {
    try {
      setIsLoading(true);
      setDealershipError('');

      // Check if dealership name already exists
      const dealershipExists = await checkDealershipName(data.dealershipName);
      if (dealershipExists) {
        setDealershipError('This dealership name is already registered');
        setIsLoading(false);
        return;
      }

      // Register the user with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            user_role: 'dealer',
            dealership_name: data.dealershipName,
            phone: data.phone || null,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Update the profile with dealer role and dealership name
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: authData.user.id,
            full_name: data.fullName,
            user_role: 'dealer',
            dealership_name: data.dealershipName,
          });

        if (profileError) {
          console.error('Error updating profile:', profileError);
          throw profileError;
        }

        toast.success('Registration successful', {
          description: 'Your dealer account has been created.',
        });
        
        // Redirect to the dealer dashboard
        navigate('/dealer-dashboard');
      }
    } catch (error: any) {
      let errorMessage = 'Registration failed';
      
      // Handle specific error cases
      if (error.message?.includes('already registered')) {
        errorMessage = 'This email is already registered';
      }
      
      toast.error(errorMessage, {
        description: error.message || 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your full name"
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
          name="dealershipName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dealership Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your dealership name"
                  {...field}
                  disabled={isLoading}
                  onChange={(e) => {
                    field.onChange(e);
                    setDealershipError('');
                  }}
                />
              </FormControl>
              {dealershipError && (
                <p className="text-sm font-medium text-destructive">{dealershipError}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter phone number (e.g. +1234567890)"
                  {...field}
                  type="tel"
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Include country code (e.g. +1 for US)
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
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Dealer Account'}
        </Button>

        <div className="text-center mt-4">
          <Link to="/login-dealer" className="text-primary hover:underline text-sm">
            Already have a dealer account? Login here
          </Link>
        </div>
      </form>
    </Form>
  );
}
