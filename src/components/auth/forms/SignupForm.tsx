
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { UserRole } from '@/types/auth';
import { Badge } from '@/components/ui/badge';

// Define the form schema with validation
const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  dealershipName: z.string().optional(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export interface SignupFormProps {
  role?: UserRole;
  redirectPath?: string;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
  redirectToLogin?: boolean;
  showDealershipField?: boolean;
}

export function SignupForm({
  role = 'individual',
  redirectPath = '/dashboard',
  isLoading: externalLoading,
  setIsLoading: setExternalLoading,
  redirectToLogin = false,
  showDealershipField = false,
}: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Use local or external loading state based on props
  const loading = externalLoading !== undefined ? externalLoading : isLoading;
  const setLoading = setExternalLoading || setIsLoading;
  
  // Create form with or without dealership field based on role
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      dealershipName: '',
    },
  });

  async function onSubmit(data: SignupFormValues) {
    setLoading(true);
    
    try {
      // Prepare user metadata
      const userData = {
        full_name: data.fullName,
        role: role,
      };
      
      // Add dealership name to metadata if provided
      if (role === 'dealer' && data.dealershipName) {
        Object.assign(userData, { dealership_name: data.dealershipName });
      }
      
      const result = await signUp(data.email, data.password, userData);
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      toast.success('Account created successfully!', {
        description: 'Please check your email to verify your account.'
      });
      
      // Determine redirect path based on role
      let targetPath = redirectPath;
      if (role === 'dealer') {
        targetPath = '/dealer/dashboard';
      }
      
      if (redirectToLogin) {
        navigate('/signin/' + role);
      } else {
        navigate(targetPath);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('Failed to create account', {
        description: error.message || 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  }

  // Determine if dealership field should be shown
  const shouldShowDealershipField = showDealershipField || role === 'dealer';

  return (
    <Form {...form}>
      <div className="mb-4">
        <Badge className={`${role === 'dealer' ? 'bg-blue-600' : 'bg-primary'} text-white px-3 py-1 text-sm`}>
          {role === 'dealer' ? 'Dealer Registration' : 'Individual Registration'}
        </Badge>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} disabled={loading} />
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
                <Input type="email" placeholder="you@example.com" {...field} disabled={loading} />
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
                <Input type="password" placeholder="********" {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {shouldShowDealershipField && (
          <FormField
            control={form.control}
            name="dealershipName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dealership Name {role === 'dealer' ? '' : '(Optional)'}</FormLabel>
                <FormControl>
                  <Input placeholder="Your Dealership Name" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </Form>
  );
}
