
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
  email: z.string()
    .min(1, 'Email is required')
    .refine(isValidEmail, 'Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .refine((value) => validatePassword(value) === '', {
      message: validatePassword('dummy') // This triggers the validation message
    }),
  dealership_name: z.string()
    .min(2, 'Dealership name must be at least 2 characters')
    .max(100, 'Dealership name cannot exceed 100 characters'),
  contact_name: z.string()
    .min(2, 'Contact name must be at least 2 characters')
    .max(100, 'Contact name cannot exceed 100 characters'),
  phone: z.string()
    .optional()
    .refine((val) => !val || isValidPhone(val), 'Please enter a valid phone number (e.g. +1234567890)'),
});

// Define the dealer signup data type
type DealerSignupData = z.infer<typeof dealerFormSchema>;

export function DealerSignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<DealerSignupData>({
    resolver: zodResolver(dealerFormSchema),
    defaultValues: {
      email: '',
      password: '',
      dealership_name: '',
      contact_name: '',
      phone: '',
    },
  });

  const onSubmit = async (data: DealerSignupData) => {
    setIsLoading(true);
    try {
      // First register the user with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.contact_name,
            user_role: 'dealer',
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create the dealer application
        const { error: applicationError } = await supabase
          .from('dealer_applications')
          .insert({
            user_id: authData.user.id,
            dealership_name: data.dealership_name,
            contact_name: data.contact_name,
            phone: data.phone || null,
            email: data.email,
          });

        if (applicationError) {
          // If there was an error with the application, rollback by deleting the user
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw applicationError;
        }

        // Update the user's profile with the dealer role
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ user_role: 'dealer' })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          // Continue anyway as this is not critical
        }

        toast.success('Registration successful', {
          description: 'Your dealer application has been submitted and is pending review.',
        });
        
        // Redirect to the dealer dashboard
        navigate('/dealer-dashboard');
      }
    } catch (error: any) {
      let errorMessage = 'Registration failed';
      
      // Handle specific error cases
      if (error.message?.includes('already registered')) {
        errorMessage = 'This email is already registered';
      } else if (error.message?.includes('unique constraint')) {
        errorMessage = 'This dealership name is already registered';
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="dealership_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dealership Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your dealership name"
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
          {isLoading ? 'Processing...' : 'Submit Application'}
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
